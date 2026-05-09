from pydantic import BaseModel, EmailStr
from pydantic import BaseModel, EmailStr, field_validator
import re

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: str

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class UpdatePassword(BaseModel):
    senha_atual: str
    nova_senha: str

class UpdateProfile(BaseModel):
    nome: str = ""

    @field_validator("nome")
    @classmethod
    def validar_nome(cls, value):
        value = value.strip()

        if not value:
            raise ValueError("Informe seu nome.")

        if not re.fullmatch(r"[A-Za-zÀ-ÿ\s]+", value):
            raise ValueError("O nome deve conter apenas letras e espaços.")

        return value
