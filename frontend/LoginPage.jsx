import { useState } from "react";
import { Navigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Error al iniciar sesión");
      localStorage.setItem("token", data.data.access_token);
      localStorage.setItem("refresh_token", data.data.refresh_token);
      localStorage.setItem("userEmail", data.data.user.email);
      localStorage.setItem("userName", data.data.user.name);
      localStorage.setItem("userRole", data.data.user.role);
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@400;600;700;800&family=DM+Sans:wght@400;500&display=swap');

        .lp-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0d1b2a;
          position: relative;
          overflow: hidden;
          font-family: 'DM Sans', sans-serif;
        }

        /* brick pattern */
        .lp-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 34px,
              rgba(255,255,255,0.03) 34px,
              rgba(255,255,255,0.03) 36px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 68px,
              rgba(255,255,255,0.03) 68px,
              rgba(255,255,255,0.03) 70px
            );
          background-size: 70px 36px;
        }

        /* staggered offset for brick effect */
        .lp-root::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 34px,
              rgba(255,255,255,0.025) 34px,
              rgba(255,255,255,0.025) 36px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 68px,
              rgba(255,255,255,0.025) 68px,
              rgba(255,255,255,0.025) 70px
            );
          background-size: 70px 36px;
          background-position: 35px 18px;
        }

        /* spotlight from top */
        .lp-spotlight {
          position: absolute;
          top: -120px;
          left: 50%;
          transform: translateX(-50%);
          width: 320px;
          height: 520px;
          background: radial-gradient(ellipse at 50% 0%, rgba(255,210,120,0.28) 0%, rgba(255,180,60,0.10) 40%, transparent 70%);
          pointer-events: none;
          z-index: 1;
        }

        .lp-lamp {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .lp-lamp-bracket {
          width: 56px;
          height: 22px;
          background: linear-gradient(180deg, #1a2535 0%, #243044 100%);
          border-radius: 0 0 8px 8px;
          border: 1px solid rgba(255,255,255,0.08);
        }

        .lp-lamp-bulb {
          width: 36px;
          height: 28px;
          background: radial-gradient(ellipse at 50% 30%, #fff9e0 0%, #ffd066 50%, #e8a000 100%);
          border-radius: 0 0 18px 18px;
          box-shadow: 0 0 30px 12px rgba(255,200,80,0.5), 0 0 60px 20px rgba(255,180,40,0.2);
          animation: lp-flicker 4s ease-in-out infinite;
        }

        @keyframes lp-flicker {
          0%, 100% { opacity: 1; box-shadow: 0 0 30px 12px rgba(255,200,80,0.5), 0 0 60px 20px rgba(255,180,40,0.2); }
          92% { opacity: 1; }
          93% { opacity: 0.85; box-shadow: 0 0 20px 8px rgba(255,200,80,0.3); }
          94% { opacity: 1; }
          96% { opacity: 0.9; }
          97% { opacity: 1; }
        }

        .lp-card {
          position: relative;
          z-index: 3;
          width: min(420px, 90vw);
          background: rgba(255,255,255,0.07);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 20px;
          padding: 44px 36px 38px;
          box-shadow: 0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.12);
          animation: lp-fadein 0.6s ease both;
        }

        @keyframes lp-fadein {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .lp-title {
          font-family: 'Exo 2', sans-serif;
          font-size: 36px;
          font-weight: 800;
          color: #fff;
          text-align: center;
          margin: 0 0 32px;
          letter-spacing: 1px;
        }

        .lp-field {
          position: relative;
          margin-bottom: 18px;
        }

        .lp-input {
          width: 100%;
          box-sizing: border-box;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 50px;
          padding: 15px 52px 15px 22px;
          font-size: 15px;
          font-family: 'DM Sans', sans-serif;
          color: #fff;
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
        }

        .lp-input::placeholder { color: rgba(255,255,255,0.45); }

        .lp-input:focus {
          border-color: rgba(255,255,255,0.5);
          background: rgba(255,255,255,0.10);
          box-shadow: 0 0 0 3px rgba(255,255,255,0.07);
        }

        .lp-icon {
          position: absolute;
          right: 18px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255,255,255,0.4);
          font-size: 18px;
          pointer-events: none;
        }

        .lp-extras {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 6px 4px 22px;
        }

        .lp-remember {
          display: flex;
          align-items: center;
          gap: 8px;
          color: rgba(255,255,255,0.65);
          font-size: 14px;
          cursor: pointer;
        }

        .lp-remember input[type=checkbox] {
          width: 15px;
          height: 15px;
          cursor: pointer;
          accent-color: rgba(255,255,255,0.8);
        }

        .lp-forgot {
          color: rgba(255,255,255,0.65);
          font-size: 14px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          font-family: 'DM Sans', sans-serif;
          transition: color 0.2s;
        }

        .lp-forgot:hover { color: #fff; }

        .lp-error {
          background: rgba(244,67,54,0.15);
          border: 1px solid rgba(244,67,54,0.4);
          border-radius: 10px;
          color: #ff8a80;
          font-size: 13px;
          padding: 10px 16px;
          margin-bottom: 16px;
          text-align: center;
        }

        .lp-btn {
          width: 100%;
          padding: 16px;
          border-radius: 50px;
          border: none;
          background: #fff;
          color: #0d1b2a;
          font-family: 'Exo 2', sans-serif;
          font-size: 17px;
          font-weight: 700;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
          box-shadow: 0 4px 20px rgba(255,255,255,0.15);
        }

        .lp-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 28px rgba(255,255,255,0.22);
        }

        .lp-btn:active:not(:disabled) { transform: translateY(0); }
        .lp-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .lp-register {
          text-align: center;
          margin-top: 22px;
          color: rgba(255,255,255,0.55);
          font-size: 14px;
        }

        .lp-register a {
          color: #fff;
          font-weight: 600;
          text-decoration: none;
          margin-left: 4px;
        }

        .lp-register a:hover { text-decoration: underline; }

        .lp-spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid rgba(13,27,42,0.3);
          border-top-color: #0d1b2a;
          border-radius: 50%;
          animation: lp-spin 0.7s linear infinite;
          vertical-align: middle;
          margin-right: 8px;
        }

        @keyframes lp-spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="lp-root">
        <div className="lp-spotlight" />
        <div className="lp-lamp">
          <div className="lp-lamp-bracket" />
          <div className="lp-lamp-bulb" />
        </div>

        <div className="lp-card">
          <h1 className="lp-title">Login</h1>

          <form onSubmit={handleLogin}>
            <div className="lp-field">
              <input
                className="lp-input"
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
              <span className="lp-icon">👤</span>
            </div>

            <div className="lp-field">
              <input
                className="lp-input"
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <span className="lp-icon">🔒</span>
            </div>

            <div className="lp-extras">
              <label className="lp-remember">
                <input type="checkbox" /> Recuérdame
              </label>
              <button type="button" className="lp-forgot">¿Olvidaste tu contraseña?</button>
            </div>

            {error && <div className="lp-error">{error}</div>}

            <button className="lp-btn" type="submit" disabled={loading}>
              {loading ? <><span className="lp-spinner" />Entrando...</> : "Login"}
            </button>
          </form>

          <p className="lp-register">
            ¿No tienes cuenta?<a href="/register">Regístrate</a>
          </p>
        </div>
      </div>
    </>
  );
}

export function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}
