import { useState } from "react";
import { iniciarSesion } from "../services/authService";
import { useSesion } from "../context/SesionContext";
import Logo from "./Logo";
import mascotaInactividad from "../assets/mascota-cbank-inactividad.png";
import fondoEdificios from "../assets/fondo-edificios.jpg";

function Login({ onCambiarARegistro }) {
  const { motivoCierre } = useSesion();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  function handleToggleMostrarPassword() {
    setMostrarPassword((anterior) => !anterior);
  }

  async function handleLoginSubmit(event) {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Ingresa tu correo y contraseña.");
      return;
    }

    setEnviando(true);
    try {
      await iniciarSesion(email.trim(), password);
    } catch (err) {
      setError(traducirErrorFirebase(err.code));
      setEnviando(false);
    }
  }

  function traducirErrorFirebase(code) {
    if (code === "auth/invalid-credential" || code === "auth/wrong-password") {
      return "Correo o contraseña incorrectos.";
    }
    if (code === "auth/user-not-found") return "No existe una cuenta con ese correo.";
    if (code === "auth/invalid-email") return "El correo no tiene un formato válido.";
    return "Ocurrió un error al iniciar sesión. Intenta nuevamente.";
  }

  return (
    <div className="auth-shell" style={{ backgroundImage: `url(${fondoEdificios})` }}>
      <div className="auth-card">
        {motivoCierre === "inactividad" && (
          <div className="alerta-inactividad">
            <img src={mascotaInactividad} alt="Sesión cerrada por inactividad" />
            <p>Se cerró la página por inactividad</p>
          </div>
        )}

        <div className="auth-logo-wrap">
          <Logo tamaño="grande" />
        </div>
        <h2 className="auth-title">Inicia sesión</h2>
        <p className="auth-subtitle">Ingresa a tu cuenta CBank</p>

        <form className="auth-form" onSubmit={handleLoginSubmit}>
          <div className="input-group">
            <span className="input-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16v16H4z" />
                <path d="M4 6l8 7 8-7" />
              </svg>
            </span>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={handleEmailChange}
            />
          </div>

          <div className="input-group">
            <span className="input-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="11" width="14" height="9" rx="2" />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" />
              </svg>
            </span>
            <input
              type={mostrarPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={handlePasswordChange}
            />
            <button
              type="button"
              className="toggle-password"
              onClick={handleToggleMostrarPassword}
              aria-label={mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {mostrarPassword ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 3l18 18" />
                  <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                  <path d="M9.5 5.1A9.4 9.4 0 0 1 12 5c5 0 9 4.5 9 7 0 1-.5 2.3-1.4 3.5M6.2 6.7C3.6 8.3 2 10.5 2 12c0 2.5 4 7 10 7 1.4 0 2.7-.2 3.8-.6" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <button type="submit" className="btn-primary" disabled={enviando}>
            {enviando ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <p className="auth-switch">
          ¿No tienes cuenta?{" "}
          <button type="button" className="btn-link" onClick={onCambiarARegistro}>
            Regístrate
          </button>
        </p>

        <div className="auth-trust">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="11" width="14" height="9" rx="2" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
          </svg>
          Conexión protegida y encriptada
        </div>
      </div>
    </div>
  );
}

export default Login;