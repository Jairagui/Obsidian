# OBSIDIAN - Bóveda Digital para Coleccionistas

OBSIDIAN es una aplicación web tipo SPA pensada para que los coleccionistas puedan digitalizar, organizar y ver todo su inventario en un solo lugar. Básicamente funciona como una bóveda digital.

## Arquitectura del Proyecto
El proyecto sigue una arquitectura clásica Cliente-Servidor separada en dos grandes módulos:

* **`/frontend`**: Desarrollado con React y TypeScript, encargado de la interfaz de usuario (SPA).
* **`/backend`**: Desarrollado con Node.js y Express.

## Alcance
El sistema está enfocado únicamente en la organización y el control del inventario personal, por lo que no incluirá ningún módulo de compra o venta ni interacción entre usuarios.

## Como Levantar el Proyecto

### 1. Clonar el repo
```bash
git clone https://github.com/Jairagui/Obsidian.git
cd Obsidian
```

### 2. Configurar el backend
```bash
cd backend
npm install
cp .env.example .env
```
Edita el archivo `.env` con tus credenciales de MongoDB, JWT y Google OAuth.

### 3. Crear el admin (opcional)
```bash
npm run seed
```
Esto crea un usuario administrador usando las variables `ADMIN_EMAIL` y `ADMIN_PASSWORD` del `.env`.

### 4. Correr el backend
```bash
npm run dev
```

### 5. Configurar y correr el frontend
```bash
cd ../frontend
npm install
npm run dev
```

La app corre en `http://localhost:5173` y el API en `http://localhost:3000`.

## Variables de Entorno
Revisa `backend/.env.example` para ver todas las variables necesarias.

## Tests
```bash
cd frontend
npm test
```

## Tecnologias
- React 19 + TypeScript + Vite
- Node.js + Express + TypeScript
- MongoDB + Mongoose
- JWT + bcrypt + Passport (Google OAuth)
- Socket.io (actualizaciones en tiempo real)
- Multer (subida de imágenes)
- Vitest + Testing Library
 módulo de compra o venta ni interacción entre usuarios.