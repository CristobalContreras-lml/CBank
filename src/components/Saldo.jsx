import { useState, useEffect } from "react";
import { observarSaldo } from "../services/userService";
import logoCBank from "../assets/logo_CBank.png";
import mascotaCBank from "../assets/mascota-cbank.png";

function Saldo({ uid }) {
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const unsubscribe = observarSaldo(uid, ({ datos, error }) => {
      setDatos(datos);
      setError(error);
      setCargando(false);
    });

    return () => unsubscribe();
  }, [uid]);

  if (cargando) {
    return (
      <div className="balance-card">
        <div className="loading-row" style={{ color: "rgba(255,255,255,0.75)" }}>
          <span className="spinner spinner-claro"></span>
          Cargando saldo...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="balance-card">
        <p style={{ color: "#ffc2c8" }}>Error: {error}</p>
      </div>
    );
  }

  const saldoFormateado = datos.saldo.toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
  });

  return (
    <div className="balance-row">
      <div className="balance-card">
        <div className="balance-content">
          <div className="balance-top-row">
            <div className="balance-chip"></div>
            <img src={logoCBank} alt="CBank" className="balance-logo" />
          </div>
          <div>
            <p className="balance-amount monto">{saldoFormateado}</p>
            <p className="balance-footer">Cuenta corriente · CBank</p>
          </div>
        </div>
      </div>

      <div className="balance-welcome">
        <img src={mascotaCBank} alt="Mascota CBank saludando" className="balance-mascota" />
        <div className="balance-burbuja">
          <h2>¡Bienvenido(a), {datos.nombre}! 👋</h2>
          <p>Qué gusto verte por acá. Aquí tienes tu resumen de cuenta.</p>
        </div>
      </div>
    </div>
  );
}

export default Saldo;