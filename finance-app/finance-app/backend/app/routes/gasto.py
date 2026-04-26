from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.deps import get_current_user
from app.schemas.gasto import GastoCreate, GastoUpdate, GastoResponse
from app.services.gasto_service import (
    registrar_gasto, listar_gastos_mes,
    classificar_gasto, total_gastos_mes
)
from app.models.user import User
from app.models.gasto import Gasto
from fastapi import HTTPException
from datetime import datetime

router = APIRouter()

@router.post("/", response_model=GastoResponse, status_code=201)
def criar_gasto(
    dados: GastoCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return registrar_gasto(db, dados, current_user.id)

@router.get("/mes-atual", response_model=List[GastoResponse])
def gastos_mes_atual(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    agora = datetime.now()
    return listar_gastos_mes(db, current_user.id, agora.month, agora.year)

@router.get("/por-mes/{ano}/{mes}", response_model=List[GastoResponse])
def gastos_por_mes(
    ano: int,
    mes: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return listar_gastos_mes(db, current_user.id, mes, ano)

@router.get("/total-mes", response_model=dict)
def total_mes_atual(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    agora = datetime.now()
    total = total_gastos_mes(db, current_user.id, agora.month, agora.year)
    return {"total": total}

@router.patch("/{gasto_id}/classificar", response_model=GastoResponse)
def classificar(
    gasto_id: int,
    dados: GastoUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return classificar_gasto(db, gasto_id, dados, current_user.id)

@router.delete("/{gasto_id}", status_code=204)
def deletar_gasto(
    gasto_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    gasto = db.query(Gasto).filter(
        Gasto.id == gasto_id,
        Gasto.user_id == current_user.id
    ).first()
    if not gasto:
        raise HTTPException(status_code=404, detail="Gasto não encontrado.")
    db.delete(gasto)
    db.commit()