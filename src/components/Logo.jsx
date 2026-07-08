import logoCBank from "../assets/logo_CBank.png";

function Logo({ tamaño = "normal" }) {
  const altura = tamaño === "grande" ? 90 : 42;

  return (
    <img
      src={logoCBank}
      alt="CBank — Banco para tu futuro"
      style={{ height: altura, width: "auto", display: "block" }}
    />
  );
}

export default Logo;