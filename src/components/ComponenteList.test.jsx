import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ComponenteList from "./ComponenteList";

const mockGetComponentes = vi.fn();
const mockCreateComponente = vi.fn();
const mockDeleteComponente = vi.fn();
const mockUpdateComponente = vi.fn();

vi.mock("../services/api", () => ({
  getComponentes: (...args) => mockGetComponentes(...args),
  createComponente: (...args) => mockCreateComponente(...args),
  deleteComponente: (...args) => mockDeleteComponente(...args),
  updateComponente: (...args) => mockUpdateComponente(...args),
}));

describe("ComponenteList", () => {
  beforeEach(() => {
    mockGetComponentes.mockReset();
    mockCreateComponente.mockReset();
    mockDeleteComponente.mockReset();
    mockUpdateComponente.mockReset();
  });

  it("debe cargar y mostrar la lista de componentes", async () => {
    mockGetComponentes.mockResolvedValueOnce([
      { id: 1, nombre: "RTX 4060", categoria: "GPU", precio: 299.99, stock: 10 },
      { id: 2, nombre: "Ryzen 7", categoria: "CPU", precio: 249.99, stock: 5 },
    ]);

    render(<ComponenteList username="admin" password="1234" />);

    expect(screen.getByText("Cargando componentes…")).toBeInTheDocument();

    expect(await screen.findByText("RTX 4060")).toBeInTheDocument();
    expect(await screen.findByText("Ryzen 7")).toBeInTheDocument();

    expect(mockGetComponentes).toHaveBeenCalledTimes(1);
    expect(mockGetComponentes).toHaveBeenCalledWith("admin", "1234");
  });

  it("debe mostrar un mensaje de error si falla la carga inicial", async () => {
    mockGetComponentes.mockRejectedValueOnce(new Error("Error cargando componentes"));

    render(<ComponenteList username="admin" password="1234" />);

    expect(
      await screen.findByText("Error cargando componentes")
    ).toBeInTheDocument();
  });

  it("debe crear un componente y mostrar mensaje de éxito", async () => {
    mockGetComponentes.mockResolvedValueOnce([]);
    mockCreateComponente.mockResolvedValueOnce({
      id: 3,
      nombre: "SSD 1TB",
      categoria: "Almacenamiento",
      precio: 89.99,
      stock: 20,
    });

    const user = userEvent.setup();
    render(<ComponenteList username="admin" password="1234" />);

    await screen.findByText("No hay componentes todavía. Crea el primero 👆");

    const inputs = screen.getAllByRole("textbox");

    await user.type(inputs[0], "SSD 1TB");
    await user.type(inputs[1], "Almacenamiento");
    await user.type(inputs[2], "89.99");
    await user.type(inputs[3], "20");

    await user.click(screen.getByRole("button", { name: "Crear" }));

    expect(mockCreateComponente).toHaveBeenCalledTimes(1);
    expect(mockCreateComponente).toHaveBeenCalledWith("admin", "1234", {
      nombre: "SSD 1TB",
      categoria: "Almacenamiento",
      precio: 89.99,
      stock: 20,
    });

    expect(
      await screen.findByText("Componente creado correctamente ✅")
    ).toBeInTheDocument();

    expect(await screen.findByText("SSD 1TB")).toBeInTheDocument();
  });

  it("debe eliminar un componente de la lista", async () => {
    mockGetComponentes.mockResolvedValueOnce([
      { id: 1, nombre: "RTX 4060", categoria: "GPU", precio: 299.99, stock: 10 },
    ]);
    mockDeleteComponente.mockResolvedValueOnce(true);

    const user = userEvent.setup();
    render(<ComponenteList username="admin" password="1234" />);

    expect(await screen.findByText("RTX 4060")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Eliminar" }));

    expect(mockDeleteComponente).toHaveBeenCalledTimes(1);
    expect(mockDeleteComponente).toHaveBeenCalledWith("admin", "1234", 1);

    await waitFor(() => {
      expect(screen.queryByText("RTX 4060")).not.toBeInTheDocument();
    });
  });
});