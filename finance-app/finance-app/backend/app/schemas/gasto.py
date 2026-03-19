from pydantic import BaseModel, field_validator
from datetime import datetime

class GastoCreate(BaseModel):
    valor: float
    descricao: str
    categoria: str
    essencial: bool = False
    data: datetime

    @field_validator("valor")
    @classmethod
    def valor_positivo(cls, v):
        if v <= 0:
            raise ValueError("O valor do gasto deve ser positivo.")
        return v

class GastoUpdate(BaseModel):
    essencial: bool

class GastoResponse(BaseModel):
    id: int
    valor: float
    descricao: str
    categoria: str
    essencial: bool
    data: datetime
    criado_em: datetime

    class Config:
        from_attributes = True