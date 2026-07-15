import { esEmailValido, esMontoValido, validarTransferencia } from "./validaciones";

describe("esEmailValido", () => {
  it("acepta un correo con formato válido", () => {
    expect(esEmailValido("cris@inacap.com")).toBe(true);
  });

  it("rechaza un correo sin arroba", () => {
    expect(esEmailValido("crisinacap.com")).toBe(false);
  });

  it("rechaza un correo sin dominio", () => {
    expect(esEmailValido("cris@inacap")).toBe(false);
  });

  it("rechaza un string vacío", () => {
    expect(esEmailValido("")).toBe(false);
  });
});

describe("esMontoValido", () => {
  it.each([
    ["-100", false],
    ["0", false],
    ["abc", false],
    ["10.5", false],
    ["", false],
    ["1000", true],
    ["1", true],
  ])("con monto '%s' retorna %s", (monto, esperado) => {
    expect(esMontoValido(monto)).toBe(esperado);
  });
});

describe("validarTransferencia", () => {
  const datosBase = {
    emailDestino: "felipe@cbank.cl",
    emailEmisor: "cristobal@cbank.cl",
    monto: "10000",
    saldoDisponible: 50000,
  };

  it("rechaza cuando el destinatario está vacío", () => {
    // Arrange
    const datos = { ...datosBase, emailDestino: "" };
    // Act
    const resultado = validarTransferencia(datos);
    // Assert
    expect(resultado.valido).toBe(false);
    expect(resultado.error).toMatch(/destinatario/i);
  });

  it("rechaza cuando el correo tiene formato inválido", () => {
    const resultado = validarTransferencia({ ...datosBase, emailDestino: "no-es-email" });
    expect(resultado.valido).toBe(false);
    expect(resultado.error).toMatch(/formato/i);
  });

  it("rechaza la transferencia a uno mismo", () => {
    const resultado = validarTransferencia({ ...datosBase, emailDestino: datosBase.emailEmisor });
    expect(resultado.valido).toBe(false);
    expect(resultado.error).toMatch(/a ti mismo/i);
  });

  it("rechaza un monto negativo", () => {
    const resultado = validarTransferencia({ ...datosBase, monto: "-500" });
    expect(resultado.valido).toBe(false);
  });

  it("rechaza un monto con decimales", () => {
    const resultado = validarTransferencia({ ...datosBase, monto: "1000.50" });
    expect(resultado.valido).toBe(false);
  });

  it("rechaza cuando el monto supera el saldo disponible", () => {
    const resultado = validarTransferencia({ ...datosBase, monto: "100000", saldoDisponible: 50000 });
    expect(resultado.valido).toBe(false);
    expect(resultado.error).toMatch(/saldo/i);
  });

  it("acepta una transferencia válida con saldo suficiente", () => {
    const resultado = validarTransferencia(datosBase);
    expect(resultado.valido).toBe(true);
    expect(resultado.error).toBeNull();
  });
});