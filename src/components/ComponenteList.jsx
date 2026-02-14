import { useEffect, useState } from "react";
import {
  getComponentes,
  createComponente,
  deleteComponente,
  updateComponente,
} from "../services/api";

export default function ComponenteList({ username, password }) {
  const [componentes, setComponentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Crear
  const [form, setForm] = useState({
    nombre: "",
    categoria: "",
    precio: "",
    stock: "",
  });

  // Edit inline
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    nombre: "",
    categoria: "",
    precio: "",
    stock: "",
  });

  async function cargar() {
    try {
      setError("");
      setLoading(true);
      const data = await getComponentes(username, password);
      setComponentes(data);
    } catch (e) {
      setError(e.message || "Error cargando componentes");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ====== CREATE ======
  function onChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    try {
      setError("");

      const payload = {
        nombre: form.nombre.trim(),
        categoria: form.categoria.trim(),
        precio: Number(form.precio),
        stock: Number(form.stock),
      };

      const creado = await createComponente(username, password, payload);
      setComponentes((prev) => [...prev, creado]);
      setForm({ nombre: "", categoria: "", precio: "", stock: "" });
    } catch (e) {
      setError(e.message || "Error creando componente");
    }
  }

  // ====== DELETE ======
  async function onDelete(id) {
    try {
      setError("");
      await deleteComponente(username, password, id);
      setComponentes((prev) => prev.filter((c) => c.id !== id));
      if (editingId === id) {
        setEditingId(null);
      }
    } catch (e) {
      setError(e.message || "Error eliminando componente");
    }
  }

  // ====== EDIT INLINE ======
  function startEdit(c) {
    setError("");
    setEditingId(c.id);
    setEditForm({
      nombre: c.nombre ?? "",
      categoria: c.categoria ?? "",
      precio: String(c.precio ?? ""),
      stock: String(c.stock ?? ""),
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm({ nombre: "", categoria: "", precio: "", stock: "" });
  }

  function onEditChange(e) {
    setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function saveEdit(id) {
    try {
      setError("");

      const payload = {
        nombre: editForm.nombre.trim(),
        categoria: editForm.categoria.trim(),
        precio: Number(editForm.precio),
        stock: Number(editForm.stock),
      };

      const actualizado = await updateComponente(username, password, id, payload);

      setComponentes((prev) => prev.map((c) => (c.id === id ? actualizado : c)));
      cancelEdit();
    } catch (e) {
      setError(e.message || "Error actualizando componente");
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Crear componente</h2>

      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: "tomato" }}>{error}</p>}

      <form
        onSubmit={onSubmit}
        style={{ display: "grid", gap: 8, maxWidth: 420, marginBottom: 20 }}
      >
        <input
          name="nombre"
          placeholder="nombre"
          value={form.nombre}
          onChange={onChange}
        />
        <input
          name="categoria"
          placeholder="categoria"
          value={form.categoria}
          onChange={onChange}
        />
        <input
          name="precio"
          placeholder="precio"
          value={form.precio}
          onChange={onChange}
        />
        <input
          name="stock"
          placeholder="stock"
          value={form.stock}
          onChange={onChange}
        />
        <button type="submit">Crear</button>
      </form>

      <h2>Listado</h2>
      <button onClick={cargar} style={{ marginBottom: 12 }}>
        Refrescar
      </button>

      <ul style={{ paddingLeft: 18 }}>
        {componentes.map((c) => {
          const isEditing = editingId === c.id;

          return (
            <li key={c.id} style={{ marginBottom: 10 }}>
              {!isEditing ? (
                <>
                  <b>{c.nombre}</b> — {c.categoria} — {c.precio}€ (stock:{" "}
                  {c.stock}){" "}
                  <button onClick={() => startEdit(c)}>Editar</button>{" "}
                  <button onClick={() => onDelete(c.id)}>Eliminar</button>
                </>
              ) : (
                <>
                  <input
                    name="nombre"
                    value={editForm.nombre}
                    onChange={onEditChange}
                    style={{ width: 140, marginRight: 6 }}
                  />
                  <input
                    name="categoria"
                    value={editForm.categoria}
                    onChange={onEditChange}
                    style={{ width: 120, marginRight: 6 }}
                  />
                  <input
                    name="precio"
                    value={editForm.precio}
                    onChange={onEditChange}
                    style={{ width: 80, marginRight: 6 }}
                  />
                  <input
                    name="stock"
                    value={editForm.stock}
                    onChange={onEditChange}
                    style={{ width: 70, marginRight: 6 }}
                  />
                  <button onClick={() => saveEdit(c.id)}>Guardar</button>{" "}
                  <button onClick={cancelEdit}>Cancelar</button>
                </>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
