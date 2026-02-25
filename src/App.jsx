import { useAuth } from "./context/AuthContext";
import LoginForm from "./components/LoginForm";
import ComponenteList from "./components/ComponenteList";

export default function App() {
  const { auth, logout } = useAuth();

  if (!auth) return <LoginForm />;

  return (
    <div className="min-h-screen">
      <header className="border-b border-white/10 bg-black/20 backdrop-blur">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <h1 className="text-5xl font-extrabold tracking-tight text-white">
            Frontend Componentes
          </h1>

          <div className="mt-4 flex items-center gap-4">
            <p className="text-sm text-white/80">
              Sesión: <b className="text-white">{auth.username}</b>
            </p>

            <button
              onClick={logout}
              className="rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white
                         shadow-sm ring-1 ring-white/10 transition
                         hover:bg-white/15 active:scale-[0.98]"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-2xl bg-white/5 p-6 shadow-lg ring-1 ring-white/10">
          <ComponenteList username={auth.username} password={auth.password} />
        </div>
      </main>
    </div>
  );
}











/*Código antiguo*/
/*

import { useAuth } from "./context/AuthContext";
import LoginForm from "./components/LoginForm";
import ComponenteList from "./components/ComponenteList";

export default function App() {
  const { auth, logout } = useAuth();

  if (!auth) return <LoginForm />;

  return (
    <div style={{ padding: 24 }}>
      <h1>Frontend Componentes</h1>

      <p>
        Sesión: <b>{auth.username}</b>{" "}
        <button onClick={logout}>Cerrar sesión</button>
      </p>

      <ComponenteList username={auth.username} password={auth.password} />
    </div>
  );
}

*/
