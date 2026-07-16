import { render } from "@testing-library/react";
import Saldo from "./Saldo";
import { observarSaldo } from "../services/userService";

vi.mock("../services/userService", () => ({
  observarSaldo: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("Saldo", () => {
  it("cancela la suscripcion (unsubscribe) al desmontar el componente", () => {
    const unsubscribeMock = vi.fn();

    observarSaldo.mockImplementation((uid, callback) => {
      callback({ datos: { nombre: "Cristobal", saldo: 100000 }, error: null });
      return unsubscribeMock;
    });

    const { unmount } = render(<Saldo uid="uid-cris" />);

    expect(unsubscribeMock).not.toHaveBeenCalled();

    unmount();

    expect(unsubscribeMock).toHaveBeenCalledTimes(1);
  });

  it("se suscribe de nuevo si el uid cambia", () => {
    const primerUnsubscribe = vi.fn();
    const segundoUnsubscribe = vi.fn();
    let llamadas = 0;

    observarSaldo.mockImplementation((uid, callback) => {
      llamadas += 1;
      callback({ datos: { nombre: "Usuario", saldo: 50000 }, error: null });
      return llamadas === 1 ? primerUnsubscribe : segundoUnsubscribe;
    });

    const { rerender } = render(<Saldo uid="uid-cris" />);
    expect(observarSaldo).toHaveBeenCalledTimes(1);

    rerender(<Saldo uid="uid-felipe" />);

    expect(primerUnsubscribe).toHaveBeenCalledTimes(1);
    expect(observarSaldo).toHaveBeenCalledTimes(2);
  });
});