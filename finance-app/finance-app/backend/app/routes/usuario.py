from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.deps import get_current_user
from app.schemas.user import UpdatePassword
from app.services.auth_service import update_password
from app.models.user import User

router = APIRouter()

@router.get("/perfil")
def get_perfil(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "criado_em": str(current_user.created_at)
    }

@router.put("/alterar-senha")
def alterar_senha(
    dados: UpdatePassword,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return update_password(db, current_user.id, dados.senha_atual, dados.nova_senha)