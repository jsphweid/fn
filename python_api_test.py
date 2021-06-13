import logging
import os
import tensorflow as tf
import time
import calendar

new_folder_name = f"outputs/{calendar.timegm(time.gmtime())}"

if not os.path.exists(new_folder_name):
    os.makedirs(new_folder_name)

tf.get_logger().setLevel('ERROR')

logging.basicConfig(format='%(message)s', level=logging.INFO)
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# m4_result = m4.m4(Audio.from_local_file("ss-mix.wav"))
# m4_result.vocals.save_locally(f"{new_folder_name}/m4-vocals.wav")
# m4_result.accompaniment.save_locally(f"{new_folder_name}/m4-accompaniment.wav")
#
# m5_result = m5_highsr.m5_highsr(Audio.from_local_file("ss-mix.wav"))
# m5_result.vocals.save_locally(f"{new_folder_name}/m5-highsr-vocals.wav")
# m5_result.accompaniment.save_locally(f"{new_folder_name}/m5-highsr-accompaniment.wav")
#
# m6_result = m6.m6(Audio.from_local_file("ss-mix.wav"))
# m6_result.vocals.save_locally(f"{new_folder_name}/m6-vocals.wav")
# m6_result.other.save_locally(f"{new_folder_name}/m6-other.wav")
# m6_result.drums.save_locally(f"{new_folder_name}/m6-drums.wav")
# m6_result.bass.save_locally(f"{new_folder_name}/m6-bass.wav")
#
# transcribe_piano(Audio.from_local_file("static/piano.wav")).save_locally(f"{new_folder_name}/alkan-short-piano-transcribed.wav.midi")
#
# transcribe_drums(Audio.from_local_file("drums.wav")).save_locally(f"{new_folder_name}/nirvana-drums-transcribed.wav.midi")
#
# assert half_plus_two([2.0, 4.0, 99.0]) == [3.0, 4.0, 51.5]

# # NOTE: doesn't work yet
# # generate_piano()

# print(get_audio_tags(Audio.from_local_file("static/piano.wav")))

# pitch_shift_result = pitch_shift(Audio.from_local_file("alkan-short.wav"), 2.5)
# pitch_shift_result.save_locally(f"{new_folder_name}/pitch_shift_alkan-short.wav")

# assert adder([1, 2, 3]) == 6

# Audio.from_local_file("alkan-short.wav").to_wav_bytes()
