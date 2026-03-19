from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey, String
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class Renda(Base):
    __tablename__ = "rendas"

    id = Column(Integer, primary_key=True, index=True)
    valor = Column(Float, nullable=False)
    descricao = Column(String, nullable=True)
    mes = Column(Integer, nullable=False)
    ano = Column(Integer, nullable=False)
    criado_em = Column(DateTime, default=datetime.utcnow)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)