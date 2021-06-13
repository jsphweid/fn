from pydantic import BaseModel

from fn.file.audio import Audio


class TypeModel(BaseModel):
    class Config:
        arbitrary_types_allowed = True


class VocalSourceSeparationResult(TypeModel):
    vocals: Audio
    accompaniment: Audio


class BasicBandSourceSeparationResult(TypeModel):
    bass: Audio
    drums: Audio
    other: Audio
    vocals: Audio
