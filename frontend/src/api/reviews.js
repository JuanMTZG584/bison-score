// frontend/src/api/reviews.js

/* ── Reviews ──────────────────────────────────────────────────────────────── */

export async function getGameReviews(videoGameId, params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== "") query.set(k, v);
  });
  const res = await fetch(`/api/reviews/video-game/${videoGameId}?${query}`, {
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al obtener reseñas");
  return data; // { feedback, totalPages, page, totalFeedback }
}

export async function getUserReviews(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== "") query.set(k, v);
  });
  const res = await fetch(`/api/reviews/user?${query}`, { credentials: "include" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al obtener reseñas del usuario");
  return data; // { feedback, totalPages, page, totalFeedback }
}

export async function createReview(payload) {
  // payload: { video_game_id, comment }
  const res = await fetch("/api/reviews", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al crear reseña");
  return data;
}

export async function updateReview(id, comment) {
  const res = await fetch(`/api/reviews/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ comment }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al actualizar reseña");
  return data;
}

export async function deleteReview(id) {
  const res = await fetch(`/api/reviews/${id}/toggle`, {
    method: "PATCH",
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al eliminar reseña");
  return data;
}

/* ── Ratings ──────────────────────────────────────────────────────────────── */

export async function upsertRating(videoGameId, score) {
  // Crea o actualiza la calificación del usuario para ese juego
  const res = await fetch("/api/ratings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ video_game_id: videoGameId, score }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al guardar calificación");
  return data;
}

export async function deleteRating(id) {
  const res = await fetch(`/api/ratings/${id}/toggle`, {
    method: "PATCH",
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al eliminar calificación");
  return data;
}