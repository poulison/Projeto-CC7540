from sqlalchemy.orm import Session
from app.models.renda import Renda
from app.schemas.renda import RendaCreate
from fastapi import HTTPException

def cadastrar_renda(db: Session, dados: RendaCreate, user_id: int):
    # Verifica se já existe renda para esse mês/ano
    existente = db.query(Renda).filter(
        Renda.user_id == user_id,
        Renda.mes == dados.mes,
        Renda.ano == dados.ano
    ).first()

    if existente:
        # Atualiza em vez de criar duplicata
        existente.valor = dados.valor
        existente.descricao = dados.descricao
        db.commit()
        db.refresh(existente)
        return existente

    nova = Renda(**dados.model_dump(), user_id=user_id)
    db.add(nova)
    db.commit()
    db.refresh(nova)
    return nova

def buscar_renda_mes(db: Session, user_id: int, mes: int, ano: int):
    return db.query(Renda).filter(
        Renda.user_id == user_id,
        Renda.mes == mes,
        Renda.ano == ano
    ).first()