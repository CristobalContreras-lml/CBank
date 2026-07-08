import { useState, useEffect } from "react";
import { observarHistorial } from "../services/historialService";

function HistorialMovimientos({ uid }) {
  const [movimientos, setMovimientos] = useState([]);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [textoBusqueda, setTextoBusqueda] = useState("");

  useEffect(() => {
    const unsubscribe = observarHistorial(uid, ({ movimientos, error }) => {
      setMovimientos(movimientos);
      setError(error);
      setCargando(false);
    });

    return () => unsubscribe();
  }, [uid]);

  function describirMovimiento(mov) {
    if (mov.tipoEspecial === "deposito") return "Depósito";
    if (mov.tipoEspecial === "retiro") return "Retiro";
    return mov.tipo === "enviado"
      ? `Enviaste a ${mov.receptorNombre}`
      : `Recibiste de ${mov.emisorNombre}`;
  }

  function handleFiltroTipoChange(event) {
    setFiltroTipo(event.target.value);
  }

  function handleBusquedaChange(event) {
    setTextoBusqueda(event.target.value);
  }

  function coincideConFiltro(mov) {
    const coincideTipo =
      filtroTipo === "todos" ||
      (filtroTipo === "deposito" && mov.tipoEspecial === "deposito") ||
      (filtroTipo === "retiro" && mov.tipoEspecial === "retiro") ||
      (filtroTipo === "enviado" && mov.tipo === "enviado" && !mov.tipoEspecial) ||
      (filtroTipo === "recibido" && mov.tipo === "recibido" && !mov.tipoEspecial);

    if (!coincideTipo) return false;

    if (!textoBusqueda.trim()) return true;

    const texto = textoBusqueda.trim().toLowerCase();
    const descripcion = describirMovimiento(mov).toLowerCase();
    return descripcion.includes(texto);
  }

  if (cargando) {
    return <p>Cargando historial...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>Error al cargar el historial: {error}</p>;
  }

  const movimientosFiltrados = movimientos.filter(coincideConFiltro);

  return (
    <div>
      <h3>Historial de movimientos</h3>

      <select value={filtroTipo} onChange={handleFiltroTipoChange}>
        <option value="todos">Todos</option>
        <option value="enviado">Enviados</option>
        <option value="recibido">Recibidos</option>
        <option value="deposito">Depósitos</option>
        <option value="retiro">Retiros</option>
      </select>

      <input
        type="text"
        placeholder="Buscar por nombre..."
        value={textoBusqueda}
        onChange={handleBusquedaChange}
      />

      {movimientos.length === 0 && <p>Aún no tienes movimientos.</p>}

      {movimientos.length > 0 && movimientosFiltrados.length === 0 && (
        <p>Ningún movimiento coincide con el filtro.</p>
      )}

      <ul>
        {movimientosFiltrados.map((mov) => (
          <li key={mov.id}>
            {describirMovimiento(mov)}
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