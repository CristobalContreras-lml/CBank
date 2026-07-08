import { useState, useEffect } from "react";
import { observarUsuario, cerrarSesion } from "./services/authService";
import Login from "./components/Login";
import Registro from "./components/Registro";
import Saldo from "./components/Saldo";
import FormularioTransferencia from "./components/FormularioTransferencia";
import HistorialMovimientos from "./components/HistorialMovimientos";

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
      <Saldo uid={usuario.uid} />
       <FormularioTransferencia emisorUid={usuario.uid} emisorEmail={usuario.email} />
       <HistorialMovimientos uid={usuario.uid} />
      <button onClick={handleLogoutClick}>Cerrar sesión</button>
    </div>
  );
}

export default App;