import { createContext, useContext, useReducer, useEffect, useRef } from "react";
import { observarUsuario, cerrarSesion as cerrarSesionFirebase } from "../services/authService";

const SesionContext = createContext(null);

const TIEMPO_INACTIVIDAD_MS = 3 * 60 * 1000; // 3 minutos

const estadoInicial = {
  usuario: null,
  cargando: true,
  motivoCierre: null, // null | "inactividad"
};

function sesionReducer(estado, accion) {
  switch (accion.type) {
    case "SESION_DETECTADA":
      return { usuario: accion.payload, cargando: false, motivoCierre: null };
    case "SESION_CERRADA":
      return { usuario: null, cargando: false, motivoCierre: accion.payload };
    default:
      return estado;
  }
}

export function SesionProvider({ children }) {
  const [estado, dispatch] = useReducer(sesionReducer, estadoInicial);
  const timeoutRef = useRef(null);
  const motivoRef = useRef(null);

  useEffect(() => {
    const unsubscribe = observarUsuario((usuarioFirebase) => {
      if (usuarioFirebase) {
        dispatch({ type: "SESION_DETECTADA", payload: usuarioFirebase });
      } else {
        dispatch({ type: "SESION_CERRADA", payload: motivoRef.current });
        motivoRef.current = null; // se consume una sola vez
      }
    });

    return () => unsubscribe();
  }, []);

  async function handleCerrarSesion() {
    await cerrarSesionFirebase();
  }

  async function cerrarPorInactividad() {
    motivoRef.current = "inactividad";
    await cerrarSesionFirebase();
  }

  // Cierre de sesión automático por inactividad (3 minutos sin actividad).
  useEffect(() => {
    if (!estado.usuario) return;

    function reiniciarTemporizador() {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(cerrarPorInactividad, TIEMPO_INACTIVIDAD_MS);
    }

    const eventosActividad = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    eventosActividad.forEach((evento) =>
      window.addEventListener(evento, reiniciarTemporizador)
    );

    reiniciarTemporizador();

    return () => {
      eventosActividad.forEach((evento) =>
        window.removeEventListener(evento, reiniciarTemporizador)
      );
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [estado.usuario]);

  const valor = {
    usuario: estado.usuario,
    cargando: estado.cargando,
    motivoCierre: estado.motivoCierre,
    cerrarSesion: handleCerrarSesion,
  };

  return (
    <SesionContext.Provider value={valor}>
      {children}
    </SesionContext.Provider>
  );
}

export function useSesion() {
  const contexto = useContext(SesionContext);
  if (!contexto) {
    throw new Error("useSesion debe usarse dentro de un SesionProvider");
  }
  return contexto;
}