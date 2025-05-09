# 📘 API REST de FitLink

Esta API permite la gestión de usuarios, rutinas, entrenamientos, posts, interacciones sociales y estadísticas de progreso. A continuación se detallan todas las rutas disponibles agrupadas por funcionalidad.

---

## 🔐 Auth (/api/auth)

| Método | Ruta          | Descripción                           |
|--------|---------------|---------------------------------------|
| POST   | /register     | Registra un nuevo usuario             |
| POST   | /login        | Inicia sesión y devuelve el token     |
| POST   | /logout       | Cierra sesión (cliente elimina token) |

---

## 👤 Usuarios (/api/users)

| Método | Ruta             | Descripción                                  |
|--------|------------------|----------------------------------------------|
| GET    | /me              | Devuelve el perfil del usuario autenticado   |
| PUT    | /me              | Actualiza el perfil del usuario              |
| GET    | /:id             | Devuelve el perfil público por ID            |
| DELETE | /me              | Elimina la cuenta del usuario autenticado    |

---

## 👥 Seguidores (/api/followers)

| Método | Ruta               | Descripción                                 |
|--------|--------------------|---------------------------------------------|
| POST   | /:id               | Seguir a un usuario                         |
| DELETE | /:id               | Dejar de seguir a un usuario                |
| GET    | /list/followers    | Listado de seguidores del usuario actual    |
| GET    | /list/following    | Listado de seguidos por el usuario actual   |
| GET    | /count/followers   | Número de seguidores                        |
| GET    | /count/following   | Número de seguidos                          |

---

## 🧠 Ejercicios (/api/exercises)

| Método | Ruta        | Descripción                                          |
|--------|-------------|------------------------------------------------------|
| GET    | /           | Lista todos los ejercicios (filtrable por `?target`) |
| GET    | /targets    | Devuelve todos los grupos musculares únicos          |

---

## 📝 Rutinas (/api/routines)

| Método | Ruta                      | Descripción                                        |
|--------|---------------------------|----------------------------------------------------|
| POST   | /                         | Crea una rutina nueva                              |
| GET    | /                         | Devuelve las rutinas del usuario autenticado       |
| PUT    | /:id                      | Actualiza una rutina propia                        |
| DELETE | /:id                      | Elimina una rutina propia                          |
| GET    | /public/following         | Rutinas públicas de los usuarios que sigo          |
| PUT    | /visibility/:id           | Cambia visibilidad (pública/privada) de una rutina |

---

## 💾 Rutinas Guardadas (/api/saved-routines)

| Método | Ruta             | Descripción                             |
|--------|------------------|-----------------------------------------|
| POST   | /:routineId      | Guardar una rutina pública              |
| DELETE | /:routineId      | Eliminar rutina guardada                |
| GET    | /                | Obtener rutinas guardadas               |

---

## 🏋️‍♂️ Sesiones de Entrenamiento (/api/training-logs)

| Método | Ruta      | Descripción                                    |
|--------|-----------|------------------------------------------------|
| POST   | /         | Registrar una nueva sesión                     |
| GET    | /         | Listar todas las sesiones del usuario          |
| GET    | /:id      | Obtener una sesión específica por ID           |

---

## 📊 Estadísticas (/api/statistics)

| Método | Ruta                   | Descripción                                          |
|--------|------------------------|------------------------------------------------------|
| GET    | /                      | Estadísticas generales del usuario                   |
| GET    | /improvement           | Mejora por ejercicio (top 5 o todos con `?all=true`) |

---

## 📝 Posts (/api/posts)

| Método | Ruta           | Descripción                                  |
|--------|----------------|----------------------------------------------|
| POST   | /              | Crear un nuevo post                          |
| DELETE | /:id           | Eliminar un post propio                      |
| GET    | /              | Obtener posts del feed (usuarios seguidos)   |
| GET    | /user/:userId  | Obtener posts de un usuario específico       |
| GET    | /:id           | Obtener un post con detalles                 |

---

## 💬 Comentarios (/api/comments)

| Método | Ruta                           | Descripción                               |
|--------|--------------------------------|-------------------------------------------|
| POST   | /                              | Crear comentario o respuesta en un post   |
| DELETE | /:commentId                    | Eliminar comentario propio                |
| POST   | /like/:commentId               | Dar like a un comentario                  |
| DELETE | /like/:commentId               | Quitar like a un comentario               |
| GET    | /like/:commentId               | Ver si el usuario dio like                |
| GET    | /post/:postId                  | Comentarios de un post                    |
| GET    | /replies/:commentId            | Respuestas a un comentario                |
| GET    | /count/:postId                 | Número total de comentarios de un post    |
| GET    | /likes/:commentId              | Número de likes de un comentario          |

---

## ❤️ Interacciones (/api/interactions)

| Método | Ruta                     | Descripción                              |
|--------|--------------------------|------------------------------------------|
| POST   | /like/:postId            | Dar like a un post                       |
| DELETE | /like/:postId            | Quitar like a un post                    |
| GET    | /like/:postId            | Ver si el usuario dio like               |
| POST   | /save/:postId            | Guardar un post                          |
| DELETE | /save/:postId            | Quitar guardado                          |
| GET    | /save/:postId            | Ver si el usuario guardó el post         |
| GET    | /liked                   | Obtener posts que he dado like           |
| GET    | /saved                   | Obtener posts que he guardado            |
| GET    | /likes/:postId           | Número de likes de un post               |
| GET    | /saves/:postId           | Número de guardados de un post           |

---

## 🔔 Notificaciones (/api/notifications)

| Método | Ruta     | Descripción                           |
|--------|----------|---------------------------------------|
| GET    | /        | Obtener notificaciones del usuario    |
| PUT    | /read    | Marcar todas como leídas              |

---

## 🔎 Búsqueda (/api/search)

| Método | Ruta                           | Descripción                                  |
|--------|--------------------------------|----------------------------------------------|
| GET    | /?q=abc                        | Buscar en usuarios, posts y rutinas públicas |
| GET    | /?q=abc&type=user/post/routine | Buscar por tipo específico                   |

---

✅ Todas las rutas protegidas requieren autenticación con JWT.
