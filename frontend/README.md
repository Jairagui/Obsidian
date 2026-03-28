# OBSIDIAN - Frontend 

Este módulo contiene la interfaz de usuario de la Bóveda Digital, desarrollada con **React, TypeScript y Vite**.

## Estructura de Carpetas
Para mantener un código limpio y escalable, dividimos la arquitectura de la siguiente manera:
* `src/components/`: Para elementos reutilizables de la interfaz.
* `src/pages/`: Las vistas completas de la aplicación Login, Registro, Bóveda.
* `src/routes/`: Configuración del enrutamiento usando react-router-dom.
* `src/interfaces/`: Tipado estricto de TypeScript para los modelos de datos .
* `src/services/`: Lógica para consumir datos. 

## Requisitos y Dependencias
* Node.js instalado.
* React Router Dom para la navegación SPA.

## ¿Cómo levantar el proyecto localmente?
**Nota importante sobre el entorno:** En el ecosistema de Node.js/React no es necesario crear ni activar un ambiente virtual 
Sigue estos pasos en tu terminal:

1. Ubícate en esta carpeta:
   ```bash
   cd frontend
   
2. Instala las dependencias necesarias:
  ```bash
     npm install
  ```

3. Levanta el servidor de desarrollo:
```bash
     npm run dev
  ```