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

  .main { margin-left: 240px; flex: 1; padding: 40px; max-width: 700px; }

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

  .avatar-big {
    width: 80px; height: 80px;
    background: linear-gradient(135deg, #10b981, #34d399);
    border-radius: 50%; display: flex;
    align-items: center; justify-content: center;
    font-size: 32px; font-weight: 700; color: #fff;
    margin-bottom: 16px;
    box-shadow: 0 4px 20px rgba(16,185,129,0.3);
  }

  .card {
    background: #fff; border-radius: 16px; padding: 28px;
    border: 1px solid #f1f5f9;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    margin-bottom: 20px;
  }

  .card-header {
    display: flex; align-items: center; gap: 16px;
    margin-bottom: 24px; padding-bottom: 20px;
    border-bottom: 1px solid #f1f5f9;
  }
  .card-header-info h2 {
    font-family: 'Playfair Display', serif;
    font-size: 20px; font-weight: 700; color: #0f172a; margin-bottom: 4px;
  }
  .card-header-info p { font-size: 13px; color: #94a3b8; }

  .info-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 12px 0; border-bottom: 1px solid #f8fafc;
  }
  .info-row:last-child { border-bottom: none; }
  .info-label { font-size: 13px; font-weight: 600; color: #64748b; }
  .info-value { font-size: 14px; color: #0f172a; font-weight: 500; }

  .section-title {
    font-family: 'Playfair Display', serif;
    font-size: 20px; font-weight: 700; color: #0f172a; margin-bottom: 20px;
  }

  .form-group { margin-bottom: 16px; }
  .form-label {
    display: block; font-size: 13px; font-weight: 600;
    color: #374151; margin-bottom: 6px;
  }
  .form-input {
    width: 100%; padding: 12px 14px; background: #f8fafc;
    border: 1.5px solid #e2e8f0; border-radius: 10px;
    font-family: 'DM Sans', sans-serif; font-size: 15px;
    color: #0f172a; outline: none; transition: border-color 0.2s;
  }
  .form-input:focus { border-color: #10b981; background: #fff; }

  .strength-bar-wrap { display: flex; gap: 4px; margin-top: 6px; }
  .strength-bar {
    height: 3px; flex: 1; border-radius: 2px;
    background: #e2e8f0; transition: background 0.3s;
  }
  .strength-hint { font-size: 12px; color: #94a3b8; margin-top: 4px; }

  .btn-primary {
    width: 100%; padding: 13px;
    background: linear-gradient(135deg, #10b981, #059669);
    color: #fff; font-family: 'DM Sans', sans-serif;
    font-size: 15px; font-weight: 600; border: none;
    border-radius: 10px; cursor: pointer; transition: transform 0.15s;
    box-shadow: 0 4px 15px rgba(16,185,129,0.3); margin-top: 8px;
  }
  .btn-primary:hover { transform: translateY(-1px); }
  .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  .alert {
    padding: 12px 16px; border-radius: 10px; font-size: 14px;
    margin-bottom: 16px; display: flex; align-items: center; gap: 8px;
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
`;

function getStrength(password) {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  return score;
}

const strengthColors = ["#e2e8f0", "#f87171", "#fb923c", "#facc15", "#10b981"];
const strengthLabels = ["", "Muito fraca", "Fraca", "Boa", "Forte"];

export default function PerfilPage() {
  const { user, logout } = useAuth();
  const [perfil, setPerfil] = useState(null);
  const [form, setForm] = useState({ senha_atual: "", nova_senha: "", confirmar: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const strength = getStrength(form.nova_senha);
  const inicial = user?.email?.[0]?.toUpperCase() || "U";

  function handleLogout() {
    logout();
    window.location.href = "/login";
  }

  useEffect(() => {
    api.get("/usuario/perfil")
      .then(res => setPerfil(res.data))
      .catch(() => {});
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!form.senha_atual || !form.nova_senha || !form.confirmar)
      return setError("Preencha todos os campos.");
    if (form.nova_senha.length < 6)
      return setError("A nova senha deve ter no mínimo 6 caracteres.");
    if (form.nova_senha !== form.confirmar)
      return setError("As senhas não coincidem.");
    setLoading(true);
    try {
      await api.put("/usuario/alterar-senha", {
        senha_atual: form.senha_atual,
        nova_senha: form.nova_senha,
      });
      setSuccess("Senha alterada com sucesso!");
      setForm({ senha_atual: "", nova_senha: "", confirmar: "" });
    } catch (err) {
      setError(err.response?.data?.detail || "Erro ao alterar senha.");
    } finally {
      setLoading(false);
    }
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
          <a className="nav-item" href="/dashboard"><span className="nav-icon">📊</span> Visão Geral</a>
          <a className="nav-item" href="/classificar"><span className="nav-icon">🏷️</span> Transações</a>
          <a className="nav-item" href="/graficos"><span className="nav-icon">📈</span> Análises</a>
          <a className="nav-item active" href="/perfil"><span className="nav-icon">👤</span> Meu Perfil</a>
          <div className="sidebar-bottom">
            <button className="nav-item" onClick={handleLogout} style={{ color: "#ef4444" }}>
              <span className="nav-icon">🚪</span> Sair
            </button>
          </div>
        </aside>

        <main className="main">
          <div className="topbar">
            <h1 className="page-title">Meu Perfil</h1>
            <div className="user-badge">
              <div className="user-avatar">{inicial}</div>
              {user?.email}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="avatar-big">{inicial}</div>
              <div className="card-header-info">
                <h2>{user?.email}</h2>
                <p>Membro desde {perfil?.criado_em ? new Date(perfil.criado_em).toLocaleDateString("pt-BR") : "—"}</p>
              </div>
            </div>
            <div className="info-row">
              <span className="info-label">E-mail</span>
              <span className="info-value">{perfil?.email || "—"}</span>
            </div>
            <div className="info-row">
              <span className="info-label">ID da conta</span>
              <span className="info-value">#{perfil?.id || "—"}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Data de cadastro</span>
              <span className="info-value">
                {perfil?.criado_em
                  ? new Date(perfil.criado_em).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })
                  : "—"}
              </span>
            </div>
          </div>

          <div className="card">
            <p className="section-title">Alterar senha</p>
            <form onSubmit={handleSubmit} noValidate>
              {error && <div className="alert alert-error">⚠️ {error}</div>}
              {success && <div className="alert alert-success">✅ {success}</div>}

              <div className="form-group">
                <label className="form-label">Senha atual</label>
                <input type="password" className="form-input"
                  placeholder="Digite sua senha atual"
                  value={form.senha_atual}
                  onChange={e => { setForm({ ...form, senha_atual: e.target.value }); setError(""); }} />
              </div>

              <div className="form-group">
                <label className="form-label">Nova senha</label>
                <input type="password" className="form-input"
                  placeholder="Mínimo 6 caracteres"
                  value={form.nova_senha}
                  onChange={e => { setForm({ ...form, nova_senha: e.target.value }); setError(""); }} />
                {form.nova_senha && (
                  <>
                    <div className="strength-bar-wrap">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="strength-bar"
                          style={{ background: strength >= i ? strengthColors[strength] : "#e2e8f0" }} />
                      ))}
                    </div>
                    <p className="strength-hint">{strengthLabels[strength]}</p>
                  </>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Confirmar nova senha</label>
                <input type="password" className="form-input"
                  placeholder="Repita a nova senha"
                  value={form.confirmar}
                  onChange={e => { setForm({ ...form, confirmar: e.target.value }); setError(""); }}
                  style={form.confirmar && form.confirmar !== form.nova_senha ? { borderColor: "#f87171" } : {}} />
                {form.confirmar && form.confirmar !== form.nova_senha && (
                  <p className="strength-hint" style={{ color: "#f87171" }}>As senhas não coincidem.</p>
                )}
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading && <span className="spinner" />}
                {loading ? "Alterando..." : "Alterar senha"}
              </button>
            </form>
          </div>
        </main>
      </div>
    </>
  );
}