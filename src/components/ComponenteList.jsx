import { useEffect, useState } from "react";
import {
  getComponentes,
  createComponente,
  deleteComponente,
  updateComponente,
} from "../services/api";

function Field({ label, ...props }) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-white/80">{label}</label>
      <input
        {...props}
        className="w-full rounded-lg bg-black/20 px-3 py-2 text-white
                   ring-1 ring-white/10 outline-none
                   focus:ring-2 focus:ring-white/25"
      />
    </div>
  );
}

function Btn({ variant = "neutral", className = "", ...props }) {
  const base =
    "rounded-lg px-4 py-2 text-sm font-semibold transition active:scale-[0.98]";
  const styles =
    variant === "primary"
      ? "bg-white text-slate-900 hover:opacity-90"
      : variant === "danger"
      ? "bg-red-500/15 text-red-200 ring-1 ring-red-500/30 hover:bg-red-500/25"
      : "bg-white/10 text-white ring-1 ring-white/10 hover:bg-white/15";
  return <button className={`${base} ${styles} ${className}`} {...props} />;
}

export default function ComponenteList({ username, password }) {
  const [componentes, setComponentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ====== CAMBIO: MENSAJE DE CREACIÓN (feedback UX) ======
  // Mostramos un mensaje verde cuando se crea correctamente un componente
  const [success, setSuccess] = useState("");
  // =======================================================

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
      // ====== CAMBIO: MENSAJE DE CREACIÓN ======
      // Si refrescamos, ocultamos el mensaje de éxito (para no confundir)
      setSuccess("");
      // ========================================
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
      // ====== CAMBIO: MENSAJE DE CREACIÓN ======
      // Limpia el mensaje anterior antes de crear
      setSuccess("");
      // ========================================

      const payload = {
        nombre: form.nombre.trim(),
        categoria: form.categoria.trim(),
        precio: Number(form.precio),
        stock: Number(form.stock),
      };

      const creado = await createComponente(username, password, payload);
      setComponentes((prev) => [...prev, creado]);
      setForm({ nombre: "", categoria: "", precio: "", stock: "" });

      // ====== CAMBIO: MENSAJE DE CREACIÓN (con transición) ======
      setSuccess("Componente creado correctamente ✅");
      // Se oculta solo para que no se quede fijo en pantalla
      setTimeout(() => setSuccess(""), 2000);
      // ==========================================================
    } catch (e) {
      // ====== CAMBIO: MENSAJE DE CREACIÓN ======
      // Si hay error, quitamos el success para no mezclar mensajes
      setSuccess("");
      // ========================================
      setError(e.message || "Error creando componente");
    }
  }

  // ====== DELETE ======
  async function onDelete(id) {
    try {
      setError("");
      // ====== CAMBIO: MENSAJE DE CREACIÓN ======
      setSuccess("");
      // ========================================
      await deleteComponente(username, password, id);
      setComponentes((prev) => prev.filter((c) => c.id !== id));
      if (editingId === id) setEditingId(null);
    } catch (e) {
      setError(e.message || "Error eliminando componente");
    }
  }

  // ====== EDIT INLINE ======
  function startEdit(c) {
    setError("");
    // ====== CAMBIO: MENSAJE DE CREACIÓN ======
    setSuccess("");
    // ========================================
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
      // ====== CAMBIO: MENSAJE DE CREACIÓN ======
      setSuccess("");
      // ========================================

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
    <div className="text-white">
      {/* Cabecera */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gestión de componentes</h2>
          <p className="mt-1 text-sm text-white/70">
            Interfaz responsive con Tailwind (cards, grid, tabla, animaciones).
          </p>
        </div>

        <Btn onClick={cargar}>Refrescar</Btn>
      </div>

      {/* Estados */}
      {loading && (
        <div className="mt-4 rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
          <p className="text-sm text-white/70 animate-pulse">Cargando componentes…</p>
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
          {error}
        </div>
      )}

      {/* ====== CAMBIO: MENSAJE DE CREACIÓN (visible y documentable) ====== */}
      {success && (
        <div
          className="mt-4 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-200
                     transition-opacity duration-300"
        >
          {success}
        </div>
      )}
      {/* ================================================================= */}

      {/* Layout */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Crear */}
        <section className="rounded-2xl bg-white/5 p-6 shadow-lg ring-1 ring-white/10">
          <h3 className="text-lg font-semibold">Crear componente</h3>
          <form onSubmit={onSubmit} className="mt-4 grid gap-3">
            <Field
              label="Nombre"
              name="nombre"
              placeholder="Teclado mecánico"
              value={form.nombre}
              onChange={onChange}
              required
            />
            <Field
              label="Categoría"
              name="categoria"
              placeholder="Periféricos"
              value={form.categoria}
              onChange={onChange}
              required
            />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field
                label="Precio (€)"
                name="precio"
                placeholder="49.99"
                value={form.precio}
                onChange={onChange}
                required
              />
              <Field
                label="Stock"
                name="stock"
                placeholder="10"
                value={form.stock}
                onChange={onChange}
                required
              />
            </div>

            <Btn variant="primary" type="submit">
              Crear
            </Btn>
          </form>
        </section>

        {/* Listado */}
        <section className="rounded-2xl bg-white/5 p-6 shadow-lg ring-1 ring-white/10">
          <h3 className="text-lg font-semibold">Listado</h3>

          <div className="mt-4 overflow-x-auto rounded-xl ring-1 ring-white/10">
            <table className="min-w-full text-sm">
              <thead className="bg-black/20 text-white/80">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold">Nombre</th>
                  <th className="px-3 py-2 text-left font-semibold">Categoría</th>
                  <th className="px-3 py-2 text-left font-semibold">Precio</th>
                  <th className="px-3 py-2 text-left font-semibold">Stock</th>
                  <th className="px-3 py-2 text-left font-semibold">Acciones</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/10 bg-white/5">
                {componentes.map((c) => {
                  const isEditing = editingId === c.id;

                  return (
                    <tr key={c.id} className="hover:bg-white/5">
                      {!isEditing ? (
                        <>
                          <td className="px-3 py-2 font-medium">{c.nombre}</td>
                          <td className="px-3 py-2 text-white/80">{c.categoria}</td>
                          <td className="px-3 py-2 text-white/80">{c.precio}€</td>
                          <td className="px-3 py-2 text-white/80">{c.stock}</td>
                          <td className="px-3 py-2">
                            <div className="flex flex-wrap gap-2">
                              <Btn onClick={() => startEdit(c)}>Editar</Btn>
                              <Btn variant="danger" onClick={() => onDelete(c.id)}>
                                Eliminar
                              </Btn>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          {["nombre", "categoria", "precio", "stock"].map((k) => (
                            <td key={k} className="px-3 py-2">
                              <input
                                name={k}
                                value={editForm[k]}
                                onChange={onEditChange}
                                className="w-full rounded-lg bg-black/20 px-2 py-1 text-white
                                           ring-1 ring-white/10 outline-none
                                           focus:ring-2 focus:ring-white/25"
                              />
                            </td>
                          ))}
                          <td className="px-3 py-2">
                            <div className="flex flex-wrap gap-2">
                              <Btn variant="primary" onClick={() => saveEdit(c.id)}>
                                Guardar
                              </Btn>
                              <Btn onClick={cancelEdit}>Cancelar</Btn>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })}

                {!loading && componentes.length === 0 && (
                  <tr>
                    <td className="px-3 py-4 text-white/70" colSpan={5}>
                      No hay componentes todavía. Crea el primero 👆
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <p className="mt-3 text-xs text-white/60">
            En móvil la tabla tiene scroll horizontal.
          </p>
        </section>
      </div>
    </div>
  );
}
/*
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
*/
