import { useState } from "react";
import { iniciarSesion } from "../services/authService";

function Login({ onCambiarARegistro }) {
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
      // Igual que en Registro: no navegamos manualmente,
      // App.jsx reacciona solo vía onAuthStateChanged.
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
    <div>
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleLoginSubmit}>
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

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" disabled={enviando}>
          {enviando ? "Ingresando..." : "Ingresar"}
        </button>
      </form>

      <p>
        ¿No tienes cuenta?{" "}
        <button type="button" onClick={onCambiarARegistro}>
          Regístrate
        </button>
      </p>
    </div>
  );
}

export default Login;