import { auth, db } from "../firebase/config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const SALDO_INICIAL = 100000;

// Registra al usuario en Firebase Auth y crea su documento en Firestore
// usando el mismo uid como ID del documento (así después es directo
// encontrar "mi propio documento" sin tener que buscar por email).
export async function registrarUsuario(nombre, email, password) {
  const credenciales = await createUserWithEmailAndPassword(auth, email, password);
  const uid = credenciales.user.uid;

  await setDoc(doc(db, "users", uid), {
    nombre,
    email,
    saldo: SALDO_INICIAL,
  });

  return credenciales.user;
}

export async function iniciarSesion(email, password) {
  const credenciales = await signInWithEmailAndPassword(auth, email, password);
  return credenciales.user;
}

export async function cerrarSesion() {
  await signOut(auth);
}

// Envuelve onAuthStateChanged. Retorna la función "unsubscribe" para
// que quien la use (App.jsx) pueda cancelarla en el cleanup de su useEffect.
export function observarUsuario(callback) {
  return onAuthStateChanged(auth, callback);
}