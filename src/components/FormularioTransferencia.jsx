import { useState } from "react";
import { buscarUsuarioPorEmail, transferir } from "../services/transferService";

function FormularioTransferencia({ emisorUid, emisorEmail }) {
  const [emailDestino, setEmailDestino] = useState("");
  const [monto, setMonto] = useState("");
  const [error, setError] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");
  const [enviando, setEnviando] = useState(false);

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

    const emailLimpio = emailDestino.trim();
    const montoNumero = Number(monto);

    // --- Validaciones que NO requieren tocar Firestore ---
    if (!emailLimpio) {
      setError("Ingresa el correo del destinatario.");
      return;
    }

    if (!monto || isNaN(montoNumero) || montoNumero <= 0) {
      setError("El monto debe ser un número mayor a 0.");
      return;
    }

    if (emailLimpio === emisorEmail) {
      setError("No puedes transferirte dinero a ti mismo.");
      return;
    }

    // --- A partir de aquí sí necesitamos consultar Firestore ---
    setEnviando(true);
    try {
      const destinatario = await buscarUsuarioPorEmail(emailLimpio);

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

  return (
    <div>
      <h3>Transferir dinero</h3>
      <form onSubmit={handleTransferSubmit}>
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

        {error && <p style={{ color: "red" }}>{error}</p>}
        {mensajeExito && <p style={{ color: "green" }}>{mensajeExito}</p>}

        <button type="submit" disabled={enviando}>
          {enviando ? "Transfiriendo..." : "Transferir"}
        </button>
      </form>
    </div>
  );
}

export default FormularioTransferencia;