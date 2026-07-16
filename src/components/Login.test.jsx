import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "./Login";
import { iniciarSesion } from "../services/authService";
import { useSesion } from "../context/SesionContext";

vi.mock("../services/authService", () => ({
  iniciarSesion: vi.fn(),
}));

vi.mock("../context/SesionContext", () => ({
  useSesion: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
  useSesion.mockReturnValue({ motivoCierre: null });
});

function renderLogin() {
  render(<Login onCambiarARegistro={vi.fn()} />);
}

describe("Login", () => {
  it("no llama al servicio de autenticacion si los campos estan vacios", async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.click(screen.getByRole("button", { name: /^ingresar$/i }));

    expect(iniciarSesion).not.toHaveBeenCalled();
    expect(await screen.findByText(/ingresa tu correo y contraseña/i)).toBeInTheDocument();
  });

  it("muestra un mensaje de error cuando las credenciales son invalidas", async () => {
    const user = userEvent.setup();
    iniciarSesion.mockRejectedValue({ code: "auth/invalid-credential" });
    renderLogin();

    await user.type(screen.getByPlaceholderText(/correo electrónico/i), "cris@inacap.com");
    await user.type(screen.getByPlaceholderText(/^contraseña$/i), "clave-incorrecta");
    await user.click(screen.getByRole("button", { name: /^ingresar$/i }));

    expect(await screen.findByText(/correo o contraseña incorrectos/i)).toBeInTheDocument();
    expect(iniciarSesion).toHaveBeenCalledWith("cris@inacap.com", "clave-incorrecta");
  });

  it("llama al servicio con credenciales validas sin mostrar error", async () => {
    const user = userEvent.setup();
    iniciarSesion.mockResolvedValue({ uid: "uid-cris", email: "cris@inacap.com" });
    renderLogin();

    await user.type(screen.getByPlaceholderText(/correo electrónico/i), "cris@inacap.com");
    await user.type(screen.getByPlaceholderText(/^contraseña$/i), "Demo1234");
    await user.click(screen.getByRole("button", { name: /^ingresar$/i }));

    expect(iniciarSesion).toHaveBeenCalledTimes(1);
    expect(screen.queryByText(/correo o contraseña incorrectos/i)).not.toBeInTheDocument();
  });
});