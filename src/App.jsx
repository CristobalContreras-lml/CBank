import { useSesion } from "./context/SesionContext";
import { useState } from "react";
import Login from "./components/Login";
import Registro from "./components/Registro";
import Logo from "./components/Logo";
import Saldo from "./components/Saldo";
import DepositoRetiro from "./components/DepositoRetiro";
import FormularioTransferencia from "./components/FormularioTransferencia";
import HistorialMovimientos from "./components/HistorialMovimientos";
import ThemeToggle from "./components/ThemeToggle";

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
           <ThemeToggle />
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
      <footer className="footer-app">
        <div className="footer-app-icono">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 21h18" />
            <path d="M5 21V9l7-6 7 6v12" />
            <path d="M9 21v-6h6v6" />
          </svg>
        </div>
        <p>
          <strong>© CBank 2026.</strong> Todos los derechos reservados.
          <br />
          CBank es un proyecto académico desarrollado con fines educativos.
          No constituye una institución financiera real ni ofrece servicios bancarios legítimos.
        </p>
      </footer>
    </div>
  );
}

export default App;