# 🍔 Food Store - Sistema de Gestión de Pedidos

![Estado](https://img.shields.io/badge/Estado-Evaluación_1_(TypeScript)-orange)
![Tecnologías](https://img.shields.io/badge/Tecnologías-TypeScript_|_Vite_|_CSS3-blue)
![Materia](https://img.shields.io/badge/Materia-Programación_III_(UTN)-success)

## 📌 Descripción

**Food Store** es un sistema integral de e-commerce orientado a la venta de comida, desarrollado para la materia Programación III. El sistema resuelve la necesidad de digitalizar la toma de pedidos, ofreciendo una experiencia fluida tanto para los clientes como para los administradores del negocio.

Esta iteración del proyecto corresponde a la Evaluación 1, cuyo objetivo es evolucionar la interfaz hacia una aplicación frontend dinámica e interactiva. Para lograrlo, la plataforma incorpora mecánicas esenciales de e-commerce como el manejo de un carrito de compras local, exploración avanzada del catálogo mediante búsqueda y filtros, consolidando el uso y buenas prácticas de HTML, CSS, JavaScript y TypeScript.

## ✨ Características Principales (Features)

* **Catálogo dinámico:** Visualización de productos renderizados dinámicamente mediante manipulación del DOM.
* **Búsqueda integrada:** Capacidad de buscar productos por nombre o coincidencia parcial dentro de la vista principal del catálogo.
* **Filtrado por categorías:** Visualización exclusiva de productos según la categoría seleccionada desde el menú lateral.
* **Carrito de compras persistente:** Posibilidad de agregar productos al carrito manteniendo la información guardada en el navegador mediante el uso de `localStorage`.
* **Cálculo de totales:** Visualización automática del total acumulado y subtotales en la vista del carrito.
* **Autenticación y guards:** Sistema de Login y Registro con distinción de roles (Administrador y Cliente), protegiendo las rutas de administración.

## 🏗️ Arquitectura y Tecnologías

* **Frontend:** TypeScript, HTML5 Semántico, CSS3.
* **Herramientas de Build:** Vite.
* **Gestor de Paquetes:** pnpm.
* **Restricciones Técnicas:** Desarrollo nativo sin utilización de frameworks externos (React, Angular, etc.).
* **Backend:** 🚧 *En desarrollo* (Próximamente: Java Spring Boot 3.x).
* **Base de Datos:** 🚧 *En desarrollo* (Próximamente: PostgreSQL / H2).

## 📋 Requisitos Previos (Prerequisites)

Para ejecutar este proyecto en un entorno local, es necesario contar con:
* [Node.js](https://nodejs.org/) (v18 o superior).
* [pnpm](https://pnpm.io/es/) instalado globalmente. Si no lo tienes, puedes instalarlo ejecutando: 

   `npm install -g pnpm`
* Git para el control de versiones.

## 🚀 Instalación y Configuración

Sigue estos pasos para levantar el servidor de desarrollo localmente y probar la aplicación:

```bash
# 1. Clona el proyecto en tu máquina local apuntando al repositorio público
git clone https://github.com/Tonga26/Food-Store_TPI_Programacion-3.git

# 2. Navega hacia la carpeta principal del frontend donde reside el proyecto Vite
cd Food-Store_TPI_Programacion-3/frontend

# 3. Descarga e instala todas las dependencias definidas en package.json usando pnpm
pnpm install

# 4. Inicia el servidor de desarrollo local de Vite
pnpm dev
```

El servidor de desarrollo estará disponible en http://localhost:5173.

## Instrucciones para probar la App: 

- Búsqueda y Filtros: Ingresa al catálogo principal y utiliza la barra de texto superior para buscar productos por nombre. Alternativamente, utiliza el menú lateral para aislar productos de una categoría específica.

-  Carrito Persistente: Haz clic en el botón de agregar en cualquier tarjeta de producto. Dirígete a la vista del carrito para revisar las cantidades, subtotales y el precio total calculado. Puedes recargar la pestaña del navegador para corroborar que la selección sigue guardada gracias al localStorage.

## 📖 Documentación de la API

🚧 En desarrollo. Esta sección se completará en las próximas fases del proyecto cuando se integre el backend con Spring Boot y se configure Swagger/OpenAPI.

## 🧪 Testing

🚧 En desarrollo. Las pruebas unitarias y de integración se implementarán en los próximos Sprints.

## 📁 Estructura de Carpetas

Las páginas y lógica del parcial están ubicadas dentro del directorio src/ respetando la estructura modular requerida:
```
📦 PROYECTO FOOD STORE
 ┣ 📂 frontend/
 ┃ ┣ 📂 public/          # Archivos estáticos
 ┃ ┣ 📂 src/
 ┃ ┃ ┣ 📂 assets/        # Imágenes y recursos multimedia
 ┃ ┃ ┣ 📂 css/           # Hojas de estilo modulares
 ┃ ┃ ┣ 📂 pages/         # Vistas de la aplicación
 ┃ ┃ ┃ ┣ 📂 admin/       # Panel de control (admin.html, home.ts, categories, orders, products)
 ┃ ┃ ┃ ┣ 📂 auth/        # Autenticación (login.html, register.html)
 ┃ ┃ ┃ ┣ 📂 client/      # Vistas específicas del cliente (próxmimamente)
 ┃ ┃ ┃ ┗ 📂 store/       # Catálogo principal (home), carrito (cart) y detalles 
 ┃ ┃ ┣ 📂 types/         # Interfaces TS (ICartItem, ICategory, IProduct, IUser, Rol)
 ┃ ┃ ┗ 📂 utils/         # Lógica reutilizable (auth, cart, data, localStorage, navigate)
 ┃ ┣ 📜 index.html       # Entry point principal
 ┃ ┣ 📜 package.json     # Dependencias y scripts
 ┃ ┣ 📜 tsconfig.json    # Configuración de TypeScript
 ┃ ┗ 📜 vite.config.ts   # Configuración de Vite (Contiene el registro multipage rollupOptions) 
 ┣ 📜 .gitignore
 ┗ 📜 README.md
 ```

## 🗺️ Roadmap / Próximos Pasos

[x] Fase 1: Maquetación estática (HTML/CSS).

[x] Fase 2: Interactividad básica y DOM con Vanilla JS.

[x] Fase 3: Migración a Vite + TypeScript.

[x] Evaluación 1: Carrito de compras con persistencia, barra de búsqueda y filtros por categoría.

[ ] Sprint Back-1: Configuración de Spring Boot, Entidad Base y Repositorios.

[ ] Sprint Back-2: Desarrollo de API REST para Usuarios y Productos.

[ ] Sprint Final: Integración Frontend-Backend y gestión de Carrito/Pedidos reales.

## ✉️ Contacto y Autor

Gastón Giorgio

Institución: Universidad Tecnológica Nacional (UTN) - Tecnicatura Universitaria en Programación.
