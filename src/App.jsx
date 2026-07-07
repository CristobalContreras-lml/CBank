import { useState, useEffect } from "react";
import { observarUsuario, cerrarSesion } from "./services/authService";
import Login from "./components/Login";
import Registro from "./components/Registro";

function App() {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [mostrarRegistro, setMostrarRegistro] = useState(false);

  useEffect(() => {
    const unsubscribe = observarUsuario((usuarioFirebase) => {
      setUsuario(usuarioFirebase);
      setCargando(false);
    });

    return () => unsubscribe();
  }, []);

  async function handleLogoutClick() {
    await cerrarSesion();
    // No hace falta setUsuario(null) aquí: onAuthStateChanged
    // detecta el logout y actualiza el estado solo.
  }

  if (cargando) {
    return <p>Cargando...</p>;
  }

  if (!usuario) {
    return mostrarRegistro ? (
      <Registro onCambiarALogin={() => setMostrarRegistro(false)} />
    ) : (
      <Login onCambiarARegistro={() => setMostrarRegistro(true)} />
    );
  }

  return (
    <div>
      <p>Sesión activa: {usuario.email} (próximo paso: Dashboard)</p>
      <button onClick={handleLogoutClick}>Cerrar sesión</button>
    </div>
  );
}

export default App;