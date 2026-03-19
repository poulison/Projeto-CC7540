from sqlalchemy.orm import Session
from app.models.gasto import Gasto
from app.schemas.gasto import GastoCreate, GastoUpdate
from fastapi import HTTPException
from datetime import datetime

def registrar_gasto(db: Session, dados: GastoCreate, user_id: int):
    novo = Gasto(**dados.model_dump(), user_id=user_id)
    db.add(novo)
    db.commit()
    db.refresh(novo)
    return novo

def listar_gastos_mes(db: Session, user_id: int, mes: int, ano: int):
    inicio = datetime(ano, mes, 1)
    if mes == 12:
        fim = datetime(ano + 1, 1, 1)
    else:
        fim = datetime(ano, mes + 1, 1)

    return db.query(Gasto).filter(
        Gasto.user_id == user_id,
        Gasto.data >= inicio,
        Gasto.data < fim
    ).order_by(Gasto.data.desc()).all()

def classificar_gasto(db: Session, gasto_id: int, dados: GastoUpdate, user_id: int):
    gasto = db.query(Gasto).filter(
        Gasto.id == gasto_id,
        Gasto.user_id == user_id
    ).first()

    if not gasto:
        raise HTTPException(status_code=404, detail="Gasto não encontrado.")

    gasto.essencial = dados.essencial
    db.commit()
    db.refresh(gasto)
    return gasto

def total_gastos_mes(db: Session, user_id: int, mes: int, ano: int):
    gastos = listar_gastos_mes(db, user_id, mes, ano)
    return sum(g.valor for g in gastos)