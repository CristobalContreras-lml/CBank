import { useState, useEffect } from "react";
import { observarUsuario } from "./services/authService";
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

  return <p>Sesión activa: {usuario.email} (próximo paso: Dashboard)</p>;
}

export default App;