from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.deps import get_current_user
from app.services.resumo_service import get_resumo_mensal, get_metricas, get_historico_ano
from app.models.user import User
from datetime import datetime

router = APIRouter()

@router.get("/mensal")
def resumo_mensal(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    agora = datetime.now()
    return get_resumo_mensal(db, current_user.id, agora.month, agora.year)

@router.get("/mensal/{ano}/{mes}")
def resumo_mensal_periodo(
    ano: int,
    mes: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_resumo_mensal(db, current_user.id, mes, ano)

@router.get("/metricas")
def metricas(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_metricas(db, current_user.id)

@router.get("/historico/{ano}")
def historico_ano(
    ano: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_historico_ano(db, current_user.id, ano)