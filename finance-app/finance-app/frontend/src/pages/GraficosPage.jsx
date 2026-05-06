import { useState, useEffect } from "react";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const MESES = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"
];

const CORES = [
  "#10B981","#3B82F6","#F59E0B","#EF4444",
  "#8B5CF6","#EC4899","#06B6D4","#84CC16"
];

const styles = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: #f1f5f9; }
  .layout { display: flex; min-height: 100vh; }

  .sidebar {
    width: 240px; background: #0d1b2a;
    display: flex; flex-direction: column;
    padding: 32px 20px; gap: 8px;
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

  .mes-selector {
    display: flex; align-items: center; gap: 12px;
    margin-bottom: 28px;
  }
  .mes-selector label {
    font-size: 14px; font-weight: 600; color: #374151;
  }
  .mes-selector select {
    padding: 8px 14px; border: 1.5px solid #e2e8f0;
    border-radius: 10px; font-family: 'DM Sans', sans-serif;
    font-size: 14px; color: #0f172a; background: #fff;
    outline: none; cursor: pointer;
  }
  .mes-selector select:focus { border-color: #10b981; }

  .cards-grid {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 20px; margin-bottom: 28px;
  }
  .card {
    background: #fff; border-radius: 16px; padding: 22px;
    border: 1px solid #f1f5f9;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  }
  .card-label {
    font-size: 11px; font-weight: 600; color: #94a3b8;
    text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;
  }
  .card-value {
    font-family: 'Playfair Display', serif;
    font-size: 28px; font-weight: 700; color: #0f172a; margin-bottom: 2px;
  }
  .card-value.green { color: #10b981; }
  .card-value.red { color: #ef4444; }
  .card-value.blue { color: #3b82f6; }
  .card-sub { font-size: 12px; color: #94a3b8; }

  .charts-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 20px; margin-bottom: 28px;
  }
  .chart-card {
    background: #fff; border-radius: 16px; padding: 24px;
    border: 1px solid #f1f5f9;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  }
  .chart-title {
    font-size: 15px; font-weight: 700; color: #0f172a;
    margin-bottom: 20px;
  }

  .chart-card-full {
    background: #fff; border-radius: 16px; padding: 24px;
    border: 1px solid #f1f5f9;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    margin-bottom: 28px;
  }

  .essencial-row {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 20px; margin-bottom: 28px;
  }
  .essencial-card {
    background: #fff; border-radius: 16px; padding: 24px;
    border: 1px solid #f1f5f9;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  }
  .essencial-title {
    font-size: 15px; font-weight: 700; color: #0f172a; margin-bottom: 16px;
  }

  .progress-wrap { margin-top: 12px; }
  .progress-label {
    display: flex; justify-content: space-between;
    font-size: 13px; color: #64748b; margin-bottom: 6px;
  }
  .progress-bar {
    height: 10px; background: #f1f5f9;
    border-radius: 100px; overflow: hidden;
  }
  .progress-fill {
    height: 100%; border-radius: 100px; transition: width 0.6s ease;
  }

  .empty-state {
    text-align: center; padding: 60px; color: #94a3b8;
  }
  .empty-icon { font-size: 52px; margin-bottom: 12px; }
  .empty-text { font-size: 15px; }

  .categoria-list { display: flex; flex-direction: column; gap: 12px; margin-top: 4px; }
  .categoria-item {
    display: flex; align-items: center; justify-content: space-between;
    gap: 12px;
  }
  .categoria-dot {
    width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0;
  }
  .categoria-nome { font-size: 13px; color: #374151; flex: 1; }
  .categoria-barra { flex: 2; height: 8px; background: #f1f5f9; border-radius: 100px; overflow: hidden; }
  .categoria-barra-fill { height: 100%; border-radius: 100px; }
  .categoria-valor { font-size: 13px; font-weight: 700; color: #0f172a; min-width: 80px; text-align: right; }

  @media (max-width: 900px) {
    .charts-grid { grid-template-columns: 1fr; }
    .cards-grid { grid-template-columns: 1fr 1fr; }
  }
`;

function fmt(v) {
  return `R$ ${Number(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
}

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: "10px 14px", fontSize: 13 }}>
        <p style={{ fontWeight: 700, color: "#0f172a", marginBottom: 2 }}>{payload[0].name}</p>
        <p style={{ color: "#10b981" }}>{fmt(payload[0].value)}</p>
        {payload[0].payload.percentual && (
          <p style={{ color: "#64748b" }}>{payload[0].payload.percentual}% do total</p>
        )}
      </div>
    );
  }
  return null;
};

export default function GraficosPage() {
  const { user, logout } = useAuth();
  const agora = new Date();
  const [mes, setMes] = useState(agora.getMonth() + 1);
  const [ano] = useState(agora.getFullYear());
  const [resumo, setResumo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResumo() {
      setLoading(true);
      try {
        const res = await api.get(`/resumo/mensal/${ano}/${mes}`);
        setResumo(res.data);
      } catch {
        setResumo(null);
      } finally {
        setLoading(false);
      }
    }
    fetchResumo();
  }, [mes, ano]);

  // Monta dados para os gráficos
  const dadosPizza = resumo?.por_categoria
    ? Object.entries(resumo.por_categoria).map(([name, value], i) => ({
        name,
        value,
        percentual: resumo.total_gastos > 0
          ? ((value / resumo.total_gastos) * 100).toFixed(1)
          : "0"
      }))
    : [];

  const dadosBarra = dadosPizza.sort((a, b) => b.value - a.value);

  const dadosEssencial = [
    { name: "Essencial", value: resumo?.total_essencial || 0 },
    { name: "Não essencial", value: resumo?.total_nao_essencial || 0 },
  ];

  const maxCat = dadosBarra.length > 0 ? dadosBarra[0].value : 1;
  const inicial = user?.email?.[0]?.toUpperCase() || "U";
  const temDados = dadosPizza.length > 0;

  return (
    <>
      <style>{styles}</style>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet" />

      <div className="layout">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sidebar-brand">
            <div className="sidebar-brand-icon">💰</div>
            <span className="sidebar-brand-name">FinanceApp</span>
          </div>
          <a className="nav-item" href="/dashboard">
            <span className="nav-icon">📊</span> Dashboard
          </a>
          <a className="nav-item" href="/classificar">
            <span className="nav-icon">🏷️</span> Classificar
          </a>
          <a className="nav-item" href="/graficos"><span className="nav-icon">📈</span> Gráficos</a>
          <a className="nav-item" href="/perfil"><span className="nav-icon">👤</span> Perfil</a>
          <a className="nav-item" href="/metricas"><span className="nav-icon">📉</span> Métricas</a>
          <div className="sidebar-bottom">
            <button className="nav-item" onClick={logout} style={{ color: "#ef4444" }}>
              <span className="nav-icon">🚪</span> Sair
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <main className="main">
          <div className="topbar">
            <h1 className="page-title">Gráficos de Gastos</h1>
            <div className="user-badge">
              <div className="user-avatar">{inicial}</div>
              {user?.email}
            </div>
          </div>

          {/* Seletor de mês */}
          <div className="mes-selector">
            <label>Visualizando:</label>
            <select value={mes} onChange={e => setMes(Number(e.target.value))}>
              {MESES.map((m, i) => (
                <option key={i} value={i + 1}>{m} {ano}</option>
              ))}
            </select>
          </div>

          {/* Cards resumo */}
          <div className="cards-grid">
            <div className="card">
              <p className="card-label">Renda do mês</p>
              <p className="card-value green">{fmt(resumo?.total_renda)}</p>
              <p className="card-sub">{MESES[mes - 1]} {ano}</p>
            </div>
            <div className="card">
              <p className="card-label">Total de gastos</p>
              <p className="card-value red">{fmt(resumo?.total_gastos)}</p>
              <p className="card-sub">{resumo?.quantidade_gastos || 0} gasto(s) no mês</p>
            </div>
            <div className="card">
              <p className="card-label">Saldo disponível</p>
              <p className={`card-value ${(resumo?.saldo || 0) >= 0 ? "blue" : "red"}`}>
                {fmt(resumo?.saldo)}
              </p>
              <p className="card-sub">{resumo?.percentual_gasto || 0}% da renda comprometida</p>
            </div>
          </div>

          {!temDados && !loading ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <p className="empty-text">Nenhum gasto registrado em {MESES[mes - 1]}.<br />Registre gastos no Dashboard para ver os gráficos.</p>
            </div>
          ) : (
            <>
              {/* Gráficos principais */}
              <div className="charts-grid">

                {/* Pizza */}
                <div className="chart-card">
                  <p className="chart-title">Distribuição por categoria</p>
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={dadosPizza}
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={110}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {dadosPizza.map((_, i) => (
                          <Cell key={i} fill={CORES[i % CORES.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend
                        iconType="circle"
                        iconSize={8}
                        formatter={(value) => (
                          <span style={{ fontSize: 12, color: "#374151" }}>{value}</span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Categorias com barras */}
                <div className="chart-card">
                  <p className="chart-title">Valor por categoria</p>
                  <div className="categoria-list">
                    {dadosBarra.map((item, i) => (
                      <div className="categoria-item" key={item.name}>
                        <div className="categoria-dot" style={{ background: CORES[i % CORES.length] }} />
                        <span className="categoria-nome">{item.name}</span>
                        <div className="categoria-barra">
                          <div
                            className="categoria-barra-fill"
                            style={{
                              width: `${(item.value / maxCat) * 100}%`,
                              background: CORES[i % CORES.length]
                            }}
                          />
                        </div>
                        <span className="categoria-valor">{fmt(item.value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Gráfico de barras completo */}
              <div className="chart-card-full">
                <p className="chart-title">Comparativo de gastos por categoria</p>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={dadosBarra} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748b" }} />
                    <YAxis
                      tick={{ fontSize: 12, fill: "#64748b" }}
                      tickFormatter={v => `R$${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      formatter={(value) => [fmt(value), "Valor"]}
                      contentStyle={{ borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 13 }}
                    />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {dadosBarra.map((_, i) => (
                        <Cell key={i} fill={CORES[i % CORES.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Essencial vs Não essencial */}
              <div className="essencial-row">
                <div className="essencial-card">
                  <p className="essencial-title">Essencial vs Não essencial</p>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={dadosEssencial}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        <Cell fill="#10B981" />
                        <Cell fill="#F59E0B" />
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend iconType="circle" iconSize={8}
                        formatter={v => <span style={{ fontSize: 12, color: "#374151" }}>{v}</span>} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="essencial-card">
                  <p className="essencial-title">Resumo de comprometimento</p>
                  <div style={{ marginTop: 8 }}>
                    {[
                      { label: "Gastos essenciais", value: resumo?.total_essencial, total: resumo?.total_gastos, color: "#10B981" },
                      { label: "Gastos não essenciais", value: resumo?.total_nao_essencial, total: resumo?.total_gastos, color: "#F59E0B" },
                      { label: "Total gasto vs renda", value: resumo?.total_gastos, total: resumo?.total_renda, color: "#EF4444" },
                    ].map(item => {
                      const pct = item.total > 0 ? Math.min(((item.value / item.total) * 100), 100) : 0;
                      return (
                        <div className="progress-wrap" key={item.label}>
                          <div className="progress-label">
                            <span>{item.label}</span>
                            <span style={{ fontWeight: 700, color: item.color }}>{pct.toFixed(1)}%</span>
                          </div>
                          <div className="progress-bar">
                            <div
                              className="progress-fill"
                              style={{ width: `${pct}%`, background: item.color }}
                            />
                          </div>
                          <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 4, marginBottom: 12 }}>
                            {fmt(item.value)} de {fmt(item.total)}
                          </p>
                        </div>
                      );
                    })}
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