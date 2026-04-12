# 🍔 Food Store - Sistema de Gestión de Pedidos

![Estado](https://img.shields.io/badge/Estado-Fase_Frontend_(TypeScript)-orange)
![Tecnologías](https://img.shields.io/badge/Tecnologías-TypeScript_|_Vite_|_CSS3-blue)
![Materia](https://img.shields.io/badge/Materia-Programación_III_(UTN)-success)

## 📌 Descripción

**Food Store** es un sistema integral de e-commerce orientado a la venta de comida, desarrollado como Proyecto Integrador para la materia Programación III de la Universidad Tecnológica Nacional (UTN). El sistema resuelve la necesidad de digitalizar la toma de pedidos, ofreciendo una experiencia fluida tanto para los clientes como para los administradores del negocio.

Para los clientes, la aplicación ofrece un catálogo dinámico para explorar productos, gestionar un carrito de compras y hacer seguimiento de sus pedidos. Para la administración, provee un panel de control seguro para gestionar el inventario (CRUD de productos y categorías) y el estado de las ventas.

Actualmente, el proyecto se encuentra transitando la Unidad 4, donde se ha migrado la interfaz de Vanilla JavaScript a un entorno moderno con **Vite y TypeScript**, implementando además un sistema de seguridad y roles del lado del cliente simulado con `localStorage`.

## ✨ Características Principales (Features)

* **Autenticación de Usuarios:** Sistema de Login y Registro con distinción de roles (Administrador y Cliente).
* **Protección de Rutas (Guards):** Restricción de acceso al Panel de Administración únicamente para usuarios con permisos.
* **Catálogo Dinámico:** Visualización de productos renderizados dinámicamente mediante manipulación del DOM.
* **Panel de Administración (CRUD):** Interfaz preparada para la futura gestión integral de Categorías, Productos y Pedidos.
* **Diseño Responsivo:** Maquetación fluida utilizando CSS Grid y Flexbox.

## 🏗️ Arquitectura y Tecnologías

* **Frontend:** TypeScript, HTML5 Semántico, CSS3 (Variables, Grid, Flexbox).
* **Herramientas de Build:** Vite, Node.js.
* **Gestor de Paquetes:** pnpm.
* **Backend:** 🚧 *En desarrollo* (Próximamente: Java Spring Boot 3.x).
* **Base de Datos:** 🚧 *En desarrollo* (Próximamente: PostgreSQL / H2).

## 📋 Requisitos Previos (Prerequisites)

Para ejecutar este proyecto en un entorno local, es necesario contar con:
* [Node.js](https://nodejs.org/) (v18 o superior).
* [pnpm](https://pnpm.io/es/) instalado globalmente (`npm install -g pnpm`).
* Git para el control de versiones.

## 🚀 Instalación y Configuración

Sigue estos pasos para levantar el servidor de desarrollo localmente:

1. Clona el repositorio en tu máquina:
   ```bash
   git clone https://github.com/Tonga26/Food-Store_TPI_Programacion-3.git

2. Ingresa al directorio del frontend:
   ```bash
   cd "Food-Store_TPI_Programacion-3/frontend"

3. Instala las dependencias del proyecto:
   ```bash
   pnpm install

4. Levanta el servidor de desarrollo:
   ```bash
   pnpm dev

5. La aplicación estará disponible en http://localhost:5173.

## 📖 Documentación de la API

🚧 En desarrollo. Esta sección se completará en las próximas fases del proyecto cuando se integre el backend con Spring Boot y se configure Swagger/OpenAPI.

## 🧪 Testing

🚧 En desarrollo. Las pruebas unitarias y de integración se implementarán en los próximos Sprints.

## 📁 Estructura de Carpetas
```text
📦 PROYECTO FOOD STORE
 ┣ 📂 frontend/
 ┃ ┣ 📂 public/          # Archivos estáticos públicos
 ┃ ┣ 📂 src/
 ┃ ┃ ┣ 📂 assets/        # Imágenes y recursos multimedia
 ┃ ┃ ┣ 📂 css/           # Hojas de estilo modulares
 ┃ ┃ ┣ 📂 pages/         # Vistas de la aplicación separadas por dominio
 ┃ ┃ ┃ ┣ 📂 admin/       # Panel de control (admin.html, home.ts)
 ┃ ┃ ┃ ┣ 📂 auth/        # Autenticación (login y registro con sus .html y .ts)
 ┃ ┃ ┃ ┗ 📂 client/      # Tienda principal y Catálogo
 ┃ ┃ ┣ 📂 types/         # Interfaces TypeScript (IUser.ts, Rol.ts)
 ┃ ┃ ┣ 📂 utils/         # Lógica reutilizable (auth, data, localStorage, navigate)
 ┃ ┃ ┣ 📜 main.ts        # Archivo principal de TypeScript
 ┃ ┃ ┗ 📜 style.css      # Estilos globales base
 ┃ ┣ 📜 .gitignore       # Archivos ignorados por Git
 ┃ ┣ 📜 index.html       # Entry point principal (Redirección de Vite)
 ┃ ┣ 📜 package.json     # Dependencias de Node.js y scripts
 ┃ ┣ 📜 tsconfig.json    # Configuración del compilador TypeScript
 ┃ ┣ 📜 vite.config.ts   # Configuración del servidor de desarrollo Vite
 ┃ ┗ 📜 README.md        # Documentación del proyecto
```

## 🗺️ Roadmap / Próximos Pasos

[x] Fase 1: Maquetación estática (HTML/CSS).

[x] Fase 2: Interactividad básica y DOM con Vanilla JS.

[x] Fase 3: Migración a Vite + TypeScript.

[X] Fase 4: Implementar Tipado Fuerte (Interfaces) y protección de rutas.

[ ] Sprint Back-1: Configuración de Spring Boot, Entidad Base y Repositorios.

[ ] Sprint Back-2: Desarrollo de API REST para Usuarios y Productos.

[ ] Sprint Final: Integración Frontend-Backend y gestión de Carrito/Pedidos.

## ✉️ Autor y Desarrollador: Gastón Giorgio

Institución: Universidad Tecnológica Nacional (UTN) - Tecnicatura Universitaria en Programación.
