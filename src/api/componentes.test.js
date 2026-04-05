import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  getComponentes,
  createComponente,
  deleteComponente,
} from "./componentes";

describe("API de componentes", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("getComponentes debe devolver la lista de componentes cuando la respuesta es correcta", async () => {
    const mockData = [
      { id: 1, nombre: "RTX 4060", categoria: "GPU", precio: 299.99, stock: 10 },
      { id: 2, nombre: "Ryzen 7", categoria: "CPU", precio: 249.99, stock: 5 },
    ];

    fetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockData),
    });

    const resultado = await getComponentes("admin", "1234");

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      "https://pdauf-tema3.onrender.com/api/componentes",
      {
        headers: {
          Authorization: "Basic " + btoa("admin:1234"),
        },
      }
    );
    expect(resultado).toEqual(mockData);
  });

  it("getComponentes debe lanzar error cuando la respuesta no es correcta", async () => {
    fetch.mockResolvedValue({
      ok: false,
    });

    await expect(getComponentes("admin", "1234")).rejects.toThrow(
      "Error cargando componentes"
    );
  });

  it("createComponente debe enviar un POST y devolver el componente creado", async () => {
    const payload = {
      nombre: "SSD 1TB",
      categoria: "Almacenamiento",
      precio: 89.99,
      stock: 20,
    };

    const mockResponse = { id: 3, ...payload };

    fetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockResponse),
    });

    const resultado = await createComponente("admin", "1234", payload);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      "https://pdauf-tema3.onrender.com/api/componentes",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + btoa("admin:1234"),
        },
        body: JSON.stringify(payload),
      }
    );
    expect(resultado).toEqual(mockResponse);
  });

  it("createComponente debe lanzar error cuando falla la creación", async () => {
    const payload = {
      nombre: "SSD 1TB",
      categoria: "Almacenamiento",
      precio: 89.99,
      stock: 20,
    };

    fetch.mockResolvedValue({
      ok: false,
    });

    await expect(createComponente("admin", "1234", payload)).rejects.toThrow(
      "Error creando componente"
    );
  });

  it("deleteComponente debe devolver true cuando elimina correctamente", async () => {
    fetch.mockResolvedValue({
      ok: true,
    });

    const resultado = await deleteComponente("admin", "1234", 5);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      "https://pdauf-tema3.onrender.com/api/componentes/5",
      {
        method: "DELETE",
        headers: {
          Authorization: "Basic " + btoa("admin:1234"),
        },
      }
    );
    expect(resultado).toBe(true);
  });

  it("deleteComponente debe lanzar error cuando falla el borrado", async () => {
    fetch.mockResolvedValue({
      ok: false,
    });

    await expect(deleteComponente("admin", "1234", 5)).rejects.toThrow(
      "Error eliminando componente"
    );
  });
});