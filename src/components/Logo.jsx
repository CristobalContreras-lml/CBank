import logoCBank from "../assets/logo_CBank.png";

function Logo({ tamaño = "normal", invertir = false }) {
  const alturas = {
    normal: 44,
    grande: 90,
  };

  const altura = alturas[tamaño] ?? 44;

  return (
    <img
      src={logoCBank}
      alt="CBank — Banco para tu futuro"
      style={{
        height: altura,
        width: "auto",
        display: "block",
        filter: invertir ? "brightness(0) invert(1)" : "none",
      }}
    />
  );
}

export default Logo;