import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LineChart, Line
} from "recharts";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const styles = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: #f1f5f9; }
  .layout { display: flex; min-height: 100vh; }

  .sidebar {
    width: 240px; background: #0d1b2a; display: flex;
    flex-direction: column; padding: 32px 20px; gap: 8px;
    position: fixed; height: 100vh;
  }
  .sidebar-brand {
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 40px; padding: 0 8px;
  }
  .sidebar-brand-icon {
    width: 36px; height: 36px;
    background: linear-gradient(135deg, #10b981, #34d399);
    border-radius: 10px; display: flex;
    align-items: center; justify-content: center; font-size: 16px;
  }
  .sidebar-brand-name {
    font-family: 'Playfair Display', serif;
    font-size: 18px; font-weight: 700; color: #f0fdf8;
  }
  .nav-item {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 16px; border-radius: 10px;
    color: #64748b; font-size: 14px; font-weight: 500;
    cursor: pointer; transition: all 0.15s; text-decoration: none;
    border: none; background: none; width: 100%; text-align: left;
  }
  .nav-item:hover { background: rgba(255,255,255,0.06); color: #94a3b8; }
  .nav-item.active { background: rgba(16,185,129,0.15); color: #34d399; }
  .nav-icon { font-size: 18px; width: 20px; text-align: center; }
  .sidebar-bottom {
    margin-top: auto;
    border-top: 1px solid rgba(255,255,255,0.06);
    padding-top: 16px;
  }

  .main { margin-left: 240px; flex: 1; padding: 40px; }

  .topbar {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 32px;
  }
  .page-title {
    font-family: 'Playfair Display', serif;
    font-size: 28px; font-weight: 700; color: #0f172a;
  }
  .user-badge {
    display: flex; align-items: center; gap: 10px;
    background: #fff; padding: 8px 16px; border-radius: 100px;
    border: 1px solid #e2e8f0; font-size: 14px; color: #374151;
  }
  .user-avatar {
    width: 32px; height: 32px;
    background: linear-gradient(135deg, #10b981, #34d399);
    border-radius: 50%; display: flex;
    align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700; color: #fff;
  }

  .kpi-grid {
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 16px; margin-bottom: 28px;
  }
  .kpi-card {
    background: #fff; border-radius: 16px; padding: 22px;
    border: 1px solid #f1f5f9;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  }
  .kpi-label {
    font-size: 11px; font-weight: 600; color: #94a3b8;
    text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;
  }
  .kpi-value {
    font-family: 'Playfair Display', serif;
    font-size: 22px; font-weight: 700; color: #0f172a; margin-bottom: 4px;
  }
  .kpi-value.green { color: #10b981; }
  .kpi-value.red { color: #ef4444; }
  .kpi-value.blue { color: #3b82f6; }
  .kpi-value.orange { color: #f59e0b; }
  .kpi-sub { font-size: 12px; color: #94a3b8; }

  .charts-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 20px; margin-bottom: 28px;
  }
  .chart-card {
    background: #fff; border-radius: 16px; padding: 24px;
    border: 1px solid #f1f5f9;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  }
  .chart-card-full {
    background: #fff; border-radius: 16px; padding: 24px;
    border: 1px solid #f1f5f9;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    margin-bottom: 28px;
  }
  .chart-title {
    font-size: 15px; font-weight: 700; color: #0f172a; margin-bottom: 20px;
  }

  .cat-list { display: flex; flex-direction: column; gap: 10px; }
  .cat-item { display: flex; align-items: center; gap: 12px; }
  .cat-name { font-size: 13px; color: #374151; width: 100px; flex-shrink: 0; }
  .cat-bar-bg { flex: 1; height: 8px; background: #f1f5f9; border-radius: 100px; overflow: hidden; }
  .cat-bar-fill { height: 100%; background: #10b981; border-radius: 100px; }
  .cat-val { font-size: 13px; font-weight: 700; color: #0f172a; min-width: 90px; text-align: right; }

  .empty-state { text-align: center; padding: 60px; color: #94a3b8; }
  .empty-icon { font-size: 48px; margin-bottom: 12px; }
`;

function fmt(v) {
  return `R$ ${Number(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
}

export default function MetricasPage() {
  const { user, logout } = useAuth();
  const [metricas, setMetricas] = useState(null);
  const [loading, setLoading] = useState(true);
  const inicial = user?.email?.[0]?.toUpperCase() || "U";

  function handleLogout() {
    logout();
    window.location.href = "/login";
  }

  useEffect(() => {
    api.get("/resumo/metricas")
      .then(res => setMetricas(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const dadosBarra = metricas?.meses?.map(m => ({
    name: m.mes_nome,
    Gastos: m.total_gastos,
    Renda: m.total_renda,
  })) || [];

  const dadosLinha = metricas?.meses?.map(m => ({
    name: m.mes_nome,
    Saldo: m.saldo,
  })) || [];

  const maxCat = metricas?.todas_categorias
    ? Math.max(...Object.values(metricas.todas_categorias))
    : 1;

  return (
    <>
      <style>{styles}</style>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet" />

      <div className="layout">
        <aside className="sidebar">
          <div className="sidebar-brand">
            <div className="sidebar-brand-icon">💰</div>
            <span className="sidebar-brand-name">FinanceApp</span>
          </div>
          <a className="nav-item" href="/dashboard"><span className="nav-icon">📊</span> Visão Geral</a>
          <a className="nav-item" href="/classificar"><span className="nav-icon">🏷️</span> Transações</a>
          <a className="nav-item" href="/graficos"><span className="nav-icon">📈</span> Análises</a>
          <a className="nav-item active" href="/metricas"><span className="nav-icon">📉</span> Métricas</a>
          <a className="nav-item" href="/perfil"><span className="nav-icon">👤</span> Meu Perfil</a>
          <div className="sidebar-bottom">
            <button className="nav-item" onClick={handleLogout} style={{ color: "#ef4444" }}>
              <span className="nav-icon">🚪</span> Sair
            </button>
          </div>
        </aside>

        <main className="main">
          <div className="topbar">
            <h1 className="page-title">Métricas Financeiras</h1>
            <div className="user-badge">
              <div className="user-avatar">{inicial}</div>
              {user?.email}
            </div>
          </div>

          {loading ? (
            <div className="empty-state"><p>Carregando métricas...</p></div>
          ) : !metricas ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <p>Nenhum dado encontrado. Registre gastos para ver as métricas.</p>
            </div>
          ) : (
            <>
              {/* KPIs */}
              <div className="kpi-grid">
                <div className="kpi-card">
                  <p className="kpi-label">Média de gastos</p>
                  <p className="kpi-value red">{fmt(metricas.media_gastos)}</p>
                  <p className="kpi-sub">últimos 6 meses</p>
                </div>
                <div className="kpi-card">
                  <p className="kpi-label">Média de renda</p>
                  <p className="kpi-value green">{fmt(metricas.media_renda)}</p>
                  <p className="kpi-sub">últimos 6 meses</p>
                </div>
                <div className="kpi-card">
                  <p className="kpi-label">Mês com mais gastos</p>
                  <p className="kpi-value orange">{metricas.mes_maior_gasto}</p>
                  <p className="kpi-sub">{fmt(metricas.valor_maior_gasto)}</p>
                </div>
                <div className="kpi-card">
                  <p className="kpi-label">Categoria top</p>
                  <p className="kpi-value blue">{metricas.categoria_top}</p>
                  <p className="kpi-sub">{fmt(metricas.valor_categoria_top)} no período</p>
                </div>
              </div>

              {/* Gráfico de barras — Renda vs Gastos */}
              <div className="chart-card-full">
                <p className="chart-title">Renda vs Gastos — últimos 6 meses</p>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={dadosBarra} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748b" }} />
                    <YAxis tick={{ fontSize: 12, fill: "#64748b" }} tickFormatter={v => `R$${(v/1000).toFixed(0)}k`} />
                    <Tooltip formatter={v => fmt(v)} contentStyle={{ borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 13 }} />
                    <Bar dataKey="Renda" fill="#10b981" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="Gastos" fill="#ef4444" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="charts-grid">
                {/* Evolução do saldo */}
                <div className="chart-card">
                  <p className="chart-title">Evolução do saldo</p>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={dadosLinha} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748b" }} />
                      <YAxis tick={{ fontSize: 12, fill: "#64748b" }} tickFormatter={v => `R$${(v/1000).toFixed(0)}k`} />
                      <Tooltip formatter={v => fmt(v)} contentStyle={{ borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 13 }} />
                      <Line type="monotone" dataKey="Saldo" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6", r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Categorias acumuladas */}
                <div className="chart-card">
                  <p className="chart-title">Gastos por categoria (6 meses)</p>
                  <div className="cat-list">
                    {Object.entries(metricas.todas_categorias)
                      .sort((a, b) => b[1] - a[1])
                      .map(([cat, val]) => (
                        <div className="cat-item" key={cat}>
                          <span className="cat-name">{cat}</span>
                          <div className="cat-bar-bg">
                            <div className="cat-bar-fill" style={{ width: `${(val / maxCat) * 100}%` }} />
                          </div>
                          <span className="cat-val">{fmt(val)}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
}