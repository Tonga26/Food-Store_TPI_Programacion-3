# 🍔 Food Store - Sistema de E-Commerce y Gestión de Pedidos

![Estado](https://img.shields.io/badge/Estado-Finalizado-success)
![Materia](https://img.shields.io/badge/Materia-Programación_III_(UTN)-blue)
![Frontend](https://img.shields.io/badge/Frontend-Vite_|_TypeScript_|_CSS3-f1c40f)
![Backend](https://img.shields.io/badge/Backend-Java_|_Spring_Boot_3-6db33f)
![Base de Datos](https://img.shields.io/badge/Database-MySQL-4479A1)

## 📌 Descripción

**Food Store** es un sistema integral de e-commerce Full-Stack orientado a la venta de comida rápida, desarrollado como proyecto final para la materia Programación III. 

El sistema resuelve la necesidad de digitalizar la toma de pedidos, ofreciendo una experiencia fluida tanto para los clientes (catálogo, filtros cruzados, carrito de compras) como para los administradores del negocio (panel de control, métricas en vivo, gestión de stock y estados de pedidos). Esta aplicación opera bajo una arquitectura API RESTful, separando completamente las responsabilidades del cliente (Frontend) y el servidor (Backend).

## ✨ Características Principales (Features)

### 🛒 Portal del Cliente (Frontend)
* **Catálogo Dinámico y Buscador Avanzado:** Motor de búsqueda combinado que permite filtrar simultáneamente por texto, categoría y criterios de ordenamiento (precio, A-Z).
* **Carrito de Compras Persistente:** Gestión del estado del carrito mediante `localStorage`, calculando subtotales y costos de envío logísticos.
* **Historial de Pedidos:** Vista dedicada para que el cliente haga seguimiento en tiempo real del estado de sus órdenes (Pendiente, Confirmado, Entregado, etc.).

### ⚙️ Panel de Administración (Backend/Admin)
* **Dashboard Estadístico:** Panel de métricas procesadas en vivo mediante algoritmos de reducción (`reduce`), mostrando inventario operativo y agrupación dinámica de pedidos.
* **Gestión de Inventario (CRUD):** Control total sobre la base de datos de productos y categorías.
* **Máquina de Estados de Pedidos:** Sistema de actualización de estados transaccionales con UI semántica (badges dinámicos).
* **Autenticación y Guards:** Sistema de control de acceso por roles (Admin/User) protegiendo rutas y recursos estratégicos.
* **Seeders Automáticos:** Inyección automática de usuarios, categorías y productos de prueba al levantar el servidor.

---

## 🏗️ Arquitectura y Tecnologías

### Frontend
* ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white) **TypeScript:** Tipado estricto para mayor robustez.
* ![Vite](https://img.shields.io/badge/Vite-B73BFE?style=flat&logo=vite&logoColor=FFD62E) **Vite:** Herramienta de build súper rápida.
* ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white) **HTML5 Semántico & CSS3 puro** (Diseño responsive y modular sin frameworks de UI).

### Backend & Base de Datos
* ![Java](https://img.shields.io/badge/Java-ED8B00?style=flat&logo=openjdk&logoColor=white) **Java 21+**
* ![Spring Boot](https://img.shields.io/badge/Spring_Boot_3-6DB33F?style=flat&logo=spring-boot&logoColor=white) **Spring Boot:** Framework principal (Spring Web, Spring Data JPA).
* ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=mysql&logoColor=white) **MySQL / MariaDB:** Motor de base de datos relacional.
* ![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=flat&logo=swagger&logoColor=black) **OpenAPI (Swagger):** Documentación interactiva de la API.

---

## 📸 Capturas de Pantalla

| Catálogo de Tienda | Panel Administrativo |
| :---: | :---: |
| *![Tienda](./assets/tienda-principal.PNG)* | *![Admin](./assets/dashboard-admin.PNG)* |
| **Carrito y Checkout** | **Gestión de Pedidos** |
| *![Carrito](./assets/carrito.PNG)* | *![Pedidos](./assets/pedidos-admin.PNG)* |

---

## 🎥 Presentación en Video

[![Video Explicativo](https://img.shields.io/badge/Ver_Video_Explicativo-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtu.be/wq4uZYX408g)

---

## 📄 Documentación Académica y Técnica

Como parte de los entregables del proyecto, se elaboró un documento detallado que profundiza en el marco teórico, las decisiones de arquitectura (separación de responsabilidades, uso de DTOs, manejo de excepciones) y las soluciones a los desafíos técnicos encontrados durante los sprints de desarrollo.

[🔗 **Ver Informe Técnico de Food Store (PDF)**](https://drive.google.com/file/d/1Lf-PWcXKP7xMcTlBakD_45UftuBHfdpZ/view?usp=sharing)

---

## 📋 Requisitos Previos (Prerequisites)

Para ejecutar este proyecto en un entorno local, necesitas tener instalado:
1. **[Node.js](https://nodejs.org/)** (v18 o superior) y **[pnpm](https://pnpm.io/es/)** (`npm install -g pnpm`).
2. **Java Development Kit (JDK)** versión 21 o superior.
3. **Servidor MySQL / MariaDB:** Puedes levantar el motor de base de datos utilizando la alternativa que mejor se adapte a tu entorno:
   * **Entornos Empaquetados (Local):** Utilizando stacks como [XAMPP](https://www.apachefriends.org/es/index.html), [Laragon](https://laragon.org/) o WAMP.
   * **Instalación Nativa:** Descargando [MySQL Community Server](https://dev.mysql.com/downloads/mysql/) directamente en tu sistema operativo.
   * **Contenedores (Docker):** Desplegando una imagen oficial (`docker run --name foodstore-mysql -e MYSQL_ALLOW_EMPTY_PASSWORD=yes -p 3306:3306 -d mysql`).
   > *Nota: Para administrar y visualizar la base de datos, puedes emplear clientes gráficos como MySQL Workbench, DBeaver o phpMyAdmin.*
4. **IDE recomendado:** IntelliJ IDEA (Backend) y VS Code (Frontend).

---

## 🚀 Instalación y Configuración

Sigue estos pasos para levantar el entorno completo de forma local:

### 1. Clonar el repositorio
```bash
git clone https://github.com/Tonga26/Food-Store_TPI_Programacion-3.git

cd Food-Store_TPI_Programacion-3
```

### 2. Configuración de la Base de Datos (Backend)

1. **Inicia tu servidor MySQL / MariaDB:** Puedes levantar el motor de base de datos utilizando la alternativa que mejor se adapte a tu entorno:
   * **Stacks Locales (XAMPP / Laragon / WAMP):** Inicia los servicios correspondientes (MySQL/Apache) directamente desde su panel de control.
   * **Instalación Nativa:** Asegúrate de que el servicio de MySQL Community Server esté corriendo en segundo plano en tu sistema operativo.
   * **Contenedor Docker:** Si prefieres aislar la base de datos sin instalaciones locales, puedes desplegar una imagen oficial ejecutando:  
     `docker run --name foodstore-mysql -e MYSQL_ALLOW_EMPTY_PASSWORD=yes -p 3306:3306 -d mysql`

2. **Crea la base de datos vacía:** Abre tu cliente de administración gráfica preferido (phpMyAdmin, MySQL Workbench, DBeaver, TablePlus, etc.) y crea un esquema nuevo y vacío llamado **`foodstore`**. Este nombre coincide de manera estricta con la configuración de la propiedad `spring.datasource.url` en el backend.

3. **Abre el proyecto Backend en tu IDE:** Abre la carpeta del servidor utilizando tu entorno de desarrollo (IntelliJ IDEA Ultimate recomendado).

4. **Verifica las credenciales de acceso:** Revisa el archivo `src/main/resources/application.properties` y corrobora que las propiedades de conexión se correspondan con los parámetros de tu entorno local:
   * En entornos empaquetados como XAMPP o Laragon, el usuario predeterminado es `root` con la contraseña vacía (`spring.datasource.password=`).
   * En instalaciones nativas o contenedores personalizados de Docker, ajusta el usuario y la contraseña según las credenciales que hayas definido en tu servidor local.

5. **Ejecuta la aplicación Spring Boot:** Al inicializar el servidor por primera vez, las herramientas de persistencia generarán automáticamente la estructura del esquema de tablas en la base de datos.
   > 💡 **Nota Operativa:** El sistema cuenta con un componente `UserLoad` (Seeder) integrado. Durante el proceso de arranque, inyectará automáticamente en tu base de datos 2 usuarios de prueba (un Administrador y un Cliente), 6 categorías comerciales y más de 20 productos de catálogo listos para ser consumidos desde el frontend.

### 3. Ejecución del Frontend
Abre una nueva terminal, navega a la carpeta del frontend e inicia el servidor de Vite:
```
cd frontend
pnpm install
pnpm dev
```
El cliente estará disponible en http://localhost:5173

## 🕹️ Instrucciones para probar la App
- **Catálogo Integrado:** Al ingresar a la URL de Vite, verás la tienda cargada con los datos provenientes de la base de datos MySQL. Prueba la barra de búsqueda y los filtros laterales.

- **Ciclo de Compra:** Agrega productos al carrito, ve al detalle de compra y presiona "Proceder al Pago".

- **Inicio de Sesión:** Utiliza los usuarios generados por el Seeder de Spring Boot para acceder a funciones específicas.

- **Panel Admin:** Inicia sesión con el usuario Administrador para acceder al Dashboard. Prueba modificar el estado de un pedido (ej. de "Pendiente" a "Confirmado") y observa cómo se actualizan las métricas y los colores semánticos automáticamente.

## 📖 Documentación de la API
La API RESTful está completamente documentada gracias a la integración con **OpenAPI 3**. Una vez que el backend esté corriendo en tu máquina local, puedes acceder a la interfaz interactiva de **Swagger** para probar los endpoints sin necesidad de Postman:

**🔗 Swagger UI**: http://localhost:8080/swagger-ui/index.html 

(El puerto puede variar según tu configuración de Spring Boot).

## 🧪 Testing
El proyecto fue diseñado y depurado utilizando metodologías de testeo manual End-to-End (E2E), validando las respuestas de los controladores mediante Postman durante la construcción de la API, y garantizando la resiliencia del flujo de usuario directamente desde las vistas del Frontend.

## 📁 Estructura General del Proyecto
### ⚙️ Backend (Spring Boot)
La API sigue una arquitectura de capas estándar:
```
📦 foodstore-backend
 ┣ 📂 src/main/java/com/utn/foodstore/
 ┃ ┣ 📂 config/        # Seguridad y Seeders (UserLoad)
 ┃ ┣ 📂 controller/    # Endpoints REST de la API
 ┃ ┣ 📂 dto/           # Objetos de Transferencia de Datos
 ┃ ┣ 📂 enums/         # Enumeraciones (Estado, FormaPago, Rol)
 ┃ ┣ 📂 exception/     # Manejo global de errores (Handler)
 ┃ ┣ 📂 model/         # Entidades de dominio (JPA)
 ┃ ┣ 📂 repository/    # Interfaces Spring Data JPA
 ┃ ┗ 📂 service/       # Lógica de negocio
 ┣ 📂 src/main/resources/
 ┃ ┗ 📜 application.properties # Configuración de BD y JPA
 ┗ 📜 build.gradle     # Dependencias del proyecto
```

### 🎨 Frontend (Vite + TypeScript)
El cliente fue estructurado modularmente por dominios:
```
📦 frontend
 ┣ 📂 public/          # Archivos estáticos
 ┣ 📂 src/
 ┃ ┣ 📂 assets/        # Imágenes y recursos multimedia
 ┃ ┣ 📂 css/           # Hojas de estilo puras y modulares
 ┃ ┣ 📂 pages/         # Vistas de la aplicación
 ┃ ┃ ┣ 📂 admin/       # Dashboard administrativo y CRUDS
 ┃ ┃ ┣ 📂 auth/        # Vistas de Login y Registro
 ┃ ┃ ┣ 📂 client/      # Historial de compras y pedidos
 ┃ ┃ ┗ 📂 store/       # Catálogo, carrito y detalle de productos
 ┃ ┣ 📂 types/         # Interfaces de tipado (TypeScript)
 ┃ ┗ 📂 utils/         # Lógica reutilizable (API Fetch, LocalStorage)
 ┣ 📜 index.html       # Entry point principal
 ┣ 📜 package.json     # Dependencias de npm/pnpm
 ┗ 📜 vite.config.ts   # Configuración de Vite (Multipage)
```

## 🗺️ Roadmap Completado
[x] Fase 1: Maquetación estática (HTML/CSS) y diseño de UI/UX.

[x] Fase 2: Lógica de carrito de compras, uso de LocalStorage y manipulación del DOM.

[x] Fase 3: Migración integral a Vite y tipado estricto con TypeScript.

[x] Fase 4: Modelado de Base de Datos y desarrollo de API REST con Spring Boot.

[x] Fase 5 (Sprint Final): Integración E2E (Frontend - Backend), consumo dinámico mediante fetch asíncrono, panel de métricas en vivo y despliegue del catálogo desde BD.

## ✉️ Contacto y Autor
👨‍💻 Gastón Armando Giorgio 

💻 Estudiante de la Tecnicatura Universitaria en Programación.

🏛️ Universidad Tecnológica Nacional (UTN).

📍 Mendoza, Argentina.

