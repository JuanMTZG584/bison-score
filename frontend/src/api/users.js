// api/users.js – Servicio para endpoints de usuario

const BASE = "/api/auth";

// GET /api/auth/me
export async function getMe() {
  const res = await fetch(`${BASE}/me`, { credentials: "include" });
  if (!res.ok) throw new Error((await res.json()).message || "No autenticado");
  return res.json();
}

// POST /api/auth/login
export async function login(email, password) {
  const res = await fetch(`${BASE}/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al iniciar sesión");
  return data;
}

// POST /api/auth/signup
export async function signup(form) {
  const res = await fetch(`${BASE}/signup`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al registrarse");
  return data;
}

// POST /api/auth/logout
export async function logout() {
  const res = await fetch(`${BASE}/logout`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Error al cerrar sesión");
  return res.json();
}

// PUT /api/auth/profile
export async function updateProfile(fields) {
  const res = await fetch(`${BASE}/profile`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(fields),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al actualizar perfil");
  return data;
}

// POST /api/auth/upload  (multipart/form-data)
export async function uploadImage(file) {
  const formData = new FormData();
  formData.append("image", file);
  const res = await fetch(`${BASE}/upload`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al subir imagen");
  return data; // { url: "https://..." }
}

// GET /api/auth/users  (Admin)
export async function getUsers({ page = 1, limit = 10, is_active, search } = {}) {
  const params = new URLSearchParams({ page, limit });
  if (is_active !== undefined) params.set("is_active", is_active);
  if (search) params.set("search", search);
  const res = await fetch(`${BASE}/users?${params}`, { credentials: "include" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al obtener usuarios");
  return data; // { users, page, totalPages, totalUsers }
}

// PATCH /api/auth/users/:id/toggle-status  (Admin)
export async function toggleUserStatus(id) {
  const res = await fetch(`${BASE}/users/${id}/toggle-status`, {
    method: "PATCH",
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al cambiar estado");
  return data;
}

// PUT /api/auth/users/:id  (Admin)
export async function updateUserByAdmin(id, fields) {
  const res = await fetch(`${BASE}/users/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(fields),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al actualizar usuario");
  return data;
}