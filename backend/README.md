API REST para la gestión de videojuegos, reseñas, calificaciones y reportes de interacción entre usuarios y videojuegos

**STACK:**
Node.js
Express
MongoDB + Mongoose
JWT (auth por cookies)
Winston (logging)

**Autenticación:**
La autenticación se maneja mediante JWT en cookies httpOnly.

**Middleware:**
protectRoute → valida usuario autenticado
requireAdmin → restringe acciones de administración

**ENDPOINTS:**
____________________________________________________________________

<center>USER</center>
____________________________________________________________________

**POST /api/auth/signup** // Registro de usuario
JSON:
{
  "name": "Juan Pérez",
  "email": "juan@gmail.com",
  "password": "123456",
  "birth_date": "2002-05-10"
}
____________________________________________________________________

**POST /api/auth/login** // Inicio de sesión
JSON:
{
  "email": "juan@gmail.com",
  "password": "123456"
}
____________________________________________________________________

**POST /api/auth/logout** // Cierre de sesión
____________________________________________________________________

**GET /api/auth/me** // Obtener los datos para mostrar en perfil
____________________________________________________________________

**PUT /api/auth/profile** // Actualización de datos de usuario
***Nota: Para actualizar la imagen de perfil, usar primero el endpoint POST /api/auth/upload para subir la foto y obtener la url, con esa url actualizar el campo del usuario.***
JSON:
{
  "name": "Juan Pérez Actualizado",
  "birth_date": "2001-10-15",
  "currentPassword": "123456",
  "password": "newpassword123",
  "image_url": "https://mi-imagen.com/avatar.png"
}
____________________________________________________________________

**GET /api/auth/users** // Listado de usuarios para Admin
URL:
/api/auth/users?page=1&limit=10&is_active=true&search=juan
____________________________________________________________________

**PATCH /api/auth/users/:id/toggle-status** //Activación y desactivación de usuario por Admin
***Nota: Para activar y desactivar hay que usar el mismo endpoint***
URL: 
/api/auth/users/64f1a2b3c4d5e6f7a8b9c0d1/toggle
____________________________________________________________________

**PUT /api/auth/users/:id** // Actualización de usuario por Admin
URL: 
/api/auth/users/64f1a2b3c4d5e6f7a8b9c0d1/toggle
JSON:
{
  "name": "Nuevo Nombre",
  "birth_date": "2000-10-10",
  "password": "newpass123",
  "role": "ADMIN"
}
____________________________________________________________________

**POST /api/auth/upload** // Subir imagen
***Nota: Este es el único endpoint que usa form-data***
key: image
type: file
value:
____________________________________________________________________

<center>GENRE (Es exactamente igual para genre y platform)</center>
____________________________________________________________________

**GET /api/genres** // Obtener todos los géneros para los admins (tablas)
**GET /api/platforms** // Obtener todas las plataformas para los admins (tablas)
URL: 
/api/genres?page=1&limit=10&is_active=true&search=accion
/api/platforms?page=1&limit=10&is_active=true&search=nintendo
____________________________________________________________________

**GET /api/genres/options** // Obtener los géneros para combobox
**GET /api/platforms/options** // Obtener las plataformas para combobox
____________________________________________________________________

**POST /api/genres** // Crear género por Admin
**POST /api/platforms** // Crear plataforma por Admin
JSON:
{
  "name": "Acción",
  "description": "Juegos enfocados en combate y reflejos"
}
JSON:
{
  "name": "PlayStation 5",
  "manufacturer": "Sony",
  "release_date": "2020-11-12"
}
____________________________________________________________________

**PUT /api/genres/:id** // Actualizar género por Admin
**PUT /api/platforms/:id** // Actualizar género por Admin
JSON:
{
  "name": "Acción",
  "description": "Juegos enfocados en combate y reflejos"
}
JSON:
{
  "name": "PlayStation 5",
  "manufacturer": "Sony",
  "release_date": "2020-11-12"
}
____________________________________________________________________

**PATCH /api/genres/:id/toggle** // Activar y desactivar género por Admin
**PATCH /api/platforms/:id/toggle** // Activar y desactivar plataforma por Admin
____________________________________________________________________

<center>RATINGS</center>
____________________________________________________________________

**POST /api/ratings** // Calificar un juego o actualizar la puntuación si ya habian hecho una
JSON:
{
  "video_game_id": "64f...",
  "score": 90
}
____________________________________________________________________

**PATCH /api/ratings/:id/toggle** // Eliminar una puntuación
____________________________________________________________________

<center>REPORTS</center>
____________________________________________________________________

**GET /api/reports/top-rated-games** // Reporte de juegos mejor valorados
URL:
/api/reports/top-rated-games?page=1&limit=10
____________________________________________________________________

**GET /api/reports/most-reviewed-games** // Reporte de juegos más reseñados
____________________________________________________________________

**GET /api/reports/user-activity** // Reporte de actividad de usuarios
____________________________________________________________________

**GET /api/reports/games-distribution** // Reporte de distribución de juegos por género y plataforma
____________________________________________________________________

<center>REVIEWS</center>
____________________________________________________________________

**GET /api/reviews/video-game/:id** // Listado de reseñas y calificaciones por juego
____________________________________________________________________

**GET /api/reviews/user** // Listado de reseñas y calificaciones del usuario que inició sesión
____________________________________________________________________

**POST /api/reviews/** // Crear reseña
**Nota: Si dan de baja la reseña con este endpoint se puede volver a subir algo**
JSON:
{
  "video_game_id": "64f1c2a9c2a1f8a1d2e9b123",
  "comment": "Excelente juego, muy recomendado"
}
____________________________________________________________________

**PATCH /api/reviews/:id** // Actualizar comentario
JSON:
{
  "comment": "Nuevo comentario actualizado"
}
____________________________________________________________________

**PATCH /api/reviews/:id/toggle** // Eliminar comentario (Usuario creador o Admin)
____________________________________________________________________

<center>VIDEOGAMES</center>
____________________________________________________________________

**GET /api/videogames/** // Listado de juegos para Admins
URL:
/api/videogames/?page=1&limit=5&search=halo&is_active=true&platform_id=[...]genre_id=[...]
____________________________________________________________________

**GET /api/videogames/options** // Listado de juegos para Usuarios
URL:
/api/videogames/options?search=halo&platform_id=[...]&genre_id=[...]&page=1&limit=10
____________________________________________________________________

**GET /api/videogames/:id** // Detalles de videojuego al dar click
____________________________________________________________________

**POST /api/videogames/** // Crear videojuego por Admin
JSON:
{
  "title": "Elden Ring",
  "description": "RPG de mundo abierto",
  "release_date": "2022-02-25",
  "developer": "FromSoftware",
  "platform_id": "64f1c2a9c2a1f8a1d2e9b123",
  "genre_id": "64f1c2a9c2a1f8a1d2e9b999",
  "image_url": "https://..."
}
____________________________________________________________________

**PUT /api/videogames/:id** // Actualizar videojuego por Admin
JSON:
{
  "title": "Elden Ring Deluxe",
  "description": "Versión mejorada",
  "release_date": "2022-02-25",
  "developer": "FromSoftware",
  "image_url": "https://...",
  "platform_id": "64f1c2a9c2a1f8a1d2e9b123",
  "genre_id": "64f1c2a9c2a1f8a1d2e9b999"
}
____________________________________________________________________

**PATCH /api/videogames/:id/toggle** // Activar o desactivar juego por Admin
____________________________________________________________________


**Notas de diseño:**
Reviews y Ratings están separados intencionalmente
Se usa soft delete en vez de borrado físico
Agregaciones para reportes
Populate para enriquecer respuestas