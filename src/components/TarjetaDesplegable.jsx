import { useState } from "react";

function TarjetaDesplegable({ titulo, icono, children, abiertoPorDefecto = true }) {
  const [abierto, setAbierto] = useState(abiertoPorDefecto);

  function handleToggle() {
    setAbierto((anterior) => !anterior);
  }

  return (
    <div className="card">
      <button type="button" className="card-header-toggle" onClick={handleToggle}>
        <div className="card-icon">{icono}</div>
        <h3>{titulo}</h3>
        <svg
          className={`chevron ${abierto ? "chevron-abierto" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {abierto && <div className="card-body">{children}</div>}
    </div>
  );
}

export default TarjetaDesplegable;