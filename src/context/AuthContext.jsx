import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);
const STORAGE_KEY = "auth"; // clave en localStorage

export function AuthProvider({ children }) {
  // 1) Inicializa leyendo de localStorage (si existe)
  const [auth, setAuth] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  // 2) Cada vez que auth cambie, lo guardamos/borramos
  useEffect(() => {
    if (auth) localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
    else localStorage.removeItem(STORAGE_KEY);
  }, [auth]);

  function login(username, password) {
    // aquí guardamos lo mínimo que necesites
    setAuth({ username, password });
  }

  function logout() {
    setAuth(null);
  }

  const value = useMemo(() => ({ auth, login, logout }), [auth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
