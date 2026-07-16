import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TarjetaDesplegable from "./TarjetaDesplegable";

describe("TarjetaDesplegable", () => {
  it("muestra el contenido por defecto cuando abiertoPorDefecto es true", () => {
    render(
      <TarjetaDesplegable titulo="Mi tarjeta" icono={<span>icono</span>}>
        <p>contenido interno</p>
      </TarjetaDesplegable>
    );

    expect(screen.getByText(/contenido interno/i)).toBeInTheDocument();
  });

  it("oculta y vuelve a mostrar el contenido al hacer clic en el encabezado", async () => {
    const user = userEvent.setup();
    render(
      <TarjetaDesplegable titulo="Mi tarjeta" icono={<span>icono</span>}>
        <p>contenido interno</p>
      </TarjetaDesplegable>
    );

    const boton = screen.getByRole("button", { name: /mi tarjeta/i });

    await user.click(boton);
    expect(screen.queryByText(/contenido interno/i)).not.toBeInTheDocument();

    await user.click(boton);
    expect(screen.getByText(/contenido interno/i)).toBeInTheDocument();
  });
});