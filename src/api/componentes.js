// src/api/componentes.js
const API_BASE = "https://pdauf-tema3.onrender.com";


function authHeader(username, password) {
  return {
    Authorization: "Basic " + btoa(`${username}:${password}`),
  };
}

export async function getComponentes(username, password) {
  const res = await fetch(`${API_BASE}/api/componentes`, {
    headers: authHeader(username, password),
  });

  if (!res.ok) throw new Error("Error cargando componentes");
  return res.json();
}

export async function createComponente(username, password, payload) {
  const res = await fetch(`${API_BASE}/api/componentes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(username, password),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Error creando componente");
  return res.json();
}

export async function deleteComponente(username, password, id) {
  const res = await fetch(`${API_BASE}/api/componentes/${id}`, {
    method: "DELETE",
    headers: authHeader(username, password),
  });

  if (!res.ok) throw new Error("Error eliminando componente");
  // tu API puede devolver 204 No Content, por eso no hacemos res.json()
  return true;
}
