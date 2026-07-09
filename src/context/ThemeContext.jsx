import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext(null);

const CLAVE_STORAGE = "cbank-theme";

function obtenerTemaInicial() {
  const guardado = localStorage.getItem(CLAVE_STORAGE);
  if (guardado === "dark" || guardado === "light") {
    return guardado;
  }
  // Sin preferencia guardada: respeta el modo del sistema operativo
  const prefiereOscuro = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefiereOscuro ? "dark" : "light";
}

export function ThemeProvider({ children }) {
  const [tema, setTema] = useState(obtenerTemaInicial);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", tema);
    localStorage.setItem(CLAVE_STORAGE, tema);
  }, [tema]);

  function alternarTema() {
    setTema((anterior) => (anterior === "light" ? "dark" : "light"));
  }

  const valor = { tema, alternarTema };

  return <ThemeContext.Provider value={valor}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const contexto = useContext(ThemeContext);
  if (!contexto) {
    throw new Error("useTheme debe usarse dentro de un ThemeProvider");
  }
  return contexto;
}