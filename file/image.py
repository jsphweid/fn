import io
from typing import Union
from PIL import Image as PilImage


class Image:
    _img: str

    def __init__(self, img: PilImage):
        self._img = img

    @classmethod
    def from_file(cls, file: Union[str, io.BytesIO]) -> 'Image':
        return Image(img=PilImage.open(file, mode='r'))

    @classmethod
    def from_bytes(cls, b: bytes) -> 'Image':
        return Image.from_file(io.BytesIO(b))

    def to_png_bytes(self) -> bytes:
        b = io.BytesIO()
        self._img.save(b, format='PNG')
        return b.getbuffer().tobytes()
