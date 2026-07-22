# 🛍️ E-commerce App

Este es un monorepo para una aplicación de comercio electrónico de Arquitectura cliente-servidor, construida con TypeScript, React y Tailwind en el front, en el back con node JS y una base de datos mySQL. El repositorio está dividido en dos para facilitar el desarrollo e implementación de scripts que me permiten ejecutar ambos puertos como servidores desacoplados.

• Diseñé y construí una plataforma de comercio electrónico. Sigue una arquitectura cliente-servidor. Este enfoque me permitió
construir una interfaz de usuario dinámica con React y Tailwind, mientras que el backend se desarrolló utilizando Node.js y una
base de datos MySQL.
• Se implementó la autenticación JWT y utilicé zustand para la gestión de estado del carrito de compras etc.
• Este proyecto me permitió unificar mis conocimientos sobre bases de datos y el uso de APIs, y está disponible con
demostraciones en video en mi GitHub jabuitroon, lo que resalta mi capacidad para gestionar y presentar proyectos de manera
efectiva.
• La estructura del repositorio se dividió en dos partes para facilitar el desarrollo e implementación de scripts, permitiendo la
ejecución de ambos puertos como servidores desacoplados, lo que optimizó el flujo de trabajo y la eficiencia del proyecto.
• Éste es un stack base, pero con la robustez que se obtiene al utilizar el tipado fuerte de TypeScript para tener tener en cuenta la
escalabilidad y la mantenibilidad del código.

## 🧱 Estructura del proyecto
```plaintext
ecommerce/
├── backend/
│ ├── node_modules/
│ ├── package.json
│ ├── pnpm-lock.yaml
│ ├── productos.json
│ ├── server.ts
│ └── tsconfig.json
│
├── frontend/
│ ├── public/
│ ├── src/
│ ├── .gitignore
│ ├── README.md
│ ├── eslint.config.js
│ ├── index.html
│ ├── package.json
│ ├── pnpm-lock.yaml
│ ├── postcss.config.mjs
│ ├── tailwind.config.js
│ ├── tsconfig.app.json
│ ├── tsconfig.json
│ ├── tsconfig.node.json
│ └── vite.config.ts
```

## 🚀 Requisitos

Antes de comenzar, asegúrate de tener instalados:

- **Node.js** `>=18.x`
- **pnpm** `>=8.x`

---

## 📦 Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/Jabuitroon/e-commerce.git
   cd ecommerce
   
2. Instala las dependencias:
   ```bash
   pnpm install
---
## 🚀 Iniciar en local
   Para iniciar el frontend y backend a la vez:

   ```bash
   pnpm --filter '**' dev
   ```

## Demos
- Vista inicial de productos, sin inicio de sesión

https://github.com/user-attachments/assets/69b20603-84c7-4a08-a9f6-9669970d4a76

- Iniciar sesión como admin e ingresar al panel de gestión de productos

https://github.com/user-attachments/assets/159e1ba8-3b0c-41bd-be1c-202127eebccc

- Como administrador puedo agregar productos a la base de datos

https://github.com/user-attachments/assets/1d475e20-f772-45bc-9d55-cceaeff10eea

- Como administrador puedo editar la información de tal producto

https://github.com/user-attachments/assets/3c8c3bd6-405c-4a4a-94bd-ab54750e36de

- Como administrador puedo eliminar tal producto de la base de datos

https://github.com/user-attachments/assets/e65f2764-00e9-4e16-b1af-93affa87a37f

- Como cualquier usuario que haya iniciado sesión puede acceder a la fucionalidad del carrito de compras

https://github.com/user-attachments/assets/a60dc2ce-201a-4f95-a4e3-71449f42f75c


  


