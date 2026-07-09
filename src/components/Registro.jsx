import { useState } from "react";
import { registrarUsuario } from "../services/authService";
import Logo from "./Logo";
import fondoEdificios from "../assets/fondo-edificios.jpg";

function Registro({ onCambiarALogin }) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  function handleNombreChange(event) {
    setNombre(event.target.value);
  }

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  function handleConfirmarPasswordChange(event) {
    setConfirmarPassword(event.target.value);
  }

  function handleToggleMostrarPassword() {
    setMostrarPassword((anterior) => !anterior);
  }

  async function handleRegistroSubmit(event) {
    event.preventDefault();
    setError("");

    if (!nombre.trim() || !email.trim() || !password) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (password !== confirmarPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setEnviando(true);
    try {
      await registrarUsuario(nombre.trim(), email.trim(), password);
    } catch (err) {
      setError(traducirErrorFirebase(err.code));
      setEnviando(false);
    }
  }

  function traducirErrorFirebase(code) {
    if (code === "auth/email-already-in-use") return "Ese correo ya está registrado.";
    if (code === "auth/invalid-email") return "El correo no tiene un formato válido.";
    return "Ocurrió un error al registrar la cuenta. Intenta nuevamente.";
  }

  return (
    <div className="auth-shell" style={{ backgroundImage: `url(${fondoEdificios})` }}>
      <div className="auth-card">
        <div className="auth-logo-wrap">
          <Logo tamaño="grande" />
        </div>
        <h2 className="auth-title">Crea tu cuenta</h2>
        <p className="auth-subtitle">Empieza con $100.000 de regalo</p>

        <form className="auth-form" onSubmit={handleRegistroSubmit}>
          <div className="input-group">
            <span className="input-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Nombre"
              value={nombre}
              onChange={handleNombreChange}
            />
          </div>

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

          <div className="input-group">
            <span className="input-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="11" width="14" height="9" rx="2" />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" />
              </svg>
            </span>
            <input
              type={mostrarPassword ? "text" : "password"}
              placeholder="Confirmar contraseña"
              value={confirmarPassword}
              onChange={handleConfirmarPasswordChange}
            />
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <button type="submit" className="btn-primary" disabled={enviando}>
            {enviando ? "Creando cuenta..." : "Registrarme"}
          </button>
        </form>

        <p className="auth-switch">
          ¿Ya tienes cuenta?{" "}
          <button type="button" className="btn-link" onClick={onCambiarALogin}>
            Inicia sesión
          </button>
        </p>
      </div>
    </div>
  );
}

export default Registro;