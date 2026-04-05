import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import LoginForm from "./LoginForm";

const mockLogin = vi.fn();

vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}));

describe("LoginForm", () => {
  beforeEach(() => {
    mockLogin.mockReset();
  });

  it("debe renderizar el formulario de login", () => {
    render(<LoginForm />);

    expect(screen.getByText("Iniciar sesión")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("admin")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Entrar" })).toBeInTheDocument();
  });

  it("debe llamar a login con usuario y contraseña al enviar el formulario", async () => {
    mockLogin.mockResolvedValueOnce();

    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByPlaceholderText("admin"), "admin");
    await user.type(screen.getByPlaceholderText("••••••••"), "1234");
    await user.click(screen.getByRole("button", { name: "Entrar" }));

    expect(mockLogin).toHaveBeenCalledTimes(1);
    expect(mockLogin).toHaveBeenCalledWith("admin", "1234");
  });

  it("debe mostrar mensaje de error si login falla", async () => {
    mockLogin.mockRejectedValueOnce(new Error("Credenciales incorrectas"));

    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByPlaceholderText("admin"), "admin");
    await user.type(screen.getByPlaceholderText("••••••••"), "malpassword");
    await user.click(screen.getByRole("button", { name: "Entrar" }));

    expect(
      await screen.findByText("Usuario o contraseña incorrectos")
    ).toBeInTheDocument();
  });

  it("debe mostrar estado de carga mientras se valida el login", async () => {
    let resolver;
    mockLogin.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolver = resolve;
        })
    );

    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByPlaceholderText("admin"), "admin");
    await user.type(screen.getByPlaceholderText("••••••••"), "1234");
    await user.click(screen.getByRole("button", { name: "Entrar" }));

    expect(screen.getByRole("button", { name: "Comprobando..." })).toBeInTheDocument();
    expect(screen.getByText("Validando credenciales…")).toBeInTheDocument();

    resolver();
  });
});