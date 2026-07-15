const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function esEmailValido(email) {
  return REGEX_EMAIL.test((email ?? "").trim());
}

export function esMontoValido(monto) {
  if (monto === "" || monto === null || monto === undefined) return false;
  const numero = Number(monto);
  if (Number.isNaN(numero)) return false;
  if (!Number.isInteger(numero)) return false;
  if (numero <= 0) return false;
  return true;
}

export function validarTransferencia({ emailDestino, emailEmisor, monto, saldoDisponible }) {
  const email = (emailDestino ?? "").trim();

  if (!email) {
    return { valido: false, error: "Ingresa el correo del destinatario." };
  }

  if (!esEmailValido(email)) {
    return { valido: false, error: "El correo no tiene un formato válido." };
  }

  if (email === emailEmisor) {
    return { valido: false, error: "No puedes transferirte dinero a ti mismo." };
  }

  if (!esMontoValido(monto)) {
    return { valido: false, error: "El monto debe ser un número entero mayor a 0." };
  }

  if (Number(monto) > saldoDisponible) {
    return { valido: false, error: "No tienes saldo suficiente para esta transferencia." };
  }

  return { valido: true, error: null };
}