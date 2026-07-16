import { render, screen } from "@testing-library/react";
import HistorialMovimientos from "./HistorialMovimientos";
import { observarHistorial } from "../services/historialService";

vi.mock("../services/historialService", () => ({
  observarHistorial: vi.fn(),
}));

const MOVIMIENTO_ANTIGUO = {
  id: "mov-1",
  tipo: "enviado",
  receptorNombre: "Felipe",
  monto: 5000,
  fecha: { toDate: () => new Date("2026-07-01T10:00:00") },
};

const MOVIMIENTO_RECIENTE = {
  id: "mov-2",
  tipo: "recibido",
  emisorNombre: "Felipe",
  monto: 12000,
  fecha: { toDate: () => new Date("2026-07-08T10:00:00") },
};

function mockearHistorial(movimientos) {
  observarHistorial.mockImplementation((uid, callback) => {
    callback({ movimientos, error: null });
    return vi.fn();
  });
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("HistorialMovimientos", () => {
  it("muestra un estado vacio cuando no hay movimientos", () => {
    mockearHistorial([]);
    render(<HistorialMovimientos uid="uid-cris" />);

    expect(screen.getByText(/aún no tienes movimientos/i)).toBeInTheDocument();
  });

  it("distingue movimientos enviados de recibidos", () => {
    mockearHistorial([MOVIMIENTO_ANTIGUO, MOVIMIENTO_RECIENTE]);
    render(<HistorialMovimientos uid="uid-cris" />);

    expect(screen.getByText(/enviaste a felipe/i)).toBeInTheDocument();
    expect(screen.getByText(/recibiste de felipe/i)).toBeInTheDocument();
  });

  it("renderiza los movimientos ordenados del mas reciente al mas antiguo", () => {
    mockearHistorial([MOVIMIENTO_RECIENTE, MOVIMIENTO_ANTIGUO]);
    render(<HistorialMovimientos uid="uid-cris" />);

    const filas = screen.getAllByRole("listitem");

    expect(filas[0]).toHaveTextContent(/recibiste de felipe/i);
    expect(filas[1]).toHaveTextContent(/enviaste a felipe/i);
  });
});