from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey, Boolean
from datetime import datetime
from app.core.database import Base

class Gasto(Base):
    __tablename__ = "gastos"

    id = Column(Integer, primary_key=True, index=True)
    valor = Column(Float, nullable=False)
    descricao = Column(String, nullable=False)
    categoria = Column(String, nullable=False)
    essencial = Column(Boolean, default=False)
    data = Column(DateTime, nullable=False)
    criado_em = Column(DateTime, default=datetime.utcnow)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)