from sqlalchemy.orm import Session
from app.models.renda import Renda
from app.models.gasto import Gasto
from datetime import datetime

def get_resumo_mensal(db: Session, user_id: int, mes: int, ano: int):
    # Busca a renda do mês
    renda = db.query(Renda).filter(
        Renda.user_id == user_id,
        Renda.mes == mes,
        Renda.ano == ano
    ).first()

    # Busca todos os gastos do mês
    inicio = datetime(ano, mes, 1)
    fim = datetime(ano + 1, 1, 1) if mes == 12 else datetime(ano, mes + 1, 1)

    gastos = db.query(Gasto).filter(
        Gasto.user_id == user_id,
        Gasto.data >= inicio,
        Gasto.data < fim
    ).all()

    total_renda = renda.valor if renda else 0.0
    total_gastos = sum(g.valor for g in gastos)
    total_essencial = sum(g.valor for g in gastos if g.essencial)
    total_nao_essencial = sum(g.valor for g in gastos if not g.essencial)
    saldo = total_renda - total_gastos

    # Gastos por categoria
    por_categoria = {}
    for g in gastos:
        if g.categoria not in por_categoria:
            por_categoria[g.categoria] = 0.0
        por_categoria[g.categoria] += g.valor

    return {
        "mes": mes,
        "ano": ano,
        "total_renda": total_renda,
        "total_gastos": total_gastos,
        "total_essencial": total_essencial,
        "total_nao_essencial": total_nao_essencial,
        "saldo": saldo,
        "quantidade_gastos": len(gastos),
        "por_categoria": por_categoria,
        "percentual_gasto": round((total_gastos / total_renda * 100), 1) if total_renda > 0 else 0.0
    }