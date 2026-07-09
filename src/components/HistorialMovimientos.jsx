import { useState, useEffect } from "react";
import { observarHistorial } from "../services/historialService";
import TarjetaDesplegable from "./TarjetaDesplegable";

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

  function claseBadge(mov) {
    if (mov.tipoEspecial === "deposito") return "badge badge-entrada";
    if (mov.tipoEspecial === "retiro") return "badge badge-salida";
    return mov.tipo === "enviado" ? "badge badge-salida" : "badge badge-entrada";
  }

  const icono = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6h16M4 12h16M4 18h10" />
    </svg>
  );

  if (cargando) {
    return (
      <TarjetaDesplegable titulo="Historial de movimientos" icono={icono}>
        <div className="loading-row">
          <span className="spinner"></span>
          Cargando historial...
        </div>
      </TarjetaDesplegable>
    );
  }

  if (error) {
    return (
      <TarjetaDesplegable titulo="Historial de movimientos" icono={icono}>
        <p style={{ color: "var(--crimson)" }}>Error al cargar el historial: {error}</p>
      </TarjetaDesplegable>
    );
  }

  const movimientosFiltrados = movimientos.filter(coincideConFiltro);

  return (
    <TarjetaDesplegable titulo="Historial de movimientos" icono={icono}>
      <div className="form-stack" style={{ marginBottom: 16 }}>
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
      </div>

      {movimientos.length === 0 && <p>Aún no tienes movimientos.</p>}

      {movimientos.length > 0 && movimientosFiltrados.length === 0 && (
        <p>Ningún movimiento coincide con el filtro.</p>
      )}

      <ul className="lista-movimientos">
        {movimientosFiltrados.map((mov) => (
          <li key={mov.id} className="fila-movimiento">
            <span className={claseBadge(mov)}>{describirMovimiento(mov)}</span>
            <span className="monto">
              {mov.tipoEspecial === "retiro" || (mov.tipo === "enviado" && !mov.tipoEspecial) ? "−" : "+"}
              ${mov.monto.toLocaleString("es-CL")}
            </span>
            <span className="fila-fecha">
              {mov.fecha ? mov.fecha.toDate().toLocaleString("es-CL") : "procesando..."}
            </span>
          </li>
        ))}
      </ul>
    </TarjetaDesplegable>
  );
}

export default HistorialMovimientos;