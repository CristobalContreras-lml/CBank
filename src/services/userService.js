import { db } from "../firebase/config";
import { doc, onSnapshot } from "firebase/firestore";

// Se suscribe al documento del usuario y llama a callback() cada vez
// que el saldo (o cualquier campo) cambia en Firestore, en tiempo real.
// Retorna la función unsubscribe para poder cancelarla en el cleanup
// del useEffect que la use.
export function observarSaldo(uid, callback) {
  const refUsuario = doc(db, "users", uid);

  const unsubscribe = onSnapshot(
    refUsuario,
    (snapshot) => {
      if (snapshot.exists()) {
        callback({ datos: snapshot.data(), error: null });
      } else {
        callback({ datos: null, error: "No se encontró el usuario." });
      }
    },
    (error) => {
      callback({ datos: null, error: error.message });
    }
  );

  return unsubscribe;
}