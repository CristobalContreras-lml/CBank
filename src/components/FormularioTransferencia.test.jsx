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
});