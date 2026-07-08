import { useState, useEffect } from "react";
import { observarHistorial } from "../services/historialService";

function HistorialMovimientos({ uid }) {
  const [movimientos, setMovimientos] = useState([]);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const unsubscribe = observarHistorial(uid, ({ movimientos, error }) => {
      setMovimientos(movimientos);
      setError(error);
      setCargando(false);
    });

    return () => unsubscribe();
  }, [uid]);

  if (cargando) {
    return <p>Cargando historial...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>Error al cargar el historial: {error}</p>;
  }

  if (movimientos.length === 0) {
    return <p>Aún no tienes movimientos.</p>;
  }

  return (
    <div>
      <h3>Historial de movimientos</h3>
      <ul>
        {movimientos.map((mov) => (
          <li key={mov.id}>
            {mov.tipo === "enviado"
              ? `Enviaste a ${mov.receptorNombre}`
              : `Recibiste de ${mov.emisorNombre}`}
            {" — $"}
            {mov.monto.toLocaleString("es-CL")}
            {" — "}
            {mov.fecha ? mov.fecha.toDate().toLocaleString("es-CL") : "procesando..."}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HistorialMovimientos;