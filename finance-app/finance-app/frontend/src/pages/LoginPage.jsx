import { useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

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
    width: 500px; height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(52,211,153,0.08) 0%, transparent 70%);
    top: -100px; left: -100px;
  }

  .left-panel::after {
    content: '';
    position: absolute;
    width: 400px; height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%);
    bottom: -80px; right: -80px;
  }

  .brand {
    display: flex; align-items: center; gap: 12px;
    margin-bottom: 72px; position: relative; z-index: 1;
  }

  .brand-icon {
    width: 44px; height: 44px;
    background: linear-gradient(135deg, #10b981, #34d399);
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px;
    box-shadow: 0 0 30px rgba(16,185,129,0.35);
  }

  .brand-name {
    font-family: 'Playfair Display', serif;
    font-size: 22px; font-weight: 700;
    color: #f0fdf8; letter-spacing: -0.3px;
  }

  .hero-content { position: relative; z-index: 1; }

  .hero-tag {
    display: inline-block;
    background: rgba(16,185,129,0.15);
    border: 1px solid rgba(16,185,129,0.3);
    color: #34d399; font-size: 11px; font-weight: 600;
    letter-spacing: 2px; text-transform: uppercase;
    padding: 6px 14px; border-radius: 100px; margin-bottom: 28px;
  }

  .hero-title {
    font-family: 'Playfair Display', serif;
    font-size: 48px; font-weight: 700; color: #f0fdf8;
    line-height: 1.15; letter-spacing: -1px; margin-bottom: 20px;
  }

  .hero-title span { color: #34d399; }

  .hero-sub {
    font-size: 16px; color: #94a3b8; line-height: 1.7;
    max-width: 380px; margin-bottom: 56px; font-weight: 300;
  }

  .right-panel {
    background: #f8fafc;
    display: flex; align-items: center; justify-content: center;
    padding: 60px 48px;
  }

  .form-card { width: 100%; max-width: 420px; }

  .form-header { margin-bottom: 40px; }

  .form-title {
    font-family: 'Playfair Display', serif;
    font-size: 32px; font-weight: 700; color: #0f172a;
    letter-spacing: -0.5px; margin-bottom: 8px;
  }

  .form-subtitle { font-size: 15px; color: #64748b; font-weight: 300; }

  .form-group { margin-bottom: 20px; }

  .form-label {
    display: block; font-size: 13px; font-weight: 600;
    color: #374151; margin-bottom: 8px; letter-spacing: 0.3px;
  }

  .form-input {
    width: 100%; padding: 14px 16px;
    background: #fff; border: 1.5px solid #e2e8f0;
    border-radius: 12px; font-family: 'DM Sans', sans-serif;
    font-size: 15px; color: #0f172a; outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .form-input:focus {
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16,185,129,0.12);
  }

  .form-input::placeholder { color: #cbd5e1; }

  .form-input.error {
    border-color: #f87171;
    box-shadow: 0 0 0 3px rgba(248,113,113,0.1);
  }

  .btn-submit {
    width: 100%; padding: 15px;
    background: linear-gradient(135deg, #10b981, #059669);
    color: #fff; font-family: 'DM Sans', sans-serif;
    font-size: 15px; font-weight: 600; border: none;
    border-radius: 12px; cursor: pointer;
    transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
    margin-top: 8px;
    box-shadow: 0 4px 20px rgba(16,185,129,0.3);
  }

  .btn-submit:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 8px 28px rgba(16,185,129,0.4);
  }

  .btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }

  .divider {
    display: flex; align-items: center; gap: 12px;
    margin: 24px 0; color: #cbd5e1; font-size: 13px;
  }

  .divider::before, .divider::after {
    content: ''; flex: 1; height: 1px; background: #e2e8f0;
  }

  .alert {
    padding: 12px 16px; border-radius: 10px;
    font-size: 14px; font-weight: 500; margin-bottom: 20px;
    display: flex; align-items: center; gap: 8px;
  }

  .alert-error { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; }

  .spinner {
    display: inline-block; width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.4); border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    margin-right: 8px; vertical-align: middle;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .register-link {
    text-align: center; margin-top: 24px;
    font-size: 14px; color: #64748b;
  }

  .register-link a { color: #10b981; font-weight: 600; text-decoration: none; }
  .register-link a:hover { text-decoration: underline; }

  @media (max-width: 768px) {
    .page { grid-template-columns: 1fr; }
    .left-panel { display: none; }
    .right-panel { padding: 40px 24px; }
  }
`;

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Preencha todos os campos.");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        email: form.email,
        password: form.password,
      });

      if (!res.data?.access_token) {
        setError("E-mail ou senha inválidos.");
        return;
      }

      login({ email: form.email }, res.data.access_token);
      window.location.href = "/dashboard";
    } catch (err) {
      const status = err.response?.status;
      const detail = err.response?.data?.detail;

      if (Array.isArray(detail)) {
        setError("E-mail inválido.");
      } else if (status === 404) {
        setError("Conta não existe.");
      } else if (status === 401) {
        setError("Senha incorreta.");
      } else {
        setError("Erro ao fazer login.");
      }
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
            <span className="hero-tag">Bem-vindo de volta</span>
            <h1 className="hero-title">
              Entre na sua<br />
              <span>conta</span>.
            </h1>
            <p className="hero-sub">
              Acesse seu painel financeiro e continue controlando seus gastos e renda de onde parou.
            </p>
          </div>
        </div>

        <div className="right-panel">
          <div className="form-card">
            <div className="form-header">
              <h2 className="form-title">Entrar</h2>
              <p className="form-subtitle">Acesse sua conta para continuar.</p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              {error && (
                <div className="alert alert-error">
                  ⚠️ {error}
                </div>
              )}

              <div className="form-group">
                <label className="form-label" htmlFor="email">E-mail</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={`form-input ${error ? "error" : ""}`}
                  placeholder="seu@email.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="password">Senha</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className={`form-input ${error ? "error" : ""}`}
                  placeholder="Sua senha"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
              </div>

              <button className="btn-submit" type="submit" disabled={loading}>
                {loading && <span className="spinner" />}
                {loading ? "Entrando..." : "Entrar"}
              </button>
            </form>

            <div className="divider">ou</div>

            <p className="register-link">
              Não tem uma conta? <a href="/cadastro">Criar conta grátis</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}