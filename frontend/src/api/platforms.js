// api/platforms.js – Servicio para endpoints de plataformas

const BASE = "/api/platforms";

// GET /api/platforms  (Admin)
export async function getPlatforms({ page = 1, limit = 10, is_active, search } = {}) {
  const params = new URLSearchParams({ page, limit });
  if (is_active !== undefined && is_active !== "") params.set("is_active", is_active);
  if (search) params.set("search", search);
  const res = await fetch(`${BASE}?${params}`, { credentials: "include" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al obtener plataformas");
  return data; // { platforms, page, totalPages, totalPlatforms }
}

// POST /api/platforms  (Admin)
export async function createPlatform({ name, manufacturer, release_date }) {
  const res = await fetch(BASE, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, manufacturer, release_date }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al crear plataforma");
  return data;
}

// PUT /api/platforms/:id  (Admin)
export async function updatePlatform(id, fields) {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(fields),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al actualizar plataforma");
  return data;
}

// PATCH /api/platforms/:id/toggle  (Admin)
export async function togglePlatformStatus(id) {
  const res = await fetch(`${BASE}/${id}/toggle`, {
    method: "PATCH",
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al cambiar estado de la plataforma");
  return data;
}

export async function getPlatformOptions() {
  const res = await fetch("/api/platforms/options", {
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error al obtener plataformas");
  }

  return data;
}