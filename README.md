# 🛍️ E-commerce App

Este es un monorepo para una aplicación de comercio electrónico de Arquitectura cliente-servidor, construida con TypeScript, React y Tailwind en el front, en el back con node JS y una base de datos mySQL. La estructura del repositorio se dividió en dos partes para facilitar el desarrollo e implementación de scripts, permitiendo la ejecución de ambos puertos como servidores desacoplados, lo que optimizó el flujo de trabajo y la eficiencia del proyecto.

* Se implementó la autenticación JWT y utilicé zustand para la gestión de estado del carrito de compras etc.
* Este proyecto me permitió unificar mis conocimientos sobre bases de datos y creación de APIs.

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
│   ├── services/        # Servicios API (HTTP)
│   ├── hooks/
│   └── components/
│       └── products/
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
---
## Demos con la sandbox de Stripe para los métodos de pago
### Validación de métodos de pago
- Campos vacíos

https://github.com/user-attachments/assets/3c35d37c-b865-4a11-9b9e-abc2753c7c10

- Tarjeta rechazada

https://github.com/user-attachments/assets/f93c43c1-0756-4784-beba-5dbd2332fa0d

- Error al procesar una tarjeta

https://github.com/user-attachments/assets/b0f2f003-96a6-4ab2-8693-85a0954e2d34

### Métodos de pago correctos
- Captcha y conexión con servicios externos

https://github.com/user-attachments/assets/a0cbf724-11b3-41a9-9eb6-ef04f63844af

- Tarjeta válida

https://github.com/user-attachments/assets/6cf174fb-d5aa-4db0-95f1-52f6fb17e480

## Implementación de un modelo de OpenIA para chatbot

https://github.com/user-attachments/assets/77767ae7-5620-426f-b46b-2470ee044c0b

## Pruebas e2e con Cypress 
### Panel de gestión de órdenes y sus estados

https://github.com/user-attachments/assets/190886ad-a420-4ff1-9399-51adf806eac9

### Demos de funcionalidades
- Vista inicial de productos, sin inicio de sesión

- Iniciar sesión como admin e ingresar al panel de gestión de productos

https://github.com/user-attachments/assets/159e1ba8-3b0c-41bd-be1c-202127eebccc

- Como administrador puedo agregar productos a la base de datos

https://github.com/user-attachments/assets/1d475e20-f772-45bc-9d55-cceaeff10eea

- Como administrador puedo editar la información de tal producto

https://github.com/user-attachments/assets/3c8c3bd6-405c-4a4a-94bd-ab54750e36de

- Como administrador puedo eliminar tal producto de la base de datos

https://github.com/user-attachments/assets/e65f2764-00e9-4e16-b1af-93affa87a37f

- Como cualquier usuario que haya iniciado sesión puede acceder a la funcionalidad del carrito de compras

https://github.com/user-attachments/assets/a60dc2ce-201a-4f95-a4e3-71449f42f75c
