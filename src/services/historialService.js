import { db } from "../firebase/config";
import { collection, query, where, onSnapshot } from "firebase/firestore";

// Se suscribe a los movimientos donde el usuario participa, ya sea como
// emisor o como receptor (dos listeners separados, porque Firestore no
// permite filtrar por "campo A == x O campo B == x" en una sola query
// simple). Combina y ordena por fecha cada vez que cualquiera cambia.
export function observarHistorial(uid, callback) {
  let enviados = [];
  let recibidos = [];

  function combinarYEnviar() {
    const todos = [...enviados, ...recibidos].sort((a, b) => {
      const fechaA = a.fecha?.toMillis?.() ?? 0;
      const fechaB = b.fecha?.toMillis?.() ?? 0;
      return fechaB - fechaA;
    });
    callback({ movimientos: todos, error: null });
  }

  const qEnviados = query(collection(db, "movimientos"), where("emisorUid", "==", uid));
  const qRecibidos = query(collection(db, "movimientos"), where("receptorUid", "==", uid));

  const unsubEnviados = onSnapshot(
    qEnviados,
    (snapshot) => {
      enviados = snapshot.docs.map((doc) => ({ id: doc.id, tipo: "enviado", ...doc.data() }));
      combinarYEnviar();
    },
    (error) => callback({ movimientos: [], error: error.message })
  );

  const unsubRecibidos = onSnapshot(
    qRecibidos,
    (snapshot) => {
      recibidos = snapshot.docs.map((doc) => ({ id: doc.id, tipo: "recibido", ...doc.data() }));
      combinarYEnviar();
    },
    (error) => callback({ movimientos: [], error: error.message })
  );

  // Cancela AMBAS suscripciones. Si solo canceláramos una,
  // la otra seguiría escuchando activa: fuga de memoria.
  return () => {
    unsubEnviados();
    unsubRecibidos();
  };
}