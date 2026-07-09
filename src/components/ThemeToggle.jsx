import { useTheme } from "../context/ThemeContext";

function ThemeToggle() {
  const { tema, alternarTema } = useTheme();
  const esOscuro = tema === "dark";

  return (
    <button
      type="button"
      className={`theme-toggle ${esOscuro ? "theme-toggle-apagado" : "theme-toggle-encendido"}`}
      onClick={alternarTema}
      aria-label={esOscuro ? "Cambiar a modo día" : "Cambiar a modo noche"}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    </button>
  );
}

export default ThemeToggle;