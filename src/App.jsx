import { useSesion } from "./context/SesionContext";
import { useState } from "react";
import Login from "./components/Login";
import Registro from "./components/Registro";
import Saldo from "./components/Saldo";
import DepositoRetiro from "./components/DepositoRetiro";
import FormularioTransferencia from "./components/FormularioTransferencia";
import HistorialMovimientos from "./components/HistorialMovimientos";

function App() {
  const { usuario, cargando, cerrarSesion } = useSesion();
  const [mostrarRegistro, setMostrarRegistro] = useState(false);

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
      <DepositoRetiro uid={usuario.uid} />
      <FormularioTransferencia emisorUid={usuario.uid} emisorEmail={usuario.email} />
      <HistorialMovimientos uid={usuario.uid} />
      <button onClick={cerrarSesion}>Cerrar sesión</button>
    </div>
  );
}

export default App;