from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.deps import get_current_user
from app.schemas.renda import RendaCreate, RendaResponse
from app.services.renda_service import cadastrar_renda, buscar_renda_mes
from app.models.user import User
from datetime import datetime

router = APIRouter()

@router.post("/", response_model=RendaResponse, status_code=201)
def criar_renda(
    dados: RendaCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return cadastrar_renda(db, dados, current_user.id)

@router.get("/mes-atual", response_model=RendaResponse | None)
def renda_mes_atual(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    agora = datetime.now()
    return buscar_renda_mes(db, current_user.id, agora.month, agora.year)