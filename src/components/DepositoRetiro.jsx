import { useState } from "react";
import { depositar, retirar } from "../services/depositoService";

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

  return (
    <div>
      <h3>Depósito / Retiro</h3>
      <input
        type="number"
        placeholder="Monto"
        value={monto}
        onChange={handleMontoChange}
      />

      {error && <p style={{ color: "red" }}>{error}</p>}
      {mensajeExito && <p style={{ color: "green" }}>{mensajeExito}</p>}

      <button type="button" onClick={handleDepositarClick} disabled={enviando}>
        {enviando ? "Procesando..." : "Depositar"}
      </button>
      <button type="button" onClick={handleRetirarClick} disabled={enviando}>
        {enviando ? "Procesando..." : "Retirar"}
      </button>
    </div>
  );
}

export default DepositoRetiro;