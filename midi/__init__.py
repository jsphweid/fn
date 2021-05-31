import io

from note_seq import NoteSequence, note_sequence_to_pretty_midi
from pretty_midi import PrettyMIDI


class Midi:
    """
    For now this is just a class that uses pretty_midi internally
    """

    def __init__(self, pretty_midi: PrettyMIDI):
        self._pretty_midi = pretty_midi
        assert isinstance(pretty_midi, PrettyMIDI)

    @classmethod
    def from_note_sequence(cls, note_sequence: NoteSequence) -> 'Midi':
        return Midi(note_sequence_to_pretty_midi(note_sequence))

    @classmethod
    def from_bytes(cls, b: bytes) -> 'Midi':
        return Midi(PrettyMIDI(io.BytesIO(b)))

    def save_locally(self, output_path: str):
        self._pretty_midi.write(open(output_path, 'wb'))

    def to_bytes(self) -> bytes:
        b = io.BytesIO()
        self._pretty_midi.write(b)
        return b.getbuffer().tobytes()
