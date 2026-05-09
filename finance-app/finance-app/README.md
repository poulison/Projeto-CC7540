# Finance App 

Sistema pessoal de gerenciamento financeiro - Centro Universitário FEI

## Tecnologias

- **Frontend:** React JS
- **Backend:** Python + FastAPI
- **Banco de Dados:** PostgreSQL
- **ORM:** SQLAlchemy + Alembic
- **Autenticação:** JWT
- **Infraestrutura:** Docker + Docker Compose

## Como rodar o projeto

### Pré-requisitos
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado

### 1. Clone o repositório
```bash
git clone <url-do-repo>
cd finance-app
```

### 2. Configure o .env
O arquivo `.env` já está criado com valores padrão para desenvolvimento.
>  Em produção, altere o `SECRET_KEY` e as senhas do banco!

### 3. Suba os containers
```bash
docker-compose up --build
```

### 4. Acesse
- **Frontend:** http://localhost:3000
- **Backend (API):** http://localhost:8000
- **Docs da API:** http://localhost:8000/docs

## Visualizar o banco de dados
Baixe o [DBeaver](https://dbeaver.io/download/) e conecte com:
- Host: `localhost`
- Porta: `5432`
- Usuário: `finance_user`
- Senha: `finance_password`
- Banco: `finance_db`

## Estrutura do projeto
```
finance-app/
├── frontend/        # React JS
├── backend/         # FastAPI + Python
├── docker-compose.yml
├── .env
└── README.md
```
