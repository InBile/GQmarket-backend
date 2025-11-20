WapMarket - Production-ready (Node.js + Postgres + Docker)
===============================================================

Contenido principal:
- backend/         -> Node.js + Express API (Postgres, JWT auth, image uploads)
- frontend/        -> HTML/CSS/JS tienda y panel admin (estático)
- db/init.sql      -> Esquema SQL con tablas y datos de ejemplo (categorías, productos, banners, admin seeder)
- docker-compose.yml -> Servicios: app (Node), db (Postgres)
- Dockerfile       -> Para construir la imagen del backend
- .env.example     -> Variables de entorno

Características añadidas para producción:
- Autenticación de administrador (JWT). Al arrancar, si se configuran ADMIN_EMAIL y ADMIN_PASSWORD en .env, se crea el admin automáticamente.
- Rutas protegidas para creación/modificación de productos y banners (solo admin con token).
- Subida de imágenes con multer a /uploads y servido estático (puedes cambiar a S3 en producción).
- Endpoint /config que devuelve ADMIN_PHONE para que el frontend use el número correcto (555218661).
- Docker-compose para facilitar despliegue local/servidor.
- Diseño frontend mejorado: categorías, filtros, banners, carrito, opción de envío (+2000 XAF), y dos opciones en checkout:
    1) "Hacer pedido" -> guarda el pedido en backend (empresa lo gestiona desde admin).
    2) "Hacer pedido por WhatsApp" -> guarda el pedido y abre WhatsApp hacia +240555218661 (o el número en .env).

Instrucciones rápidas (local / desarrollo)
-----------------------------------------
1. Copia .env.example a .env y rellena las variables (PGPASSWORD, ADMIN_EMAIL, ADMIN_PASSWORD, JWT_SECRET).
2. Levanta con Docker: docker-compose up --build
3. Espera a que el servicio app esté listo (puedes ver logs). La app corre en el puerto definido en .env (3000 por defecto).
4. Visita http://localhost:3000 -> tienda. Admin: http://localhost:3000/admin.html

Seguridad y recomendaciones
---------------------------
- Cambia JWT_SECRET a una clave fuerte en producción.
- Para subida de imágenes en producción, usa S3 o Blob storage y elimina almacenamiento local.
- Habilita HTTPS, proxy inverso (nginx) y límites de tamaño de request.
- Añade rate-limiting y validación más estricta para inputs.
- Integra backups para la base de datos y logs centralizados.

