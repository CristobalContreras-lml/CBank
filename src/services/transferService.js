import { db } from "../firebase/config";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";

// Busca un usuario por su email. Se usa para validar que el destinatario
// de una transferencia realmente existe antes de intentar transferirle.
export async function buscarUsuarioPorEmail(email) {
  const q = query(collection(db, "users"), where("email", "==", email));
  const resultado = await getDocs(q);

  if (resultado.empty) {
    return null;
  }

  const docEncontrado = resultado.docs[0];
  return { uid: docEncontrado.id, ...docEncontrado.data() };
}

// Ejecuta la transferencia completa como una sola operación atómica:
// descuenta al emisor, abona al receptor, y registra el movimiento.
// Si cualquier paso falla, Firestore revierte todo automáticamente.
export async function transferir(emisorUid, receptorUid, monto) {
  await runTransaction(db, async (transaction) => {
    const refEmisor = doc(db, "users", emisorUid);
    const refReceptor = doc(db, "users", receptorUid);

    const snapEmisor = await transaction.get(refEmisor);
    const snapReceptor = await transaction.get(refReceptor);

    if (!snapEmisor.exists() || !snapReceptor.exists()) {
      throw new Error("Alguno de los usuarios no existe.");
    }

    const saldoEmisor = snapEmisor.data().saldo;

    if (saldoEmisor < monto) {
      throw new Error("Saldo insuficiente.");
    }

    const saldoReceptor = snapReceptor.data().saldo;

    transaction.update(refEmisor, { saldo: saldoEmisor - monto });
    transaction.update(refReceptor, { saldo: saldoReceptor + monto });

    const refMovimiento = doc(collection(db, "movimientos"));
    transaction.set(refMovimiento, {
      emisorUid,
      receptorUid,
      monto,
      fecha: serverTimestamp(),
    });
  });
}