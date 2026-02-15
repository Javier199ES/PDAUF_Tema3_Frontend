// src/services/api.js (o donde lo tengas)
const API_BASE = import.meta.env.VITE_API_URL || "https://pdauf-tema3.onrender.com";

// ✅ Solo UNA vez
export function authHeader(username, password) {
  const token = btoa(`${username}:${password}`);
  return { Authorization: `Basic ${token}` };
}

export async function getComponentes(username, password) {
  const res = await fetch(`${API_BASE}/api/componentes`, {
    headers: authHeader(username, password),
  });
  if (!res.ok) throw new Error(`GET /api/componentes -> ${res.status}`);
  return res.json();
}

export async function createComponente(username, password, data) {
  const res = await fetch(`${API_BASE}/api/componentes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(username, password),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`POST /api/componentes -> ${res.status} ${txt}`);
  }
  return res.json();
}

export async function deleteComponente(username, password, id) {
  const res = await fetch(`${API_BASE}/api/componentes/${id}`, {
    method: "DELETE",
    headers: authHeader(username, password),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`DELETE /api/componentes/${id} -> ${res.status} ${txt}`);
  }
  return true;
}

export async function updateComponente(username, password, id, payload) {
  const res = await fetch(`${API_BASE}/api/componentes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(username, password),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`PUT /api/componentes/${id} -> ${res.status} ${txt}`);
  }
  return res.json();
}
