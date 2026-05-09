import { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const CATEGORIAS = [
  "Alimentação", "Transporte", "Moradia", "Saúde",
  "Educação", "Lazer", "Vestuário", "Outros"
];

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
    align-items: center; justify-content: center;
    font-size: 13px; font-weight: 800; color: #fff; letter-spacing: -0.5px;
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

  .mes-selector {
    display: flex; align-items: center; gap: 12px; margin-bottom: 24px;
  }
  .mes-selector label { font-size: 14px; font-weight: 600; color: #374151; }
  .mes-selector select {
    padding: 8px 14px; border: 1.5px solid #e2e8f0;
    border-radius: 10px; font-family: 'DM Sans', sans-serif;
    font-size: 14px; color: #0f172a; background: #fff;
    outline: none; cursor: pointer;
  }
  .mes-selector select:focus { border-color: #10b981; }

  .cards-grid {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 20px; margin-bottom: 24px;
  }
  .card {
    background: #fff; border-radius: 16px; padding: 24px;
    border: 1px solid #f1f5f9;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  }
  .card-label {
    font-size: 12px; font-weight: 600; color: #94a3b8;
    text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;
  }
  .card-value {
    font-family: 'Playfair Display', serif;
    font-size: 30px; font-weight: 700; color: #0f172a; margin-bottom: 4px;
  }
  .card-value.green { color: #10b981; }
  .card-value.red { color: #ef4444; }
  .card-value.blue { color: #3b82f6; }
  .card-sub { font-size: 13px; color: #94a3b8; }

  .resumo-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 20px; margin-bottom: 24px;
  }
  .resumo-card {
    background: #fff; border-radius: 16px; padding: 24px;
    border: 1px solid #f1f5f9;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  }
  .resumo-title {
    font-size: 14px; font-weight: 700; color: #0f172a;
    margin-bottom: 16px; display: flex; align-items: center; gap: 8px;
  }
  .resumo-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 10px 0; border-bottom: 1px solid #f1f5f9;
  }
  .resumo-row:last-child { border-bottom: none; }
  .resumo-row-label { font-size: 14px; color: #64748b; }
  .resumo-row-value { font-size: 14px; font-weight: 700; color: #0f172a; }
  .resumo-row-value.green { color: #10b981; }
  .resumo-row-value.red { color: #ef4444; }

  .progress-wrap { margin-top: 16px; }
  .progress-label {
    display: flex; justify-content: space-between;
    font-size: 13px; color: #64748b; margin-bottom: 8px;
  }
  .progress-bar { height: 10px; background: #f1f5f9; border-radius: 100px; overflow: hidden; }
  .progress-fill { height: 100%; border-radius: 100px; transition: width 0.5s ease; }
  .progress-fill.safe { background: linear-gradient(90deg, #10b981, #34d399); }
  .progress-fill.warn { background: linear-gradient(90deg, #f59e0b, #fbbf24); }
  .progress-fill.danger { background: linear-gradient(90deg, #ef4444, #f87171); }

  .cat-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 8px 0;
  }
  .cat-left { display: flex; align-items: center; gap: 10px; }
  .cat-icon {
    width: 32px; height: 32px; border-radius: 8px;
    background: #f1f5f9; display: flex;
    align-items: center; justify-content: center; font-size: 15px;
  }
  .cat-name { font-size: 14px; color: #374151; font-weight: 500; }
  .cat-bar-wrap { flex: 1; margin: 0 12px; }
  .cat-bar { height: 6px; background: #f1f5f9; border-radius: 100px; overflow: hidden; }
  .cat-bar-fill { height: 100%; background: #3b82f6; border-radius: 100px; }
  .cat-value { font-size: 13px; font-weight: 700; color: #0f172a; min-width: 80px; text-align: right; }

  .actions-row { display: flex; gap: 12px; margin-bottom: 24px; }
  .btn-add {
    display: flex; align-items: center; gap: 8px; padding: 12px 20px;
    background: linear-gradient(135deg, #10b981, #059669);
    color: #fff; font-family: 'DM Sans', sans-serif;
    font-size: 14px; font-weight: 600; border: none;
    border-radius: 10px; cursor: pointer;
    box-shadow: 0 4px 15px rgba(16,185,129,0.3); transition: transform 0.15s;
  }
  .btn-add:hover { transform: translateY(-1px); }
  .btn-add.blue {
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    box-shadow: 0 4px 15px rgba(59,130,246,0.3);
  }

  .section-title { font-size: 15px; font-weight: 700; color: #0f172a; margin-bottom: 14px; }
  .gastos-list { display: flex; flex-direction: column; gap: 10px; }
  .gasto-item {
    background: #fff; border-radius: 12px; padding: 14px 18px;
    border: 1px solid #f1f5f9; display: flex;
    align-items: center; justify-content: space-between;
    box-shadow: 0 1px 2px rgba(0,0,0,0.04);
    transition: box-shadow 0.15s;
  }
  .gasto-item:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
  .gasto-left { display: flex; align-items: center; gap: 12px; }
  .gasto-icon {
    width: 38px; height: 38px; border-radius: 10px;
    background: #f1f5f9; display: flex;
    align-items: center; justify-content: center; font-size: 17px;
  }
  .gasto-desc { font-size: 14px; font-weight: 600; color: #0f172a; }
  .gasto-meta { font-size: 12px; color: #94a3b8; margin-top: 2px; }
  .gasto-right { display: flex; align-items: center; gap: 10px; }
  .gasto-valor { font-family: 'Playfair Display', serif; font-size: 17px; font-weight: 700; color: #ef4444; }
  .badge {
    padding: 4px 10px; border-radius: 100px; font-size: 11px;
    font-weight: 600; cursor: pointer; border: none; transition: all 0.15s;
  }
  .badge-essencial { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
  .badge-nao-essencial { background: #fff7ed; color: #ea580c; border: 1px solid #fed7aa; }

  .btn-delete {
    width: 30px; height: 30px; border-radius: 8px;
    background: #fef2f2; border: 1px solid #fecaca;
    color: #ef4444; font-size: 14px; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.15s; flex-shrink: 0;
  }
  .btn-delete:hover { background: #ef4444; color: #fff; }

  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.5);
    backdrop-filter: blur(4px); display: flex;
    align-items: center; justify-content: center; z-index: 100;
  }
  .modal {
    background: #fff; border-radius: 20px; padding: 36px;
    width: 100%; max-width: 480px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.15);
    max-height: 90vh; overflow-y: auto;
  }
  .modal-title {
    font-family: 'Playfair Display', serif;
    font-size: 24px; font-weight: 700; color: #0f172a; margin-bottom: 6px;
  }
  .modal-sub { font-size: 14px; color: #64748b; margin-bottom: 28px; }
  .form-group { margin-bottom: 16px; }
  .form-label { display: block; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 6px; }
  .form-input {
    width: 100%; padding: 12px 14px; background: #f8fafc;
    border: 1.5px solid #e2e8f0; border-radius: 10px;
    font-family: 'DM Sans', sans-serif; font-size: 15px;
    color: #0f172a; outline: none; transition: border-color 0.2s;
  }
  .form-input:focus { border-color: #10b981; background: #fff; }
  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .toggle-row {
    display: flex; align-items: center; justify-content: space-between;
    background: #f8fafc; padding: 14px 16px; border-radius: 10px;
    border: 1.5px solid #e2e8f0;
  }
  .toggle-label { font-size: 14px; font-weight: 500; color: #374151; }
  .toggle {
    width: 44px; height: 24px; background: #e2e8f0;
    border-radius: 100px; border: none; cursor: pointer;
    position: relative; transition: background 0.2s;
  }
  .toggle.on { background: #10b981; }
  .toggle::after {
    content: ''; position: absolute; width: 18px; height: 18px;
    background: #fff; border-radius: 50%; top: 3px; left: 3px;
    transition: transform 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  }
  .toggle.on::after { transform: translateX(20px); }
  .modal-actions { display: flex; gap: 12px; margin-top: 24px; }
  .btn-primary {
    flex: 1; padding: 13px;
    background: linear-gradient(135deg, #10b981, #059669);
    color: #fff; font-family: 'DM Sans', sans-serif;
    font-size: 15px; font-weight: 600; border: none;
    border-radius: 10px; cursor: pointer; transition: transform 0.15s;
    box-shadow: 0 4px 15px rgba(16,185,129,0.3);
  }
  .btn-primary:hover { transform: translateY(-1px); }
  .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
  .btn-secondary {
    padding: 13px 20px; background: #f1f5f9; color: #64748b;
    font-family: 'DM Sans', sans-serif; font-size: 15px;
    font-weight: 500; border: none; border-radius: 10px;
    cursor: pointer; transition: background 0.15s;
  }
  .btn-secondary:hover { background: #e2e8f0; }
  .alert {
    padding: 10px 14px; border-radius: 8px; font-size: 13px;
    margin-bottom: 16px; display: flex; align-items: center; gap: 6px;
  }
  .alert-error { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; }
  .alert-success { background: #f0fdf4; border: 1px solid #bbf7d0; color: #16a34a; }
  .spinner {
    display: inline-block; width: 14px; height: 14px;
    border: 2px solid rgba(255,255,255,0.4); border-top-color: #fff;
    border-radius: 50%; animation: spin 0.7s linear infinite;
    margin-right: 6px; vertical-align: middle;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .empty-state { text-align: center; padding: 40px; color: #94a3b8; }
  .empty-icon { font-size: 40px; margin-bottom: 10px; }

  .confirm-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.5);
    backdrop-filter: blur(4px); display: flex;
    align-items: center; justify-content: center; z-index: 200;
  }
  .confirm-box {
    background: #fff; border-radius: 16px; padding: 28px;
    width: 100%; max-width: 380px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.15);
    text-align: center;
  }
  .confirm-icon { font-size: 40px; margin-bottom: 12px; }
  .confirm-title { font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 8px; }
  .confirm-sub { font-size: 14px; color: #64748b; margin-bottom: 24px; }
  .confirm-actions { display: flex; gap: 10px; }
  .btn-danger {
    flex: 1; padding: 12px;
    background: linear-gradient(135deg, #ef4444, #dc2626);
    color: #fff; font-family: 'DM Sans', sans-serif;
    font-size: 14px; font-weight: 600; border: none;
    border-radius: 10px; cursor: pointer;
  }
`;

function fmt(v) {
  return `R$ ${Number(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
}

function getProgressClass(pct) {
  if (pct < 70) return "safe";
  if (pct < 90) return "warn";
  return "danger";
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const agora = new Date();

  const [mes, setMes] = useState(agora.getMonth() + 1);
  const [ano] = useState(agora.getFullYear());
  const [resumo, setResumo] = useState(null);
  const [gastos, setGastos] = useState([]);
  const [renda, setRenda] = useState(null);

  const [modalRenda, setModalRenda] = useState(false);
  const [modalGasto, setModalGasto] = useState(false);
  const [gastoParaDeletar, setGastoParaDeletar] = useState(null);

  const [formRenda, setFormRenda] = useState({
    valor: "", descricao: "", mes: agora.getMonth() + 1, ano: agora.getFullYear()
  });
  const [formGasto, setFormGasto] = useState({
    valor: "", descricao: "", categoria: "Alimentação",
    essencial: false, data: agora.toISOString().split("T")[0]
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function fetchDados() {
    try {
      const [res, g, r] = await Promise.all([
        api.get(`/resumo/mensal/${ano}/${mes}`).catch(() => ({ data: null })),
        api.get(`/gastos/por-mes/${ano}/${mes}`).catch(() => ({ data: [] })),
        api.get("/renda/mes-atual").catch(() => ({ data: null })),
      ]);
      setResumo(res.data);
      setGastos(g.data || []);
      setRenda(r.data);
    } catch { }
  }

  useEffect(() => { fetchDados(); }, [mes]);

  async function handleSubmitRenda(e) {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!formRenda.valor || Number(formRenda.valor) <= 0)
      return setError("Informe um valor positivo.");
    setLoading(true);
    try {
      await api.post("/renda/", {
        valor: Number(formRenda.valor),
        descricao: formRenda.descricao,
        mes: Number(formRenda.mes),
        ano: Number(formRenda.ano),
      });
      setSuccess("Renda salva!");
      await fetchDados();
      setTimeout(() => { setModalRenda(false); setSuccess(""); }, 1200);
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(typeof detail === "string" ? detail : Array.isArray(detail) ? detail.map((d) => d.msg || "").join("; ") : "Erro ao salvar.");
    } finally { setLoading(false); }
  }

  async function handleSubmitGasto(e) {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!formGasto.valor || Number(formGasto.valor) <= 0)
      return setError("Informe um valor positivo.");
    if (!formGasto.descricao) return setError("Informe uma descrição.");
    setLoading(true);
    try {
      await api.post("/gastos/", {
        valor: Number(formGasto.valor),
        descricao: formGasto.descricao,
        categoria: formGasto.categoria,
        essencial: formGasto.essencial,
        data: new Date(formGasto.data + "T12:00:00").toISOString(),
      });
      setSuccess("Gasto registrado!");
      setFormGasto({
        valor: "", descricao: "", categoria: "Alimentação",
        essencial: false, data: agora.toISOString().split("T")[0]
      });
      await fetchDados();
      setTimeout(() => { setModalGasto(false); setSuccess(""); }, 1200);
    } catch (err) {
      const detail2 = err.response?.data?.detail;
      setError(typeof detail2 === "string" ? detail2 : Array.isArray(detail2) ? detail2.map((d) => d.msg || "").join("; ") : "Erro ao registrar.");
    } finally { setLoading(false); }
  }

  async function handleDeletar() {
    if (!gastoParaDeletar) return;
    try {
      await api.delete(`/gastos/${gastoParaDeletar.id}`);
      setGastoParaDeletar(null);
      await fetchDados();
    } catch { }
  }

  async function toggleEssencial(gasto) {
    try {
      await api.patch(`/gastos/${gasto.id}/classificar`, { essencial: !gasto.essencial });
      await fetchDados();
    } catch { }
  }

  const pct = resumo?.percentual_gasto || 0;
  const saldo = resumo?.saldo || 0;
  const maxCat = resumo?.por_categoria
    ? Math.max(...Object.values(resumo.por_categoria))
    : 1;
  const inicial = user?.email?.[0]?.toUpperCase() || "U";

  return (
    <>
      <style>{styles}</style>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet" />

      <div className="layout">
        <aside className="sidebar">
          <div className="sidebar-brand">
            <div className="sidebar-brand-icon">FA</div>
            <span className="sidebar-brand-name">FinanceApp</span>
          </div>
          <a className="nav-item active" href="/dashboard">Visão Geral</a>
          <a className="nav-item" href="/classificar">Transações</a>
          <a className="nav-item" href="/graficos">Análises</a>
          <a className="nav-item" href="/perfil">Meu Perfil</a>
          <a className="nav-item" href="/metricas">Métricas</a>
          <a className="nav-item" href="/historico">Histórico</a>
          <div className="sidebar-bottom">
            <button className="nav-item" onClick={logout} style={{ color: "#ef4444" }}>
              Sair
            </button>
          </div>
        </aside>

        <main className="main">
          <div className="topbar">
            <h1 className="page-title">Dashboard</h1>
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

          {/* Cards */}
          <div className="cards-grid">
            <div className="card">
              <p className="card-label">Renda do mês</p>
              <p className="card-value green">{fmt(resumo?.total_renda)}</p>
              <p className="card-sub">{renda ? `${MESES[renda.mes - 1]} ${renda.ano}` : "Não cadastrada"}</p>
            </div>
            <div className="card">
              <p className="card-label">Total de gastos</p>
              <p className="card-value red">{fmt(resumo?.total_gastos)}</p>
              <p className="card-sub">{resumo?.quantidade_gastos || 0} gasto(s) no mês</p>
            </div>
            <div className="card">
              <p className="card-label">Saldo disponível</p>
              <p className={`card-value ${saldo >= 0 ? "blue" : "red"}`}>{fmt(saldo)}</p>
              <p className="card-sub">Renda − Gastos</p>
            </div>
          </div>

          {/* Botões */}
          <div className="actions-row">
            <button className="btn-add" onClick={() => { setError(""); setSuccess(""); setModalRenda(true); }}>
              💵 {renda ? "Atualizar renda" : "Cadastrar renda"}
            </button>
            <button className="btn-add blue" onClick={() => { setError(""); setSuccess(""); setModalGasto(true); }}>
              ＋ Registrar gasto
            </button>
          </div>

          {/* Resumo financeiro */}
          <div className="resumo-grid">
            <div className="resumo-card">
              <p className="resumo-title">📋 Resumo financeiro mensal</p>
              <div className="resumo-row">
                <span className="resumo-row-label">💵 Renda total</span>
                <span className="resumo-row-value green">{fmt(resumo?.total_renda)}</span>
              </div>
              <div className="resumo-row">
                <span className="resumo-row-label">💸 Total de gastos</span>
                <span className="resumo-row-value red">{fmt(resumo?.total_gastos)}</span>
              </div>
              <div className="resumo-row">
                <span className="resumo-row-label">✅ Essenciais</span>
                <span className="resumo-row-value">{fmt(resumo?.total_essencial)}</span>
              </div>
              <div className="resumo-row">
                <span className="resumo-row-label">⚠️ Não essenciais</span>
                <span className="resumo-row-value">{fmt(resumo?.total_nao_essencial)}</span>
              </div>
              <div className="resumo-row">
                <span className="resumo-row-label">💰 Saldo final</span>
                <span className={`resumo-row-value ${saldo >= 0 ? "green" : "red"}`}>{fmt(saldo)}</span>
              </div>
              <div className="progress-wrap">
                <div className="progress-label">
                  <span>Comprometido da renda</span>
                  <span style={{ fontWeight: 700, color: pct > 90 ? "#ef4444" : pct > 70 ? "#f59e0b" : "#10b981" }}>{pct}%</span>
                </div>
                <div className="progress-bar">
                  <div className={`progress-fill ${getProgressClass(pct)}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                </div>
                <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 6 }}>
                  {pct < 70 ? "✅ Situação saudável" : pct < 90 ? "⚠️ Atenção aos gastos" : "🚨 Gastos elevados!"}
                </p>
              </div>
            </div>

            <div className="resumo-card">
              <p className="resumo-title">🗂️ Gastos por categoria</p>
              {resumo?.por_categoria && Object.keys(resumo.por_categoria).length > 0 ? (
                Object.entries(resumo.por_categoria)
                  .sort((a, b) => b[1] - a[1])
                  .map(([cat, val]) => (
                    <div className="cat-row" key={cat}>
                      <div className="cat-left">
                        <div className="cat-icon">{CATEGORIA_ICONES[cat] || "📦"}</div>
                        <span className="cat-name">{cat}</span>
                      </div>
                      <div className="cat-bar-wrap">
                        <div className="cat-bar">
                          <div className="cat-bar-fill" style={{ width: `${(val / maxCat) * 100}%` }} />
                        </div>
                      </div>
                      <span className="cat-value">{fmt(val)}</span>
                    </div>
                  ))
              ) : (
                <div className="empty-state"><p>Nenhum gasto registrado.</p></div>
              )}
            </div>
          </div>

          {/* Lista de gastos */}
          <p className="section-title">Todos os gastos — {MESES[mes - 1]} {ano}</p>
          {gastos.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">💸</div>
              <p>Nenhum gasto registrado em {MESES[mes - 1]}.</p>
            </div>
          ) : (
            <div className="gastos-list">
              {gastos.map(g => (
                <div className="gasto-item" key={g.id}>
                  <div className="gasto-left">
                    <div className="gasto-icon">{CATEGORIA_ICONES[g.categoria] || "📦"}</div>
                    <div>
                      <p className="gasto-desc">{g.descricao}</p>
                      <p className="gasto-meta">{g.categoria} · {new Date(g.data).toLocaleDateString("pt-BR")}</p>
                    </div>
                  </div>
                  <div className="gasto-right">
                    <span className="gasto-valor">{fmt(g.valor)}</span>
                    <button
                      className={`badge ${g.essencial ? "badge-essencial" : "badge-nao-essencial"}`}
                      onClick={() => toggleEssencial(g)}
                      title="Clique para alternar"
                    >
                      {g.essencial ? "✅ Essencial" : "⚠️ Não essencial"}
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => setGastoParaDeletar(g)}
                      title="Excluir gasto"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* MODAL RENDA */}
      {modalRenda && (
        <div className="modal-overlay" onClick={() => setModalRenda(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">Cadastrar renda</h2>
            <p className="modal-sub">Informe sua renda mensal.</p>
            <form onSubmit={handleSubmitRenda} noValidate>
              {error && <div className="alert alert-error">⚠️ {error}</div>}
              {success && <div className="alert alert-success">✅ {success}</div>}
              <div className="form-group">
                <label className="form-label">Valor (R$)</label>
                <input type="number" min="0.01" step="0.01" className="form-input"
                  placeholder="Ex: 3500.00" value={formRenda.valor}
                  onChange={e => setFormRenda({ ...formRenda, valor: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Descrição (opcional)</label>
                <input type="text" className="form-input" placeholder="Ex: Salário..."
                  value={formRenda.descricao}
                  onChange={e => setFormRenda({ ...formRenda, descricao: e.target.value })} />
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Mês</label>
                  <select className="form-input" value={formRenda.mes}
                    onChange={e => setFormRenda({ ...formRenda, mes: e.target.value })}>
                    {MESES.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Ano</label>
                  <input type="number" className="form-input" value={formRenda.ano}
                    onChange={e => setFormRenda({ ...formRenda, ano: e.target.value })} />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setModalRenda(false)}>Cancelar</button>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading && <span className="spinner" />}
                  {loading ? "Salvando..." : "Salvar renda"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL GASTO */}
      {modalGasto && (
        <div className="modal-overlay" onClick={() => setModalGasto(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">Registrar gasto</h2>
            <p className="modal-sub">Adicione um gasto ao seu controle financeiro.</p>
            <form onSubmit={handleSubmitGasto} noValidate>
              {error && <div className="alert alert-error">⚠️ {error}</div>}
              {success && <div className="alert alert-success">✅ {success}</div>}
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Valor (R$)</label>
                  <input type="number" min="0.01" step="0.01" className="form-input"
                    placeholder="Ex: 150.00" value={formGasto.valor}
                    onChange={e => setFormGasto({ ...formGasto, valor: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Data</label>
                  <input type="date" className="form-input" value={formGasto.data}
                    onChange={e => setFormGasto({ ...formGasto, data: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Descrição</label>
                <input type="text" className="form-input" placeholder="Ex: Mercado, Uber..."
                  value={formGasto.descricao}
                  onChange={e => setFormGasto({ ...formGasto, descricao: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Categoria</label>
                <select className="form-input" value={formGasto.categoria}
                  onChange={e => setFormGasto({ ...formGasto, categoria: e.target.value })}>
                  {CATEGORIAS.map(c => <option key={c} value={c}>{CATEGORIA_ICONES[c]} {c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <div className="toggle-row">
                  <span className="toggle-label">💡 Gasto essencial?</span>
                  <button type="button"
                    className={`toggle ${formGasto.essencial ? "on" : ""}`}
                    onClick={() => setFormGasto({ ...formGasto, essencial: !formGasto.essencial })} />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setModalGasto(false)}>Cancelar</button>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading && <span className="spinner" />}
                  {loading ? "Salvando..." : "Registrar gasto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRMAÇÃO DE EXCLUSÃO */}
      {gastoParaDeletar && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <div className="confirm-icon">🗑️</div>
            <p className="confirm-title">Excluir gasto?</p>
            <p className="confirm-sub">
              Tem certeza que quer excluir <strong>"{gastoParaDeletar.descricao}"</strong> de {fmt(gastoParaDeletar.valor)}? Essa ação não pode ser desfeita.
            </p>
            <div className="confirm-actions">
              <button className="btn-secondary" onClick={() => setGastoParaDeletar(null)}>Cancelar</button>
              <button className="btn-danger" onClick={handleDeletar}>Sim, excluir</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}