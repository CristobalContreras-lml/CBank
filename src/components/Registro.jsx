import { useState } from "react";
import { registrarUsuario } from "../services/authService";
import Logo from "./Logo";

function Registro({ onCambiarALogin }) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
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
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-logo-wrap">
          <Logo tamaño="grande" />
        </div>
        <h2 className="auth-title">Crea tu cuenta</h2>
        <p className="auth-subtitle">Empieza con $100.000 de regalo</p>

        <form className="auth-form" onSubmit={handleRegistroSubmit}>
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={handleNombreChange}
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={handleEmailChange}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={handlePasswordChange}
          />
          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmarPassword}
            onChange={handleConfirmarPasswordChange}
          />

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