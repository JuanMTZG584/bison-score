const BASE = "/api/videogames";

export async function getVideoGames(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== "") query.set(k, v);
  });
  const res = await fetch(`${BASE}?${query}`, { credentials: "include" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al obtener videojuegos");
  return data; // { videoGames, totalPages, page, totalVideoGames }
}

export async function createVideoGame(payload) {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al crear videojuego");
  return data;
}

export async function updateVideoGame(id, payload) {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al actualizar videojuego");
  return data;
}

export async function toggleVideoGameStatus(id) {
  const res = await fetch(`${BASE}/${id}/toggle`, {
    method: "PATCH",
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al cambiar estado");
  return data;
}