import { useState, useEffect } from "react";
import { buscarUsuarioPorEmail, transferir } from "../services/transferService";
import { observarSaldo } from "../services/userService";
import { validarTransferencia } from "../utils/validaciones";
import TarjetaDesplegable from "./TarjetaDesplegable";

const LIMITE_OPERACION = 5000000;

function FormularioTransferencia({ emisorUid, emisorEmail }) {
  const [emailDestino, setEmailDestino] = useState("");
  const [monto, setMonto] = useState("");
  const [error, setError] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [saldoActual, setSaldoActual] = useState(null);

  useEffect(() => {
    const unsubscribe = observarSaldo(emisorUid, ({ datos }) => {
      if (datos) setSaldoActual(datos.saldo);
    });
    return () => unsubscribe();
  }, [emisorUid]);

  function handleEmailDestinoChange(event) {
    setEmailDestino(event.target.value);
  }

  function handleMontoChange(event) {
    setMonto(event.target.value);
  }

  async function handleTransferSubmit(event) {
    event.preventDefault();
    setError("");
    setMensajeExito("");

    const resultado = validarTransferencia({
      emailDestino,
      emailEmisor: emisorEmail,
      monto,
      saldoDisponible: saldoActual ?? Infinity,
    });

    if (!resultado.valido) {
      setError(resultado.error);
      return;
    }

    const montoNumero = Number(monto);

    if (montoNumero > LIMITE_OPERACION) {
      setError(
        `Las transferencias sobre $${LIMITE_OPERACION.toLocaleString("es-CL")} requieren autorización de un ejecutivo. Contacta a soporte para continuar.`
      );
      return;
    }

    setEnviando(true);
    try {
      const destinatario = await buscarUsuarioPorEmail(emailDestino.trim());

      if (!destinatario) {
        setError("No existe ningún usuario registrado con ese correo.");
        setEnviando(false);
        return;
      }

      await transferir(emisorUid, destinatario.uid, montoNumero);

      setMensajeExito(`Transferiste $${montoNumero.toLocaleString("es-CL")} a ${destinatario.nombre}.`);
      setEmailDestino("");
      setMonto("");
    } catch (err) {
      setError(traducirError(err.message));
    } finally {
      setEnviando(false);
    }
  }

  function traducirError(mensaje) {
    if (mensaje === "Saldo insuficiente.") {
      return "No tienes saldo suficiente para esta transferencia.";
    }
    if (mensaje === "Alguno de los usuarios no existe.") {
      return "Ocurrió un problema al validar las cuentas involucradas.";
    }
    return "Ocurrió un error al procesar la transferencia. Intenta nuevamente.";
  }

  const icono = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3l4 4-4 4" />
      <path d="M3 7h18" />
      <path d="M7 21l-4-4 4-4" />
      <path d="M21 17H3" />
    </svg>
  );

  return (
    <TarjetaDesplegable titulo="Transferir dinero" icono={icono}>
      <form className="form-stack" onSubmit={handleTransferSubmit}>
        <input
          type="email"
          placeholder="Correo del destinatario"
          value={emailDestino}
          onChange={handleEmailDestinoChange}
        />
        <input
          type="number"
          placeholder="Monto"
          value={monto}
          onChange={handleMontoChange}
        />

        {error && <div className="alert alert-error">{error}</div>}
        {mensajeExito && <div className="alert alert-success">{mensajeExito}</div>}

        <button type="submit" className="btn-primary" disabled={enviando}>
          {enviando ? "Transfiriendo..." : "Transferir"}
        </button>
      </form>
    </TarjetaDesplegable>
  );
}

export default FormularioTransferencia;