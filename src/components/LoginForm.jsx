import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function LoginForm() {
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(username, password);
    } catch (err) {
      setError("Usuario o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-white/5 p-6 shadow-lg ring-1 ring-white/10">
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Iniciar sesión
        </h2>
        <p className="mt-1 text-sm text-white/70">
          Accede para gestionar los componentes del catálogo.
        </p>

        <form onSubmit={onSubmit} className="mt-6 grid gap-4">
          <div className="space-y-1">
            <label className="text-sm text-white/80">Usuario</label>
            <input
              className="w-full rounded-lg bg-black/20 px-3 py-2 text-white
                         ring-1 ring-white/10 outline-none
                         focus:ring-2 focus:ring-white/25"
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-white/80">Contraseña</label>
            <input
              type="password"
              className="w-full rounded-lg bg-black/20 px-3 py-2 text-white
                         ring-1 ring-white/10 outline-none
                         focus:ring-2 focus:ring-white/25"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-1 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900
                       transition hover:opacity-90 active:scale-[0.98]
                       disabled:opacity-60"
          >
            {loading ? "Comprobando..." : "Entrar"}
          </button>
        </form>

        {/* Animación visible (cumple requisito) */}
        {loading && (
          <p className="mt-3 text-sm text-white/70 animate-pulse">
            Validando credenciales…
          </p>
        )}

        {/* Error bonito */}
        {error && (
          <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <p className="mt-6 text-xs text-white/50">
          Consejo: en móvil el formulario ocupa todo el ancho y se adapta automáticamente.
        </p>
      </div>
    </div>
  );
}