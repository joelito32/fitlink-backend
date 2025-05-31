# 📘 API de FitLink – Documentación de Rutas y Uso en Frontend

## 📚 Uso de la API desde el Frontend

Todas las rutas comienzan con `/api`, ya que están montadas en el backend como `app.use('/api', routes)`.

---

### 🔐 Autenticación (`/api/auth`)

| Método | Ruta                 | Descripción                                                                            |
|--------|----------------------|----------------------------------------------------------------------------------------|
| POST   | `/api/auth/register` | Registra un nuevo usuario. Enviar `email`, `username`, `password` y `confirmPassword`. |
| POST   | `/api/auth/login`    | Inicia sesión. Enviar `identifier` (email o username) y `password`. Devuelve un JWT.   |
| POST   | `/api/auth/logout`   | Cierra sesión (elimina el token en el frontend manualmente).                           |

**Uso frontend:**  
- Guarda el token JWT en localStorage o cookies tras login.  
- Añade el token a `Authorization: Bearer` en las siguientes rutas protegidas.

---

### 👤 Usuarios (`/api/users`)

| Método | Ruta                   | Descripción                                                      |
|--------|------------------------|------------------------------------------------------------------|
| GET    | `/api/users/me`        | Obtiene los datos del usuario autenticado.                       |
| PUT    | `/api/users/me`        | Actualiza perfil (nombre, bio, fecha de nacimiento, peso, foto). |
| GET    | `/api/users/:id`       | Obtiene el perfil público de otro usuario.                       |
| DELETE | `/api/users/me`        | Elimina la cuenta del usuario actual.                            |

**Uso frontend:**  
- Mostrar perfil propio y editar.  
- Ver perfiles públicos (rutas protegidas).

---

### 👥 Seguidores (`/api/followers`)

| Método | Ruta                             | Descripción                                  |
|--------|----------------------------------|----------------------------------------------|
| POST   | `/api/followers/:id`             | Seguir a un usuario por su ID.               |
| DELETE | `/api/followers/:id`             | Dejar de seguir a un usuario.                |
| GET    | `/api/followers`                 | Lista de seguidores del usuario autenticado. |
| GET    | `/api/followers/following`       | Lista de seguidos.                           |
| GET    | `/api/followers/count`           | Número de seguidores.                        |
| GET    | `/api/followers/following-count` | Número de seguidos.                          |

**Uso frontend:**  
- Botones "Seguir/Dejar de seguir", contadores, y páginas de seguidores/seguidos.

---

### 💪 Ejercicios (`/api/exercises`)

| Método | Ruta                     | Descripción                                                       |
|--------|--------------------------|-------------------------------------------------------------------|
| GET    | `/api/exercises`         | Lista todos los ejercicios (puede filtrarse con `?target=pecho`). |
| GET    | `/api/exercises/targets` | Lista todos los grupos musculares únicos.                         |

**Uso frontend:**  
- Selector de ejercicios para crear o editar rutinas.

---

### 📋 Rutinas (`/api/routines`)

| Método | Ruta                             | Descripción                              |
|--------|----------------------------------|------------------------------------------|
| POST   | `/api/routines`                  | Crea una nueva rutina.                   |
| GET    | `/api/routines`                  | Obtiene tus rutinas.                     |
| PUT    | `/api/routines/:id`              | Actualiza una rutina propia.             |
| DELETE | `/api/routines/:id`              | Elimina una rutina propia.               |
| GET    | `/api/routines/following/public` | Rutinas públicas de usuarios que sigues. |
| PATCH  | `/api/routines/:id/visibility`   | Cambia visibilidad pública/privada.      |

**Uso frontend:**  
- Crear/editar rutinas, feed de rutinas públicas, gestión de visibilidad.

---

### ⭐ Rutinas guardadas (`/api/saved-routines`)

| Método | Ruta                             | Descripción                                |
|--------|----------------------------------|--------------------------------------------|
| POST   | `/api/saved-routines/:routineId` | Guarda una rutina pública de otro usuario. |
| DELETE | `/api/saved-routines/:routineId` | Quita una rutina guardada.                 |
| GET    | `/api/saved-routines`            | Lista las rutinas que has guardado.        |

**Uso frontend:**  
- Sección "rutinas favoritas".

---

### 📝 Posts (`/api/posts`)

| Método | Ruta                      | Descripción                                   |
|--------|---------------------------|-----------------------------------------------|
| POST   | `/api/posts`              | Crea un nuevo post con o sin rutina asociada. |
| GET    | `/api/posts`              | Feed de posts de usuarios que sigues.         |
| GET    | `/api/posts/:id`          | Obtiene un post individual.                   |
| GET    | `/api/posts/user/:userId` | Posts de un usuario concreto.                 |
| DELETE | `/api/posts/:id`          | Borra un post propio.                         |

**Uso frontend:**  
- Crear posts, ver feed, ver posts por usuario, borrar propios.

---

### 💬 Comentarios (`/api/comments`)

| Método | Ruta                                | Descripción                             |
|--------|-------------------------------------|-----------------------------------------|
| POST   | `/api/comments`                     | Comentar o responder a un post.         |
| DELETE | `/api/comments/:commentId`          | Borra un comentario propio.             |
| POST   | `/api/comments/:commentId/like`     | Da like a un comentario.                |
| DELETE | `/api/comments/:commentId/unlike`   | Quita el like.                          |
| GET    | `/api/comments/:commentId/liked`    | Verifica si el usuario actual dio like. |
| GET    | `/api/comments/post/:postId`        | Obtiene los comentarios de un post.     |
| GET    | `/api/comments/:commentId/replies`  | Respuestas a un comentario.             |
| GET    | `/api/comments/:commentId/likes`    | Nº de likes del comentario.             |
| GET    | `/api/comments/post/:postId/count`  | Nº de comentarios en el post.           |

**Uso frontend:**  
- Comentarios en los posts, likes, respuestas, contadores.

---

### ❤️ Interacciones con posts (`/api/interactions`)

| Método | Ruta                                    | Descripción            |
|--------|-----------------------------------------|------------------------|
| POST   | `/api/interactions/:postId/like`        | Like a un post.        |
| DELETE | `/api/interactions/:postId/unlike`      | Quitar like.           |
| GET    | `/api/interactions/:postId/liked`       | Saber si diste like.   |
| POST   | `/api/interactions/:postId/save`        | Guardar un post.       |
| DELETE | `/api/interactions/:postId/unsave`      | Quitar guardado.       |
| GET    | `/api/interactions/:postId/saved`       | Saber si lo guardaste. |
| GET    | `/api/interactions/liked`               | Tus posts liked.       |
| GET    | `/api/interactions/saved`               | Tus posts guardados.   |
| GET    | `/api/interactions/:postId/likes-count` | Nº de likes.           |
| GET    | `/api/interactions/:postId/saves-count` | Nº de guardados.       |

**Uso frontend:**  
- Botones de interacción, pestañas de liked/saved posts.

---

### 🔔 Notificaciones (`/api/notifications`)

| Método | Ruta                          | Descripción               |
|--------|-------------------------------|---------------------------|
| GET    | `/api/notifications`          | Lista tus notificaciones. |
| PATCH  | `/api/notifications/read-all` | Marca todas como leídas.  |

**Uso frontend:**  
- Lista con notificaciones tipo red social + punto azul si hay nuevas.

---

### 🔍 Búsqueda (`/api/search`)

| Método | Ruta                                       | Descripción                                                                          |
|--------|--------------------------------------------|--------------------------------------------------------------------------------------|
| GET    | `/api/search?q=...&type=user|post|routine` | Busca usuarios, posts o rutinas públicas. Si `type` no se especifica, busca en todo. |

**Uso frontend:**  
- Buscador general con filtros.

---

### 📈 Estadísticas (`/api/statistics`)

| Método | Ruta                                  | Descripción                                                                    |
|--------|---------------------------------------|--------------------------------------------------------------------------------|
| GET    | `/api/statistics`                     | Devuelve estadísticas generales de entrenamiento. Opcional: `?exerciseId=...`. |
| GET    | `/api/statistics/improvement`         | Mejora de ejercicios (top 5 por defecto).                                      |
| GET    | `/api/statistics/improvement?all=true`| Mejora de todos los ejercicios.                                                |

**Uso frontend:**  
- Mostrar progreso, distribución muscular, evolución de peso, mejora por ejercicio.

---

### 🏋️‍♂️ Training Logs (`/api/training-logs`)

| Método | Ruta                     | Descripción                                          |
|--------|--------------------------|------------------------------------------------------|
| POST   | `/api/training-logs`     | Registra una sesión con duración, ejercicios, pesos. |
| GET    | `/api/training-logs`     | Lista todas las sesiones del usuario.                |
| GET    | `/api/training-logs/:id` | Obtiene una sesión concreta. Solo si es del usuario. |

**Uso frontend:**  
- Registrar entrenamientos diarios, consultar historial y detalles.