import { useState } from "react";
import { iniciarSesion } from "../services/authService";
import { useSesion } from "../context/SesionContext";
import Logo from "./Logo";
import mascotaInactividad from "../assets/mascota-cbank-inactividad.png";

function Login({ onCambiarARegistro }) {
  const { motivoCierre } = useSesion();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
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
    <div className="auth-shell">
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
      </div>
    </div>
  );
}

export default Login;