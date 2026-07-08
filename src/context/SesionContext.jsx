import { createContext, useContext, useReducer, useEffect } from "react";
import { observarUsuario, cerrarSesion as cerrarSesionFirebase } from "../services/authService";

const SesionContext = createContext(null);

const estadoInicial = {
  usuario: null,
  cargando: true,
};

function sesionReducer(estado, accion) {
  switch (accion.type) {
    case "SESION_DETECTADA":
      return { usuario: accion.payload, cargando: false };
    case "SESION_CERRADA":
      return { usuario: null, cargando: false };
    default:
      return estado;
  }
}

export function SesionProvider({ children }) {
  const [estado, dispatch] = useReducer(sesionReducer, estadoInicial);

  useEffect(() => {
    const unsubscribe = observarUsuario((usuarioFirebase) => {
      if (usuarioFirebase) {
        dispatch({ type: "SESION_DETECTADA", payload: usuarioFirebase });
      } else {
        dispatch({ type: "SESION_CERRADA" });
      }
    });

    return () => unsubscribe();
  }, []);

  async function handleCerrarSesion() {
    await cerrarSesionFirebase();
    // No hace falta dispatch aquí: onAuthStateChanged lo detecta solo
    // y dispara SESION_CERRADA a través del observer de arriba.
  }

  const valor = {
    usuario: estado.usuario,
    cargando: estado.cargando,
    cerrarSesion: handleCerrarSesion,
  };

  return (
    <SesionContext.Provider value={valor}>
      {children}
    </SesionContext.Provider>
  );
}

// Hook personalizado: evita que cada componente tenga que importar
// useContext + SesionContext por separado: solo usan useSesion().
export function useSesion() {
  const contexto = useContext(SesionContext);
  if (!contexto) {
    throw new Error("useSesion debe usarse dentro de un SesionProvider");
  }
  return contexto;
}