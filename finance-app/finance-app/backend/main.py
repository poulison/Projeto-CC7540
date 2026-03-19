from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import Base, engine
from app.routes import auth, renda, gasto, resumo

app = FastAPI(
    title="Finance App API",
    description="Sistema pessoal de gerenciamento financeiro",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(auth.router, prefix="/auth", tags=["Autenticação"])
app.include_router(renda.router, prefix="/renda", tags=["Renda"])
app.include_router(gasto.router, prefix="/gastos", tags=["Gastos"])
app.include_router(resumo.router, prefix="/resumo", tags=["Resumo"])

@app.get("/")
def root():
    return {"message": "Finance App API está rodando!"}

@app.get("/health")
def health_check():
    return {"status": "ok"}