# 🛍️ E-commerce App

Este es un monorepo para una aplicación de comercio electrónico construida con TypeScript, React y Tailwind. El repositorio está dividido en dos para facilitar el desarrollo e impleentación de scripts que me perrmiten ejecutar ambos puertos como servidores desacoplados.

## 🧱 Estructura del proyecto

## Arquitectura cliente-servidor

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
pnpm install

---

## 🚀 Iniciar en local
   Para iniciar el frontend y backend a la vez:

   ```bash
   pnpm --filter '**' dev
   ```

## Demos
   Vista inicial de productos, sin inicio de sesión    
https://github.com/user-attachments/assets/69b20603-84c7-4a08-a9f6-9669970d4a76



