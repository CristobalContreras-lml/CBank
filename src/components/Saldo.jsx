import { useState, useEffect } from "react";
import { observarSaldo } from "../services/userService";

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
    return <p>Cargando saldo...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>Error: {error}</p>;
  }

  const saldoFormateado = datos.saldo.toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
  });

  return (
    <div>
      <h2>Hola, {datos.nombre}</h2>
      <p>Saldo actual: {saldoFormateado}</p>
    </div>
  );
}

export default Saldo;