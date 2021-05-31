import tensorflow as tf

from tensorflow.python.tools.inspect_checkpoint import print_tensors_in_checkpoint_file
print_tensors_in_checkpoint_file(file_name='./models/piano_transcriber_checkpoint/model.ckpt', tensor_name='', all_tensors=False)




tf.reset_default_graph()



thing = tf.placeholder(tf.float32, [None])

sess = tf.Session()
sess.run(tf.global_variables_initializer())

restorer = tf.train.Saver(None, write_version=tf.train.SaverDef.V2)
restorer.restore(sess, "models/piano_transcriber_checkpoint/model.ckpt")

import os
export_dir = os.getcwd()

tf.saved_model.simple_save(
    sess,
    f"{export_dir}/newsaved",
    inputs={"mix_context": thing},
    outputs={"mix_context": thing},
)

