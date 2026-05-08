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

def get_metricas(db: Session, user_id: int):
    from app.models.renda import Renda
    from app.models.gasto import Gasto
    from datetime import datetime

    agora = datetime.now()

    # Busca últimos 6 meses
    meses_dados = []
    for i in range(5, -1, -1):
        mes = agora.month - i
        ano = agora.year
        if mes <= 0:
            mes += 12
            ano -= 1

        resumo = get_resumo_mensal(db, user_id, mes, ano)
        resumo["mes_nome"] = ["Jan","Fev","Mar","Abr","Mai","Jun",
                              "Jul","Ago","Set","Out","Nov","Dez"][mes - 1]
        meses_dados.append(resumo)

    total_gastos_lista = [m["total_gastos"] for m in meses_dados]
    total_renda_lista  = [m["total_renda"]  for m in meses_dados]

    media_gastos = sum(total_gastos_lista) / len(total_gastos_lista) if total_gastos_lista else 0
    media_renda  = sum(total_renda_lista)  / len(total_renda_lista)  if total_renda_lista else 0

    mes_maior_gasto = max(meses_dados, key=lambda m: m["total_gastos"])

    # Categoria mais gasta no geral
    todas_categorias = {}
    for m in meses_dados:
        for cat, val in m.get("por_categoria", {}).items():
            todas_categorias[cat] = todas_categorias.get(cat, 0) + val

    categoria_top = max(todas_categorias, key=todas_categorias.get) if todas_categorias else "—"

    return {
        "meses": meses_dados,
        "media_gastos": round(media_gastos, 2),
        "media_renda": round(media_renda, 2),
        "mes_maior_gasto": mes_maior_gasto["mes_nome"],
        "valor_maior_gasto": mes_maior_gasto["total_gastos"],
        "categoria_top": categoria_top,
        "valor_categoria_top": round(todas_categorias.get(categoria_top, 0), 2),
        "todas_categorias": todas_categorias,
    }

def get_historico_ano(db: Session, user_id: int, ano: int):
    meses_nomes = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho",
                   "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"]
    historico = []
    for mes in range(1, 13):
        resumo = get_resumo_mensal(db, user_id, mes, ano)
        resumo["mes_nome"] = meses_nomes[mes - 1]
        historico.append(resumo)
    return {"ano": ano, "meses": historico}