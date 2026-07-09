import { useSesion } from "./context/SesionContext";
import { useState } from "react";
import Login from "./components/Login";
import Registro from "./components/Registro";
import Logo from "./components/Logo";
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
      <header className="topbar">
        <Logo tamaño="normal" invertir />
        <div className="topbar-user">
          <span>{usuario.email}</span>
          <button className="btn-outline-light" onClick={cerrarSesion}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="dashboard-shell">
        <Saldo uid={usuario.uid} />

        <div className="dashboard-grid">
          <DepositoRetiro uid={usuario.uid} />
          <FormularioTransferencia emisorUid={usuario.uid} emisorEmail={usuario.email} />
          <HistorialMovimientos uid={usuario.uid} />
        </div>
      </main>
    </div>
  );
}

export default App;