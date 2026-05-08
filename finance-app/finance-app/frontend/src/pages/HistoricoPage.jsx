import { useState, useEffect } from "react";
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

  .controls {
    display: flex; align-items: center; gap: 12px; margin-bottom: 24px;
  }
  .controls label { font-size: 14px; font-weight: 600; color: #374151; }
  .controls select {
    padding: 8px 14px; border: 1.5px solid #e2e8f0;
    border-radius: 10px; font-family: 'DM Sans', sans-serif;
    font-size: 14px; color: #0f172a; background: #fff;
    outline: none; cursor: pointer;
  }
  .controls select:focus { border-color: #10b981; }

  .resumo-ano {
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 16px; margin-bottom: 28px;
  }
  .kpi-card {
    background: #fff; border-radius: 14px; padding: 20px;
    border: 1px solid #f1f5f9;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  }
  .kpi-label {
    font-size: 11px; font-weight: 600; color: #94a3b8;
    text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;
  }
  .kpi-value {
    font-family: 'Playfair Display', serif;
    font-size: 22px; font-weight: 700; color: #0f172a;
  }
  .kpi-value.green { color: #10b981; }
  .kpi-value.red { color: #ef4444; }
  .kpi-value.blue { color: #3b82f6; }

  .table-card {
    background: #fff; border-radius: 16px;
    border: 1px solid #f1f5f9;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    overflow: hidden;
  }

  .table-title {
    font-size: 15px; font-weight: 700; color: #0f172a;
    padding: 20px 24px; border-bottom: 1px solid #f1f5f9;
  }

  table { width: 100%; border-collapse: collapse; }

  thead tr { background: #0d1b2a; }
  thead th {
    padding: 14px 20px; text-align: left;
    font-size: 12px; font-weight: 600; color: #94a3b8;
    text-transform: uppercase; letter-spacing: 0.5px;
  }

  tbody tr { border-bottom: 1px solid #f8fafc; transition: background 0.15s; }
  tbody tr:hover { background: #f8fafc; }
  tbody tr:last-child { border-bottom: none; }
  tbody tr.mes-atual { background: #f0fdf4; }

  td {
    padding: 16px 20px; font-size: 14px; color: #374151;
  }

  .td-mes { font-weight: 700; color: #0f172a; }
  .td-green { font-weight: 700; color: #10b981; }
  .td-red { font-weight: 700; color: #ef4444; }
  .td-saldo-pos { font-weight: 700; color: #3b82f6; }
  .td-saldo-neg { font-weight: 700; color: #ef4444; }

  .progress-mini {
    height: 6px; background: #f1f5f9; border-radius: 100px;
    overflow: hidden; width: 80px; display: inline-block;
  }
  .progress-mini-fill {
    height: 100%; border-radius: 100px;
    transition: width 0.4s;
  }

  .badge-status {
    padding: 3px 10px; border-radius: 100px;
    font-size: 11px; font-weight: 600; display: inline-block;
  }
  .badge-positivo { background: #f0fdf4; color: #16a34a; }
  .badge-negativo { background: #fef2f2; color: #dc2626; }
  .badge-zerado  { background: #f1f5f9; color: #64748b; }
  .badge-atual   { background: #eff6ff; color: #2563eb; }

  .empty-row td { text-align: center; color: #94a3b8; padding: 40px; }
`;

function fmt(v) {
  return `R$ ${Number(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
}

export default function HistoricoPage() {
  const { user, logout } = useAuth();
  const agora = new Date();
  const [ano, setAno] = useState(agora.getFullYear());
  const [historico, setHistorico] = useState(null);

  const inicial = user?.email?.[0]?.toUpperCase() || "U";
  const anos = [agora.getFullYear(), agora.getFullYear() - 1, agora.getFullYear() - 2];

  useEffect(() => {
    api.get(`/resumo/historico/${ano}`)
      .then(res => setHistorico(res.data))
      .catch(() => setHistorico(null));
  }, [ano]);

  // Totais do ano
  const meses = historico?.meses || [];
  const totalRendaAno  = meses.reduce((s, m) => s + m.total_renda, 0);
  const totalGastosAno = meses.reduce((s, m) => s + m.total_gastos, 0);
  const saldoAno       = totalRendaAno - totalGastosAno;
  const mesesComDados  = meses.filter(m => m.total_gastos > 0 || m.total_renda > 0).length;

  function getStatusBadge(m, idx) {
    const mesAtual = agora.getMonth();
    const anoAtual = agora.getFullYear();
    if (ano === anoAtual && idx === mesAtual)
      return <span className="badge-status badge-atual">Mês atual</span>;
    if (m.total_renda === 0 && m.total_gastos === 0)
      return <span className="badge-status badge-zerado">Sem dados</span>;
    if (m.saldo >= 0)
      return <span className="badge-status badge-positivo">Positivo</span>;
    return <span className="badge-status badge-negativo">Negativo</span>;
  }

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
          <a className="nav-item" href="/dashboard"><span className="nav-icon">📊</span> Dashboard</a>
          <a className="nav-item" href="/classificar"><span className="nav-icon">🏷️</span> Classificar</a>
          <a className="nav-item" href="/graficos"><span className="nav-icon">📈</span> Gráficos</a>
          <a className="nav-item" href="/metricas"><span className="nav-icon">📉</span> Métricas</a>
          <a className="nav-item active" href="/historico"><span className="nav-icon">📅</span> Histórico</a>
          <a className="nav-item" href="/perfil"><span className="nav-icon">👤</span> Perfil</a>
          <div className="sidebar-bottom">
            <button className="nav-item" onClick={logout} style={{ color: "#ef4444" }}>
              <span className="nav-icon">🚪</span> Sair
            </button>
          </div>
        </aside>

        <main className="main">
          <div className="topbar">
            <h1 className="page-title">Histórico Financeiro</h1>
            <div className="user-badge">
              <div className="user-avatar">{inicial}</div>
              {user?.email}
            </div>
          </div>

          {/* Seletor de ano */}
          <div className="controls">
            <label>Ano:</label>
            <select value={ano} onChange={e => setAno(Number(e.target.value))}>
              {anos.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>

          {/* Resumo do ano */}
          <div className="resumo-ano">
            <div className="kpi-card">
              <p className="kpi-label">Total de renda</p>
              <p className="kpi-value green">{fmt(totalRendaAno)}</p>
            </div>
            <div className="kpi-card">
              <p className="kpi-label">Total de gastos</p>
              <p className="kpi-value red">{fmt(totalGastosAno)}</p>
            </div>
            <div className="kpi-card">
              <p className="kpi-label">Saldo do ano</p>
              <p className={`kpi-value ${saldoAno >= 0 ? "blue" : "red"}`}>{fmt(saldoAno)}</p>
            </div>
            <div className="kpi-card">
              <p className="kpi-label">Meses com dados</p>
              <p className="kpi-value">{mesesComDados} de 12</p>
            </div>
          </div>

          {/* Tabela de meses */}
          <div className="table-card">
            <p className="table-title">Detalhamento mensal — {ano}</p>
            <table>
              <thead>
                <tr>
                  <th>Mês</th>
                  <th>Renda</th>
                  <th>Gastos</th>
                  <th>Essencial</th>
                  <th>Não essencial</th>
                  <th>Saldo</th>
                  <th>% Comprometido</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {meses.map((m, idx) => (
                  <tr key={idx} className={ano === agora.getFullYear() && idx === agora.getMonth() ? "mes-atual" : ""}>
                    <td className="td-mes">{m.mes_nome}</td>
                    <td className="td-green">{fmt(m.total_renda)}</td>
                    <td className="td-red">{fmt(m.total_gastos)}</td>
                    <td>{fmt(m.total_essencial)}</td>
                    <td>{fmt(m.total_nao_essencial)}</td>
                    <td className={m.saldo >= 0 ? "td-saldo-pos" : "td-saldo-neg"}>{fmt(m.saldo)}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div className="progress-mini">
                          <div className="progress-mini-fill" style={{
                            width: `${Math.min(m.percentual_gasto, 100)}%`,
                            background: m.percentual_gasto > 90 ? "#ef4444" : m.percentual_gasto > 70 ? "#f59e0b" : "#10b981"
                          }} />
                        </div>
                        <span style={{ fontSize: 12, color: "#64748b" }}>{m.percentual_gasto}%</span>
                      </div>
                    </td>
                    <td>{getStatusBadge(m, idx)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </>
  );
}