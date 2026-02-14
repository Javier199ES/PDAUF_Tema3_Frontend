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
