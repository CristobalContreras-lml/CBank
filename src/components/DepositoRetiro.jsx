import { useState } from "react";
import { depositar, retirar } from "../services/depositoService";
import TarjetaDesplegable from "./TarjetaDesplegable";

const LIMITE_OPERACION = 5000000;

function DepositoRetiro({ uid }) {
  const [monto, setMonto] = useState("");
  const [error, setError] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");
  const [enviando, setEnviando] = useState(false);

  function handleMontoChange(event) {
    setMonto(event.target.value);
  }

  function validarMonto() {
    const montoNumero = Number(monto);

    if (!monto || isNaN(montoNumero) || montoNumero <= 0) {
      setError("El monto debe ser un número mayor a 0.");
      return null;
    }

    if (montoNumero > LIMITE_OPERACION) {
      setError(
        `Los montos sobre $${LIMITE_OPERACION.toLocaleString("es-CL")} requieren autorización de un ejecutivo. Contacta a soporte para continuar.`
      );
      return null;
    }

    return montoNumero;
  }

  async function handleDepositarClick() {
    setError("");
    setMensajeExito("");
    const montoNumero = validarMonto();
    if (montoNumero === null) return;

    setEnviando(true);
    try {
      await depositar(uid, montoNumero);
      setMensajeExito(`Depositaste $${montoNumero.toLocaleString("es-CL")}.`);
      setMonto("");
    } catch (err) {
      setError("Ocurrió un error al procesar el depósito.");
    } finally {
      setEnviando(false);
    }
  }

  async function handleRetirarClick() {
    setError("");
    setMensajeExito("");
    const montoNumero = validarMonto();
    if (montoNumero === null) return;

    setEnviando(true);
    try {
      await retirar(uid, montoNumero);
      setMensajeExito(`Retiraste $${montoNumero.toLocaleString("es-CL")}.`);
      setMonto("");
    } catch (err) {
      setError(
        err.message === "Saldo insuficiente."
          ? "No tienes saldo suficiente para este retiro."
          : "Ocurrió un error al procesar el retiro."
      );
    } finally {
      setEnviando(false);
    }
  }

const icono = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 10l5-5 5 5" />
      <path d="M7 14l5 5 5-5" />
    </svg>
  );

  return (
    <TarjetaDesplegable titulo="Depósito / Retiro" icono={icono}>
      <div className="form-stack">
        <input
          type="number"
          placeholder="Monto"
          value={monto}
          onChange={handleMontoChange}
        />

        {error && <div className="alert alert-error">{error}</div>}
        {mensajeExito && <div className="alert alert-success">{mensajeExito}</div>}

        <div className="btn-row">
          <button type="button" className="btn-deposito" onClick={handleDepositarClick} disabled={enviando}>
            {enviando ? "Procesando..." : "Depositar"}
          </button>
          <button type="button" className="btn-retiro" onClick={handleRetirarClick} disabled={enviando}>
            {enviando ? "Procesando..." : "Retirar"}
          </button>
        </div>
      </div>
    </TarjetaDesplegable>
  );
}

export default DepositoRetiro;