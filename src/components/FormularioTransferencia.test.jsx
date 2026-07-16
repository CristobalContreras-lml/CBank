import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FormularioTransferencia from "./FormularioTransferencia";
import { buscarUsuarioPorEmail, transferir } from "../services/transferService";
import { observarSaldo } from "../services/userService";

vi.mock("../services/transferService", () => ({
  buscarUsuarioPorEmail: vi.fn(),
  transferir: vi.fn(),
}));

vi.mock("../services/userService", () => ({
  observarSaldo: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
  observarSaldo.mockImplementation((uid, callback) => {
    callback({ datos: { saldo: 100000, nombre: "Cristobal" }, error: null });
    return vi.fn();
  });
  transferir.mockResolvedValue(undefined);
});

function renderFormulario() {
  render(<FormularioTransferencia emisorUid="uid-cris" emisorEmail="cristobal@cbank.cl" />);
}

describe("FormularioTransferencia", () => {
  it("renderiza los campos y el boton de enviar", () => {
    renderFormulario();

    expect(screen.getByPlaceholderText(/correo del destinatario/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/^monto$/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^transferir$/i })).toBeInTheDocument();
  });

  it("muestra un error y no llama al servicio cuando el monto es invalido", async () => {
    const user = userEvent.setup();
    renderFormulario();

    await user.type(screen.getByPlaceholderText(/correo del destinatario/i), "felipe@cbank.cl");
    await user.type(screen.getByPlaceholderText(/^monto$/i), "-100");
    await user.click(screen.getByRole("button", { name: /^transferir$/i }));

    expect(await screen.findByText(/monto debe ser un número entero mayor a 0/i)).toBeInTheDocument();
    expect(transferir).not.toHaveBeenCalled();
    expect(buscarUsuarioPorEmail).not.toHaveBeenCalled();
  });

  it("llama al servicio de transferencia una vez con los argumentos correctos", async () => {
    const user = userEvent.setup();
    buscarUsuarioPorEmail.mockResolvedValue({ uid: "uid-felipe", nombre: "Felipe" });
    renderFormulario();

    await user.type(screen.getByPlaceholderText(/correo del destinatario/i), "felipe@cbank.cl");
    await user.type(screen.getByPlaceholderText(/^monto$/i), "10000");
    await user.click(screen.getByRole("button", { name: /^transferir$/i }));

    await waitFor(() => {
      expect(transferir).toHaveBeenCalledTimes(1);
    });
    expect(transferir).toHaveBeenCalledWith("uid-cris", "uid-felipe", 10000);
  });

  it("deshabilita el boton mientras la transferencia esta en curso", async () => {
    const user = userEvent.setup();
    let resolverBusqueda;
    buscarUsuarioPorEmail.mockReturnValue(
      new Promise((resolve) => {
        resolverBusqueda = resolve;
      })
    );
    renderFormulario();

    await user.type(screen.getByPlaceholderText(/correo del destinatario/i), "felipe@cbank.cl");
    await user.type(screen.getByPlaceholderText(/^monto$/i), "10000");
    await user.click(screen.getByRole("button", { name: /^transferir$/i }));

    expect(screen.getByRole("button", { name: /transfiriendo/i })).toBeDisabled();

    resolverBusqueda({ uid: "uid-felipe", nombre: "Felipe" });
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /^transferir$/i })).not.toBeDisabled();
    });
  });

  it("muestra el mensaje de exito y limpia el formulario tras una transferencia exitosa", async () => {
    const user = userEvent.setup();
    buscarUsuarioPorEmail.mockResolvedValue({ uid: "uid-felipe", nombre: "Felipe" });
    renderFormulario();

    const inputEmail = screen.getByPlaceholderText(/correo del destinatario/i);
    const inputMonto = screen.getByPlaceholderText(/^monto$/i);

    await user.type(inputEmail, "felipe@cbank.cl");
    await user.type(inputMonto, "10000");
    await user.click(screen.getByRole("button", { name: /^transferir$/i }));

    expect(await screen.findByText(/transferiste \$10\.000 a felipe/i)).toBeInTheDocument();
    expect(inputEmail).toHaveValue("");
    expect(inputMonto).toHaveValue(null);
  });

  it("muestra un error cuando el monto supera el limite de operacion", async () => {
    const user = userEvent.setup();
    observarSaldo.mockImplementation((uid, callback) => {
      callback({ datos: { saldo: 10000000, nombre: "Cristobal" }, error: null });
      return vi.fn();
    });
    renderFormulario();

    await user.type(screen.getByPlaceholderText(/correo del destinatario/i), "felipe@cbank.cl");
    await user.type(screen.getByPlaceholderText(/^monto$/i), "6000000");
    await user.click(screen.getByRole("button", { name: /^transferir$/i }));

    expect(await screen.findByText(/requieren autorización de un ejecutivo/i)).toBeInTheDocument();
    expect(transferir).not.toHaveBeenCalled();
  });

  it("muestra el error del backend cuando la transaccion falla por saldo insuficiente", async () => {
    const user = userEvent.setup();
    buscarUsuarioPorEmail.mockResolvedValue({ uid: "uid-felipe", nombre: "Felipe" });
    transferir.mockRejectedValue(new Error("Saldo insuficiente."));
    renderFormulario();

    await user.type(screen.getByPlaceholderText(/correo del destinatario/i), "felipe@cbank.cl");
    await user.type(screen.getByPlaceholderText(/^monto$/i), "10000");
    await user.click(screen.getByRole("button", { name: /^transferir$/i }));

    expect(await screen.findByText(/no tienes saldo suficiente para esta transferencia/i)).toBeInTheDocument();
  });
});