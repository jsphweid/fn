""" NOTE: this code is 100% copy/paste from Wave_U_Net repository with minor alterations to fit into one file"""

import tensorflow.compat.v1 as tf
import numpy as np

from fn.wav_u_net import helpers


def independent_outputs(featuremap, source_names, num_channels, filter_width, padding, activation):
    outputs = dict()
    for name in source_names:
        outputs[name] = tf.layers.conv1d(featuremap, num_channels, filter_width, activation=activation, padding=padding)
    return outputs


def difference_output(input_mix, featuremap, source_names, num_channels, filter_width, padding, activation, training):
    outputs = dict()
    sum_source = 0
    for name in source_names[:-1]:
        out = tf.layers.conv1d(featuremap, num_channels, filter_width, activation=activation, padding=padding)
        outputs[name] = out
        sum_source = sum_source + out

    # Compute last source based on the others
    last_source = helpers.crop(input_mix, sum_source.get_shape().as_list()) - sum_source
    last_source = helpers.AudioClip(last_source, training)
    outputs[source_names[-1]] = last_source
    return outputs


def LeakyReLU(x, alpha=0.2):
    return tf.maximum(alpha * x, x)


def learned_interpolation_layer(input, padding, level):
    '''
    Implements a trainable upsampling layer by interpolation by a factor of two, from N samples to N*2 - 1.
    Interpolation of intermediate feature vectors v_1 and v_2 (of dimensionality F) is performed by
     w \cdot v_1 + (1-w) \cdot v_2, where \cdot is point-wise multiplication, and w an F-dimensional weight vector constrained to [0,1]
    :param input: Input features of shape [batch_size, 1, width, F]
    :param padding:
    :param level:
    :return:
    '''
    assert (padding == "valid" or padding == "same")
    features = input.get_shape().as_list()[3]

    # Construct 2FxF weight matrix, where F is the number of feature channels in the feature map.
    # Matrix is constrained, made up out of two diagonal FxF matrices with diagonal weights w and 1-w. w is constrained to be in [0,1] # mioid
    weights = tf.get_variable("interp_" + str(level), shape=[features], dtype=tf.float32)
    weights_scaled = tf.nn.sigmoid(weights)  # Constrain weights to [0,1]
    counter_weights = 1.0 - weights_scaled  # Mirrored weights for the features from the other time step
    conv_weights = tf.expand_dims(
        tf.concat([tf.expand_dims(tf.diag(weights_scaled), axis=0), tf.expand_dims(tf.diag(counter_weights), axis=0)],
                  axis=0), axis=0)
    intermediate_vals = tf.nn.conv2d(input, conv_weights, strides=[1, 1, 1, 1], padding=padding.upper())

    intermediate_vals = tf.transpose(intermediate_vals, [2, 0, 1, 3])
    out = tf.transpose(input, [2, 0, 1, 3])
    num_entries = out.get_shape().as_list()[0]
    out = tf.concat([out, intermediate_vals], axis=0)
    indices = list()

    # Interleave interpolated features with original ones, starting with the first original one
    num_outputs = (2 * num_entries - 1) if padding == "valid" else 2 * num_entries
    for idx in range(num_outputs):
        if idx % 2 == 0:
            indices.append(idx // 2)
        else:
            indices.append(num_entries + idx // 2)
    out = tf.gather(out, indices)
    current_layer = tf.transpose(out, [1, 2, 0, 3])
    return current_layer


class UnetAudioSeparator:
    '''
    U-Net separator network for singing voice separation.
    Uses valid convolutions, so it predicts for the centre part of the input - only certain input and output shapes are therefore possible (see getpadding function)
    '''

    def __init__(self, model_config):
        '''
        Initialize U-net
        :param num_layers: Number of down- and upscaling layers in the network 
        '''
        self.num_layers = model_config["num_layers"]
        self.num_initial_filters = model_config["num_initial_filters"]
        self.filter_size = model_config["filter_size"]
        self.merge_filter_size = model_config["merge_filter_size"]
        self.input_filter_size = model_config["input_filter_size"]
        self.output_filter_size = model_config["output_filter_size"]
        self.upsampling = model_config["upsampling"]
        self.output_type = model_config["output_type"]
        self.context = model_config["context"]
        self.padding = "valid" if model_config["context"] else "same"
        self.source_names = model_config["source_names"]
        self.num_channels = 1 if model_config["mono_downmix"] else 2
        self.output_activation = model_config["output_activation"]

    def get_padding(self, shape):
        '''
        Calculates the required amounts of padding along each axis of the input and output, so that the Unet works and has the given shape as output shape
        :param shape: Desired output shape 
        :return: Input_shape, output_shape, where each is a list [batch_size, time_steps, channels]
        '''

        if self.context:
            # Check if desired shape is possible as output shape - go from output shape towards lowest-res feature map
            rem = float(shape[1])  # Cut off batch size number and channel

            # Output filter size
            rem = rem - self.output_filter_size + 1

            # Upsampling blocks
            for i in range(self.num_layers):
                rem = rem + self.merge_filter_size - 1
                rem = (rem + 1.) / 2.  # out = in + in - 1 <=> in = (out+1)/

            # Round resulting feature map dimensions up to nearest integer
            x = np.asarray(np.ceil(rem), dtype=np.int64)
            assert (x >= 2)

            # Compute input and output shapes based on lowest-res feature map
            output_shape = x
            input_shape = x

            # Extra conv
            input_shape = input_shape + self.filter_size - 1

            # Go from centre feature map through up- and downsampling blocks
            for i in range(self.num_layers):
                output_shape = 2 * output_shape - 1  # Upsampling
                output_shape = output_shape - self.merge_filter_size + 1  # Conv

                input_shape = 2 * input_shape - 1  # Decimation
                if i < self.num_layers - 1:
                    input_shape = input_shape + self.filter_size - 1  # Conv
                else:
                    input_shape = input_shape + self.input_filter_size - 1

            # Output filters
            output_shape = output_shape - self.output_filter_size + 1

            input_shape = np.concatenate([[shape[0]], [input_shape], [self.num_channels]])
            output_shape = np.concatenate([[shape[0]], [output_shape], [self.num_channels]])

            return input_shape, output_shape
        else:
            return [shape[0], shape[1], self.num_channels], [shape[0], shape[1], self.num_channels]

    def get_output(self, input, training, return_spectrogram=False, reuse=True):
        '''
        Creates symbolic computation graph of the U-Net for a given input batch
        :param input: Input batch of mixtures, 3D tensor [batch_size, num_samples, num_channels]
        :param reuse: Whether to create new parameter variables or reuse existing ones
        :return: U-Net output: List of source estimates. Each item is a 3D tensor [batch_size, num_out_samples, num_channels]
        '''
        with tf.variable_scope("separator", reuse=reuse):
            enc_outputs = list()
            current_layer = input

            # Down-convolution: Repeat strided conv
            for i in range(self.num_layers):
                current_layer = tf.layers.conv1d(current_layer,
                                                 self.num_initial_filters + (self.num_initial_filters * i),
                                                 self.filter_size, strides=1, activation=LeakyReLU,
                                                 padding=self.padding)  # out = in - filter + 1
                enc_outputs.append(current_layer)
                current_layer = current_layer[:, ::2, :]  # Decimate by factor of 2 # out = (in-1)/2 + 1

            current_layer = tf.layers.conv1d(current_layer,
                                             self.num_initial_filters + (self.num_initial_filters * self.num_layers),
                                             self.filter_size, activation=LeakyReLU,
                                             padding=self.padding)  # One more conv here since we need to compute features after last decimation

            # Feature map here shall be X along one dimension

            # Upconvolution
            for i in range(self.num_layers):
                # UPSAMPLING
                current_layer = tf.expand_dims(current_layer, axis=1)
                if self.upsampling == 'learned':
                    # Learned interpolation between two neighbouring time positions by using a convolution filter of width 2, and inserting the responses in the middle of the two respective inputs
                    current_layer = learned_interpolation_layer(current_layer, self.padding, i)
                else:
                    if self.context:
                        current_layer = tf.image.resize_bilinear(current_layer,
                                                                 [1, current_layer.get_shape().as_list()[2] * 2 - 1],
                                                                 align_corners=True)
                    else:
                        current_layer = tf.image.resize_bilinear(current_layer, [1, current_layer.get_shape().as_list()[
                            2] * 2])  # out = in + in - 1
                current_layer = tf.squeeze(current_layer, axis=1)
                # UPSAMPLING FINISHED

                assert (enc_outputs[-i - 1].get_shape().as_list()[1] == current_layer.get_shape().as_list()[
                    1] or self.context)  # No cropping should be necessary unless we are using context
                current_layer = helpers.crop_and_concat(enc_outputs[-i - 1], current_layer, match_feature_dim=False)
                current_layer = tf.layers.conv1d(current_layer, self.num_initial_filters + (
                            self.num_initial_filters * (self.num_layers - i - 1)), self.merge_filter_size,
                                                 activation=LeakyReLU,
                                                 padding=self.padding)  # out = in - filter + 1

            current_layer = helpers.crop_and_concat(input, current_layer, match_feature_dim=False)

            # Output layer
            # Determine output activation function
            if self.output_activation == "tanh":
                out_activation = tf.tanh
            elif self.output_activation == "linear":
                out_activation = lambda x: helpers.AudioClip(x, training)
            else:
                raise NotImplementedError

            if self.output_type == "direct":
                return independent_outputs(current_layer, self.source_names, self.num_channels, self.output_filter_size,
                                           self.padding, out_activation)
            elif self.output_type == "difference":
                cropped_input = helpers.crop(input, current_layer.get_shape().as_list(), match_feature_dim=False)
                return difference_output(cropped_input, current_layer, self.source_names, self.num_channels,
                                         self.output_filter_size, self.padding, out_activation, training)
            else:
                raise NotImplementedError
