import numpy as np
import tensorflow.compat.v1 as tf
import librosa


def resample(audio, orig_sr, new_sr):
    return librosa.resample(audio.T, orig_sr, new_sr).T


def AudioClip(x, training):
    '''
    Simply returns the input if training is set to True, otherwise clips the input to [-1,1]
    :param x: Input tensor (coming from last layer of neural network)
    :param training: Whether model is in training (True) or testing mode (False)
    :return: Output tensor (potentially clipped)
    '''
    if training:
        return x
    else:
        return tf.maximum(tf.minimum(x, 1.0), -1.0)


def crop(tensor, target_shape, match_feature_dim=True):
    '''
    Crops a 3D tensor [batch_size, width, channels] along the width axes to a target shape.
    Performs a centre crop. If the dimension difference is uneven, crop last dimensions first.
    :param tensor: 4D tensor [batch_size, width, height, channels] that should be cropped.
    :param target_shape: Target shape (4D tensor) that the tensor should be cropped to
    :return: Cropped tensor
    '''
    shape = np.array(tensor.get_shape().as_list())
    diff = shape - np.array(target_shape)
    assert (diff[0] == 0 and (diff[2] == 0 or not match_feature_dim))  # Only width axis can differ
    if (diff[1] % 2 != 0):
        print("WARNING: Cropping with uneven number of extra entries on one side")
    assert diff[1] >= 0  # Only positive difference allowed
    if diff[1] == 0:
        return tensor
    crop_start = diff // 2
    crop_end = diff - crop_start

    return tensor[:, crop_start[1]:-crop_end[1], :]


def crop_and_concat(x1, x2, match_feature_dim=True):
    '''
    Copy-and-crop operation for two feature maps of different size.
    Crops the first input x1 equally along its borders so that its shape is equal to
    the shape of the second input x2, then concatenates them along the feature channel axis.
    :param x1: First input that is cropped and combined with the second input
    :param x2: Second input
    :return: Combined feature map
    '''
    if x2 is None:
        return x1

    x1 = crop(x1, x2.get_shape().as_list(), match_feature_dim)
    return tf.concat([x1, x2], axis=2)
