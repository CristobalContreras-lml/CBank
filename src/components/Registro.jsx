import { useState } from "react";
import { registrarUsuario } from "../services/authService";

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
      // No navegamos manualmente a ningún lado: App.jsx detecta
      // el cambio de sesión automáticamente vía onAuthStateChanged.
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
    <div>
      <h2>Crear cuenta</h2>
      <form onSubmit={handleRegistroSubmit}>
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

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" disabled={enviando}>
          {enviando ? "Creando cuenta..." : "Registrarme"}
        </button>
      </form>

      <p>
        ¿Ya tienes cuenta?{" "}
        <button type="button" onClick={onCambiarALogin}>
          Inicia sesión
        </button>
      </p>
    </div>
  );
}

export default Registro;