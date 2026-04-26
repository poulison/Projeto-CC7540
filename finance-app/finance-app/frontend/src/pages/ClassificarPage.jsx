import { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const MESES = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"
];

const CATEGORIA_ICONES = {
  Alimentação: "🍔", Transporte: "🚗", Moradia: "🏠",
  Saúde: "💊", Educação: "📚", Lazer: "🎮",
  Vestuário: "👕", Outros: "📦"
};

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
    margin-bottom: 28px;
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
    display: flex; align-items: center; gap: 12px;
    margin-bottom: 24px; flex-wrap: wrap;
  }
  .controls label { font-size: 14px; font-weight: 600; color: #374151; }
  .controls select {
    padding: 8px 14px; border: 1.5px solid #e2e8f0;
    border-radius: 10px; font-family: 'DM Sans', sans-serif;
    font-size: 14px; color: #0f172a; background: #fff;
    outline: none; cursor: pointer;
  }
  .controls select:focus { border-color: #10b981; }

  .filter-btn {
    padding: 8px 16px; border-radius: 10px;
    font-family: 'DM Sans', sans-serif; font-size: 13px;
    font-weight: 600; cursor: pointer; border: 1.5px solid #e2e8f0;
    background: #fff; color: #64748b; transition: all 0.15s;
  }
  .filter-btn.ativo { background: #0d1b2a; color: #fff; border-color: #0d1b2a; }
  .filter-btn.ativo-ess { background: #f0fdf4; color: #16a34a; border-color: #bbf7d0; }
  .filter-btn.ativo-nao { background: #fff7ed; color: #ea580c; border-color: #fed7aa; }

  .resumo-cards {
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 16px; margin-bottom: 28px;
  }
  .card {
    background: #fff; border-radius: 14px; padding: 20px;
    border: 1px solid #f1f5f9;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  }
  .card-label {
    font-size: 11px; font-weight: 600; color: #94a3b8;
    text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;
  }
  .card-value {
    font-family: 'Playfair Display', serif;
    font-size: 22px; font-weight: 700; color: #0f172a;
  }
  .card-value.green { color: #10b981; }
  .card-value.orange { color: #f59e0b; }
  .card-value.red { color: #ef4444; }
  .card-sub { font-size: 12px; color: #94a3b8; margin-top: 4px; }

  .progress-wrap { margin-bottom: 28px; }
  .progress-header {
    display: flex; justify-content: space-between;
    font-size: 13px; color: #64748b; margin-bottom: 8px;
  }
  .progress-bar-bg {
    height: 12px; background: #f1f5f9; border-radius: 100px;
    overflow: hidden; display: flex;
  }
  .seg-green { height: 100%; background: #10b981; transition: width 0.6s; border-radius: 100px 0 0 100px; }
  .seg-orange { height: 100%; background: #f59e0b; transition: width 0.6s; }
  .progress-legend {
    display: flex; gap: 20px; margin-top: 8px;
  }
  .legend-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #64748b; }
  .legend-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }

  .gastos-list { display: flex; flex-direction: column; gap: 10px; }

  .gasto-item {
    background: #fff; border-radius: 12px; padding: 16px 20px;
    border: 1px solid #f1f5f9;
    display: flex; align-items: center; justify-content: space-between;
    box-shadow: 0 1px 2px rgba(0,0,0,0.04); transition: box-shadow 0.15s;
  }
  .gasto-item:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
  .gasto-item.essencial { border-left: 3px solid #10b981; }
  .gasto-item.nao-essencial { border-left: 3px solid #f59e0b; }

  .gasto-left { display: flex; align-items: center; gap: 14px; }
  .gasto-icon {
    width: 40px; height: 40px; border-radius: 10px;
    background: #f1f5f9; display: flex;
    align-items: center; justify-content: center; font-size: 18px;
  }
  .gasto-desc { font-size: 14px; font-weight: 600; color: #0f172a; }
  .gasto-meta { font-size: 12px; color: #94a3b8; margin-top: 2px; }

  .gasto-right { display: flex; align-items: center; gap: 12px; }
  .gasto-valor {
    font-family: 'Playfair Display', serif;
    font-size: 17px; font-weight: 700; color: #0f172a;
  }

  .toggle-wrap { display: flex; align-items: center; gap: 8px; }
  .toggle-label-text { font-size: 13px; font-weight: 600; }
  .toggle-label-text.green { color: #16a34a; }
  .toggle-label-text.orange { color: #ea580c; }

  .toggle {
    width: 48px; height: 26px; border-radius: 100px;
    border: none; cursor: pointer;
    position: relative; transition: background 0.2s; flex-shrink: 0;
  }
  .toggle.on { background: #10b981; }
  .toggle.off { background: #e2e8f0; }
  .toggle::after {
    content: ''; position: absolute; width: 20px; height: 20px;
    background: #fff; border-radius: 50%; top: 3px; left: 3px;
    transition: transform 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  }
  .toggle.on::after { transform: translateX(22px); }

  .empty-state { text-align: center; padding: 60px; color: #94a3b8; }
  .empty-icon { font-size: 48px; margin-bottom: 12px; }

  .toast {
    position: fixed; bottom: 28px; right: 28px;
    background: #0d1b2a; color: #fff; padding: 12px 20px;
    border-radius: 12px; font-size: 14px; font-weight: 500;
    box-shadow: 0 8px 24px rgba(0,0,0,0.2);
    display: flex; align-items: center; gap: 8px;
    animation: slideIn 0.3s ease; z-index: 999;
  }
  @keyframes slideIn {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;

function fmt(v) {
  return `R$ ${Number(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
}

export default function ClassificarPage() {
  const { user, logout } = useAuth();
  const agora = new Date();

  const [mes, setMes] = useState(agora.getMonth() + 1);
  const [ano] = useState(agora.getFullYear());
  const [gastos, setGastos] = useState([]);
  const [filtro, setFiltro] = useState("todos"); // todos | essencial | nao
  const [toast, setToast] = useState("");

  async function fetchGastos() {
    try {
      const res = await api.get(`/gastos/por-mes/${ano}/${mes}`);
      setGastos(res.data || []);
    } catch {
      setGastos([]);
    }
  }

  useEffect(() => { fetchGastos(); }, [mes]);

  async function toggleEssencial(gasto) {
    try {
      await api.patch(`/gastos/${gasto.id}/classificar`, {
        essencial: !gasto.essencial
      });
      setGastos(prev =>
        prev.map(g => g.id === gasto.id ? { ...g, essencial: !g.essencial } : g)
      );
      setToast(!gasto.essencial ? "✅ Marcado como essencial" : "⚠️ Marcado como não essencial");
      setTimeout(() => setToast(""), 2500);
    } catch { }
  }

  // Cálculos
  const totalGastos = gastos.reduce((s, g) => s + g.valor, 0);
  const totalEssencial = gastos.filter(g => g.essencial).reduce((s, g) => s + g.valor, 0);
  const totalNaoEssencial = gastos.filter(g => !g.essencial).reduce((s, g) => s + g.valor, 0);
  const qtdEssencial = gastos.filter(g => g.essencial).length;
  const qtdNaoEssencial = gastos.filter(g => !g.essencial).length;

  const pctEss = totalGastos > 0 ? (totalEssencial / totalGastos) * 100 : 0;
  const pctNao = totalGastos > 0 ? (totalNaoEssencial / totalGastos) * 100 : 0;

  // Filtro aplicado
  const gastosFiltrados = gastos.filter(g => {
    if (filtro === "essencial") return g.essencial;
    if (filtro === "nao") return !g.essencial;
    return true;
  });

  const inicial = user?.email?.[0]?.toUpperCase() || "U";

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
          <a className="nav-item" href="/dashboard"><span className="nav-icon">📊</span> Dashboard</a>
          <a className="nav-item active" href="/classificar"><span className="nav-icon">🏷️</span> Classificar</a>
          <a className="nav-item" href="/graficos"><span className="nav-icon">📈</span> Gráficos</a>
          <div className="sidebar-bottom">
            <button className="nav-item" onClick={logout} style={{ color: "#ef4444" }}>
              <span className="nav-icon">🚪</span> Sair
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <main className="main">
          <div className="topbar">
            <h1 className="page-title">Classificar Gastos</h1>
            <div className="user-badge">
              <div className="user-avatar">{inicial}</div>
              {user?.email}
            </div>
          </div>

          {/* Controles */}
          <div className="controls">
            <label>Mês:</label>
            <select value={mes} onChange={e => setMes(Number(e.target.value))}>
              {MESES.map((m, i) => (
                <option key={i} value={i + 1}>{m} {ano}</option>
              ))}
            </select>

            <button
              className={`filter-btn ${filtro === "todos" ? "ativo" : ""}`}
              onClick={() => setFiltro("todos")}
            >
              Todos ({gastos.length})
            </button>
            <button
              className={`filter-btn ${filtro === "essencial" ? "ativo-ess" : ""}`}
              onClick={() => setFiltro("essencial")}
            >
              ✅ Essenciais ({qtdEssencial})
            </button>
            <button
              className={`filter-btn ${filtro === "nao" ? "ativo-nao" : ""}`}
              onClick={() => setFiltro("nao")}
            >
              ⚠️ Não essenciais ({qtdNaoEssencial})
            </button>
          </div>

          {/* Cards resumo */}
          <div className="resumo-cards">
            <div className="card">
              <p className="card-label">Total de gastos</p>
              <p className="card-value">{fmt(totalGastos)}</p>
              <p className="card-sub">{gastos.length} gasto(s)</p>
            </div>
            <div className="card">
              <p className="card-label">Essenciais</p>
              <p className="card-value green">{fmt(totalEssencial)}</p>
              <p className="card-sub">{qtdEssencial} gasto(s) — {pctEss.toFixed(1)}%</p>
            </div>
            <div className="card">
              <p className="card-label">Não essenciais</p>
              <p className="card-value orange">{fmt(totalNaoEssencial)}</p>
              <p className="card-sub">{qtdNaoEssencial} gasto(s) — {pctNao.toFixed(1)}%</p>
            </div>
            <div className="card">
              <p className="card-label">Sem classificação</p>
              <p className="card-value red">{qtdNaoEssencial}</p>
              <p className="card-sub">gastos não essenciais</p>
            </div>
          </div>

          {/* Barra de proporção */}
          {totalGastos > 0 && (
            <div className="progress-wrap">
              <div className="progress-header">
                <span>Proporção essencial vs não essencial</span>
                <span>{pctEss.toFixed(1)}% essencial</span>
              </div>
              <div className="progress-bar-bg">
                <div className="seg-green" style={{ width: `${pctEss}%` }} />
                <div className="seg-orange" style={{ width: `${pctNao}%` }} />
              </div>
              <div className="progress-legend">
                <div className="legend-item">
                  <div className="legend-dot" style={{ background: "#10b981" }} />
                  Essencial — {fmt(totalEssencial)}
                </div>
                <div className="legend-item">
                  <div className="legend-dot" style={{ background: "#f59e0b" }} />
                  Não essencial — {fmt(totalNaoEssencial)}
                </div>
              </div>
            </div>
          )}

          {/* Lista de gastos */}
          {gastosFiltrados.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🏷️</div>
              <p>Nenhum gasto encontrado para este filtro.</p>
            </div>
          ) : (
            <div className="gastos-list">
              {gastosFiltrados.map(g => (
                <div
                  key={g.id}
                  className={`gasto-item ${g.essencial ? "essencial" : "nao-essencial"}`}
                >
                  <div className="gasto-left">
                    <div className="gasto-icon">{CATEGORIA_ICONES[g.categoria] || "📦"}</div>
                    <div>
                      <p className="gasto-desc">{g.descricao}</p>
                      <p className="gasto-meta">
                        {g.categoria} · {new Date(g.data).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                  <div className="gasto-right">
                    <span className="gasto-valor">{fmt(g.valor)}</span>
                    <div className="toggle-wrap">
                      <span className={`toggle-label-text ${g.essencial ? "green" : "orange"}`}>
                        {g.essencial ? "Essencial" : "Não essencial"}
                      </span>
                      <button
                        className={`toggle ${g.essencial ? "on" : "off"}`}
                        onClick={() => toggleEssencial(g)}
                        title="Clique para alternar a classificação"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Toast de confirmação */}
      {toast && <div className="toast">{toast}</div>}
    </>
  );
}