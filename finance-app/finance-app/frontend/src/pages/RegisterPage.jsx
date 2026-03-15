import { useState } from "react";
import api from "../services/api";

const styles = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: #0a0f1e;
    min-height: 100vh;
  }

  .page {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .left-panel {
    background: linear-gradient(145deg, #0d1b2a 0%, #0a1628 50%, #061020 100%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 80px 64px;
    position: relative;
    overflow: hidden;
  }

  .left-panel::before {
    content: '';
    position: absolute;
    width: 500px;
    height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(52, 211, 153, 0.08) 0%, transparent 70%);
    top: -100px;
    left: -100px;
  }

  .left-panel::after {
    content: '';
    position: absolute;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(16, 185, 129, 0.06) 0%, transparent 70%);
    bottom: -80px;
    right: -80px;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 72px;
    position: relative;
    z-index: 1;
  }

  .brand-icon {
    width: 44px;
    height: 44px;
    background: linear-gradient(135deg, #10b981, #34d399);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    box-shadow: 0 0 30px rgba(16, 185, 129, 0.35);
  }

  .brand-name {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    font-weight: 700;
    color: #f0fdf8;
    letter-spacing: -0.3px;
  }

  .hero-content { position: relative; z-index: 1; }

  .hero-tag {
    display: inline-block;
    background: rgba(16, 185, 129, 0.15);
    border: 1px solid rgba(16, 185, 129, 0.3);
    color: #34d399;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 6px 14px;
    border-radius: 100px;
    margin-bottom: 28px;
  }

  .hero-title {
    font-family: 'Playfair Display', serif;
    font-size: 48px;
    font-weight: 700;
    color: #f0fdf8;
    line-height: 1.15;
    letter-spacing: -1px;
    margin-bottom: 20px;
  }

  .hero-title span { color: #34d399; }

  .hero-sub {
    font-size: 16px;
    color: #94a3b8;
    line-height: 1.7;
    max-width: 380px;
    margin-bottom: 56px;
    font-weight: 300;
  }

  .stats { display: flex; gap: 40px; }

  .stat { display: flex; flex-direction: column; gap: 4px; }

  .stat-value {
    font-family: 'Playfair Display', serif;
    font-size: 28px;
    font-weight: 700;
    color: #34d399;
  }

  .stat-label {
    font-size: 12px;
    color: #64748b;
    font-weight: 400;
    letter-spacing: 0.5px;
  }

  .right-panel {
    background: #f8fafc;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 60px 48px;
  }

  .form-card { width: 100%; max-width: 420px; }

  .form-header { margin-bottom: 40px; }

  .form-title {
    font-family: 'Playfair Display', serif;
    font-size: 32px;
    font-weight: 700;
    color: #0f172a;
    letter-spacing: -0.5px;
    margin-bottom: 8px;
  }

  .form-subtitle {
    font-size: 15px;
    color: #64748b;
    font-weight: 300;
  }

  .form-group { margin-bottom: 20px; }

  .form-label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 8px;
    letter-spacing: 0.3px;
  }

  .form-input {
    width: 100%;
    padding: 14px 16px;
    background: #fff;
    border: 1.5px solid #e2e8f0;
    border-radius: 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    color: #0f172a;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .form-input:focus {
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.12);
  }

  .form-input::placeholder { color: #cbd5e1; }

  .form-input.error {
    border-color: #f87171;
    box-shadow: 0 0 0 3px rgba(248, 113, 113, 0.1);
  }

  .input-hint {
    font-size: 12px;
    color: #94a3b8;
    margin-top: 6px;
  }

  .btn-submit {
    width: 100%;
    padding: 15px;
    background: linear-gradient(135deg, #10b981, #059669);
    color: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 600;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
    margin-top: 8px;
    box-shadow: 0 4px 20px rgba(16, 185, 129, 0.3);
    letter-spacing: 0.2px;
  }

  .btn-submit:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 8px 28px rgba(16, 185, 129, 0.4);
  }

  .btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }

  .divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 24px 0;
    color: #cbd5e1;
    font-size: 13px;
  }

  .divider::before, .divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e2e8f0;
  }

  .alert {
    padding: 12px 16px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .alert-error { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; }
  .alert-success { background: #f0fdf4; border: 1px solid #bbf7d0; color: #16a34a; }

  .spinner {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255,255,255,0.4);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    margin-right: 8px;
    vertical-align: middle;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .login-link {
    text-align: center;
    margin-top: 24px;
    font-size: 14px;
    color: #64748b;
  }

  .login-link a { color: #10b981; font-weight: 600; text-decoration: none; }
  .login-link a:hover { text-decoration: underline; }

  .password-strength { margin-top: 6px; display: flex; gap: 4px; }

  .strength-bar {
    height: 3px;
    flex: 1;
    border-radius: 2px;
    background: #e2e8f0;
    transition: background 0.3s;
  }

  @media (max-width: 768px) {
    .page { grid-template-columns: 1fr; }
    .left-panel { display: none; }
    .right-panel { padding: 40px 24px; }
  }
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

export default function RegisterPage() {
  const [form, setForm] = useState({ email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const strength = getStrength(form.password);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password || !form.confirm)
      return setError("Preencha todos os campos.");
    if (form.password.length < 6)
      return setError("A senha deve ter no mínimo 6 caracteres.");
    if (form.password !== form.confirm)
      return setError("As senhas não coincidem.");

    setLoading(true);
    try {
      await api.post("/auth/register", {
        email: form.email,
        password: form.password,
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.detail || "Erro ao criar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{styles}</style>
      <div className="page">

        <div className="left-panel">
          <div className="brand">
            <div className="brand-icon">💰</div>
            <span className="brand-name">FinanceApp</span>
          </div>
          <div className="hero-content">
            <span className="hero-tag">Controle Financeiro</span>
            <h1 className="hero-title">
              Suas finanças,<br />
              sob <span>controle</span>.
            </h1>
            <p className="hero-sub">
              Registre sua renda, acompanhe seus gastos e visualize
              seu saldo em tempo real. Simples, rápido e seguro.
            </p>
            <div className="stats">
              <div className="stat">
                <span className="stat-value">100%</span>
                <span className="stat-label">Gratuito</span>
              </div>
              <div className="stat">
                <span className="stat-value">+8</span>
                <span className="stat-label">Funcionalidades</span>
              </div>
              <div className="stat">
                <span className="stat-value">US08</span>
                <span className="stat-label">User Stories</span>
              </div>
            </div>
          </div>
        </div>

        <div className="right-panel">
          <div className="form-card">
            <div className="form-header">
              <h2 className="form-title">Criar conta</h2>
              <p className="form-subtitle">Comece a controlar suas finanças hoje.</p>
            </div>

            {success ? (
              <div className="alert alert-success">
                ✅ Conta criada com sucesso! Em breve você poderá fazer login.
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                {error && <div className="alert alert-error">⚠️ {error}</div>}

                <div className="form-group">
                  <label className="form-label" htmlFor="email">E-mail</label>
                  <input
                    id="email" name="email" type="email"
                    className={`form-input ${error && !form.email ? "error" : ""}`}
                    placeholder="seu@email.com"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="password">Senha</label>
                  <input
                    id="password" name="password" type="password"
                    className="form-input"
                    placeholder="Mínimo 6 caracteres"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                  {form.password && (
                    <div className="password-strength">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="strength-bar"
                          style={{ background: strength >= i ? strengthColors[strength] : "#e2e8f0" }}
                        />
                      ))}
                    </div>
                  )}
                  <p className="input-hint">
                    {form.password
                      ? ["", "Muito fraca", "Fraca", "Boa", "Forte"][strength]
                      : "Use letras, números e símbolos para maior segurança."}
                  </p>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="confirm">Confirmar senha</label>
                  <input
                    id="confirm" name="confirm" type="password"
                    className={`form-input ${form.confirm && form.confirm !== form.password ? "error" : ""}`}
                    placeholder="Repita sua senha"
                    value={form.confirm}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                  {form.confirm && form.confirm !== form.password && (
                    <p className="input-hint" style={{ color: "#f87171" }}>
                      As senhas não coincidem.
                    </p>
                  )}
                </div>

                <button className="btn-submit" type="submit" disabled={loading}>
                  {loading && <span className="spinner" />}
                  {loading ? "Criando conta..." : "Criar conta grátis"}
                </button>
              </form>
            )}

            <div className="divider">ou</div>
            <p className="login-link">
              Já tem uma conta? <a href="/login">Entrar</a>
            </p>
          </div>
        </div>

      </div>
    </>
  );
}