from pydantic import BaseModel, field_validator
from datetime import datetime

class RendaCreate(BaseModel):
    valor: float
    descricao: str = ""
    mes: int
    ano: int

    @field_validator("valor")
    @classmethod
    def valor_positivo(cls, v):
        if v <= 0:
            raise ValueError("O valor da renda deve ser positivo.")
        return v

    @field_validator("mes")
    @classmethod
    def mes_valido(cls, v):
        if not 1 <= v <= 12:
            raise ValueError("Mês deve ser entre 1 e 12.")
        return v

class RendaResponse(BaseModel):
    id: int
    valor: float
    descricao: str
    mes: int
    ano: int
    criado_em: datetime

    class Config:
        from_attributes = True