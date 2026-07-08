import { db } from "../firebase/config";
import { doc, runTransaction, serverTimestamp, collection } from "firebase/firestore";

export async function depositar(uid, monto) {
  await runTransaction(db, async (transaction) => {
    const refUsuario = doc(db, "users", uid);
    const snap = await transaction.get(refUsuario);

    if (!snap.exists()) {
      throw new Error("Usuario no encontrado.");
    }

    const saldoActual = snap.data().saldo;
    transaction.update(refUsuario, { saldo: saldoActual + monto });

    const refMovimiento = doc(collection(db, "movimientos"));
    transaction.set(refMovimiento, {
      emisorUid: uid,
      receptorUid: uid,
      tipoEspecial: "deposito",
      monto,
      fecha: serverTimestamp(),
    });
  });
}

export async function retirar(uid, monto) {
  await runTransaction(db, async (transaction) => {
    const refUsuario = doc(db, "users", uid);
    const snap = await transaction.get(refUsuario);

    if (!snap.exists()) {
      throw new Error("Usuario no encontrado.");
    }

    const saldoActual = snap.data().saldo;

    if (saldoActual < monto) {
      throw new Error("Saldo insuficiente.");
    }

    transaction.update(refUsuario, { saldo: saldoActual - monto });

    const refMovimiento = doc(collection(db, "movimientos"));
    transaction.set(refMovimiento, {
      emisorUid: uid,
      receptorUid: uid,
      tipoEspecial: "retiro",
      monto,
      fecha: serverTimestamp(),
    });
  });
}