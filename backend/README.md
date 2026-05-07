# OBSIDIAN - Backend API

Esta carpeta contendrá la API REST desarrollada con Node.js y Express, así como la conexión a la base de datos MongoDB.

# Obsidian - Backend

## Cómo correrlo

### 1. Instalar dependencias

```bash
cd backend
npm install
```

### 2. Crear archivo .env

Crear un archivo `.env` en la carpeta `backend/` con lo siguiente:

```
MONGO_URI=tu_uri_de_mongodb_atlas
JWT_SECRET=tu_clave_secreta
GOOGLE_CLIENT_ID=tu_client_id_de_google
GOOGLE_CLIENT_SECRET=tu_client_secret_de_google
FRONTEND_URL=http://localhost:5173
PORT=3000
```

### 3. Crear el usuario admin

```bash
npm run seed
```

Credenciales del admin: `admin@obsidian.com` / `admin123`

### 4. Arrancar el servidor

```bash
npm run dev
```

El servidor corre en `http://localhost:3000`

## Tecnologías

- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- JWT (jsonwebtoken + bcrypt)
- Passport (Google OAuth)
- Socket.io
