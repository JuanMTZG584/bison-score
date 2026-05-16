// api/genres.js – Servicio para endpoints de géneros

const BASE = "/api/genres";

// GET /api/genres  (Admin)
export async function getGenres({ page = 1, limit = 10, is_active, search } = {}) {
  const params = new URLSearchParams({ page, limit });
  if (is_active !== undefined && is_active !== "") params.set("is_active", is_active);
  if (search) params.set("search", search);
  const res = await fetch(`${BASE}?${params}`, { credentials: "include" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al obtener géneros");
  return data; // { genres, page, totalPages, totalGenres }
}

// POST /api/genres  (Admin)
export async function createGenre({ name, description }) {
  const res = await fetch(BASE, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, description }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al crear género");
  return data;
}

// PUT /api/genres/:id  (Admin)
export async function updateGenre(id, fields) {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(fields),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al actualizar género");
  return data;
}

// PATCH /api/genres/:id/toggle  (Admin)
export async function toggleGenreStatus(id) {
  const res = await fetch(`${BASE}/${id}/toggle`, {
    method: "PATCH",
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al cambiar estado del género");
  return data;
}

export async function getGenreOptions() {
  const res = await fetch("/api/genres/options", {
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error al obtener géneros");
  }

  return data;
}