# 🍔 Food Store - Sistema de E-Commerce y Gestión de Pedidos

![Estado](https://img.shields.io/badge/Estado-Finalizado-success)
![Materia](https://img.shields.io/badge/Materia-Programación_III_(UTN)-blue)
![Frontend](https://img.shields.io/badge/Frontend-Vite_|_TypeScript_|_CSS3-f1c40f)
![Backend](https://img.shields.io/badge/Backend-Java_|_Spring_Boot_3-6db33f)
![Base de Datos](https://img.shields.io/badge/Database-MySQL-4479A1)
![Seguridad](https://img.shields.io/badge/Security-Spring_Security_|_JWT-4A4A55?logo=springsecurity&logoColor=white)

## 📌 Descripción

**Food Store** es un sistema integral de e-commerce Full-Stack orientado a la venta de comida rápida, desarrollado como proyecto final para la materia Programación III. 

El sistema resuelve la necesidad de digitalizar la toma de pedidos, ofreciendo una experiencia fluida tanto para los clientes (catálogo, filtros cruzados, carrito de compras) como para los administradores del negocio (panel de control, métricas en vivo, gestión de stock y estados de pedidos). Esta aplicación opera bajo una arquitectura API RESTful **Stateless**, separando completamente las responsabilidades del cliente (Frontend) y el servidor (Backend), y protegiendo los recursos mediante un sistema robusto de autenticación y autorización basado en tokens.

## ✨ Características Principales (Features)

### 🔒 Seguridad y Arquitectura (Novedad)
* **Seguridad de Grado Empresarial:** Implementación de Spring Security 6 con un modelo arquitectónico sin estado (Stateless). 
* **Autenticación mediante JWT:** Emisión, validación e intercepción de JSON Web Tokens a través de filtros personalizados (`OncePerRequestFilter`).
* **Control de Acceso Basado en Roles (RBAC):** Protección estricta de endpoints y métodos HTTP, asegurando el principio de mínimo privilegio (Administrador vs. Cliente).
* **Cifrado Criptográfico:** Protección de credenciales en base de datos utilizando el algoritmo de hashing **BCrypt**.
* **Patrón Adaptador y Fetch Wrapper:** En el frontend, las peticiones a la API están centralizadas en una utilidad asíncrona (`apiFetch`) que inyecta dinámicamente los tokens Bearer, adaptando la respuesta del servidor para proteger la integridad visual de la interfaz.

### 🛒 Portal del Cliente (Frontend)
* **Catálogo Dinámico y Buscador Avanzado:** Motor de búsqueda combinado que permite filtrar simultáneamente por texto, categoría y criterios de ordenamiento (precio, A-Z).
* **Carrito de Compras Persistente:** Gestión del estado del carrito mediante `localStorage`, calculando subtotales y costos de envío logísticos.
* **Historial de Pedidos:** Vista dedicada para que el cliente haga seguimiento en tiempo real del estado de sus órdenes.

### ⚙️ Panel de Administración (Backend/Admin)
* **Dashboard Estadístico:** Panel de métricas procesadas en vivo mediante algoritmos de reducción (`reduce`), mostrando inventario operativo y agrupación dinámica de pedidos.
* **Gestión de Inventario (CRUD):** Control total sobre la base de datos de productos y categorías.
* **Máquina de Estados de Pedidos:** Sistema de actualización de estados transaccionales con UI semántica (badges dinámicos).
* **Seeders Automáticos:** Inyección automática de usuarios, categorías y productos de prueba al levantar el servidor.

---

## 🏗️ Arquitectura y Tecnologías

### Frontend
* ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white) **TypeScript:** Tipado estricto para mayor robustez y prevención de errores en tiempo de compilación.
* ![Vite](https://img.shields.io/badge/Vite-B73BFE?style=flat&logo=vite&logoColor=FFD62E) **Vite:** Herramienta de build y empaquetado de alto rendimiento.
* ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white) **HTML5 Semántico & CSS3 puro** (Diseño responsive y modular sin frameworks de UI).

### Backend & Base de Datos
* ![Java](https://img.shields.io/badge/Java-ED8B00?style=flat&logo=openjdk&logoColor=white) **Java 21+**
* ![Spring Boot](https://img.shields.io/badge/Spring_Boot_3-6DB33F?style=flat&logo=spring-boot&logoColor=white) **Spring Boot:** Framework principal (Spring Web, Spring Data JPA).
* ![Spring Security](https://img.shields.io/badge/Spring_Security-6DB33F?style=flat&logo=springsecurity&logoColor=white) **Spring Security 6 & JWT:** Autenticación y Autorización.
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

## 📋 Requisitos Previos (Prerequisites)

Para ejecutar este proyecto en un entorno local, necesitas tener instalado:
1. **[Node.js](https://nodejs.org/)** (v18 o superior) y **[pnpm](https://pnpm.io/es/)** (`npm install -g pnpm`).
2. **Java Development Kit (JDK)** versión 21 o superior.
3. **Servidor MySQL / MariaDB:** Puedes levantar el motor utilizando:
   * **Stacks Locales:** [XAMPP](https://www.apachefriends.org/es/index.html) o [Laragon](https://laragon.org/).
   * **Instalación Nativa:** [MySQL Community Server](https://dev.mysql.com/downloads/mysql/).
   * **Contenedores (Docker):** `docker run --name foodstore-mysql -e MYSQL_ALLOW_EMPTY_PASSWORD=yes -p 3306:3306 -d mysql`.
4. **IDE recomendado:** IntelliJ IDEA Ultimate (Backend) y VS Code (Frontend).

---

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio
```
git clone https://github.com/Tonga26/Food-Store_TPI_Programacion-3.git

cd Food-Store_TPI_Programacion-3
```
### 2. Configuración de la Base de Datos (Backend)
1. Inicia tu servidor MySQL / MariaDB según el entorno elegido.

2. Crea la base de datos vacía: Crea un esquema llamado foodstore.

3. Abre el proyecto Backend en tu IDE.

4. Verifica las credenciales: Revisa src/main/resources/application.properties y ajusta spring.datasource.username y spring.datasource.password según tu entorno local (por defecto: root sin contraseña).

5. Ejecuta la aplicación Spring Boot: Hibernate generará automáticamente la estructura DDL en la base de datos.
```
💡 Nota Operativa: El componente UserLoad (Seeder) inyectará automáticamente usuarios encriptados, categorías y productos para pruebas.
```

### 3. Ejecución del Frontend
Abre una nueva terminal en la carpeta del frontend e inicia Vite:
```
cd frontend
pnpm install
pnpm dev
```
El cliente estará disponible en http://localhost:5173

## 🕹️ Instrucciones para probar la App
El sistema está protegido mediante Spring Security. Para realizar operaciones de escritura, deberás iniciar sesión con los usuarios generados por el Seeder:

- Acceso Administrador:

   - Email: admin@admin

   - Clave: 123456

   - Permisos: Acceso al Dashboard, CRUD completo de Productos/Categorías, gestión global de pedidos.

- Acceso Cliente

   - Email: user@user

   - Clave: 123456

   - Permisos: Realizar compras (Checkout), visualizar historial de pedidos propios.

Flujo E2E recomendado:

1- Ingresa al catálogo y agrega productos al carrito sin iniciar sesión.

2- Intenta proceder al pago (El sistema exigirá autenticación).

3- Inicia sesión como Cliente y finaliza la compra.

4- Cierra sesión, ingresa como Administrador, dirígete al panel y cambia el estado del pedido a "Confirmado".

## 📖 Documentación de la API
La API RESTful está documentada con OpenAPI 3. Con el servidor corriendo, puedes acceder a la interfaz interactiva para inspeccionar los endpoints asegurados:

🔗 Swagger UI: http://localhost:8080/swagger-ui/index.html

## 🧪 Testing y QA
El proyecto superó rigurosas pruebas de seguridad (Negative Testing) comprobando:

- Bloqueo de peticiones anónimas a endpoints protegidos (403 Forbidden).

- Prevención de escalada de privilegios (Control RBAC).

- Principio Fail-Secure ante la falsificación o manipulación de firmas JWT en el cliente.

- Integración fluida (Happy Path) del ciclo transaccional.

## 📁 Estructura General del Proyecto

### ⚙️ Backend (Spring Boot)
```
📦 foodstore-backend
 ┣ 📂 src/main/java/com/utn/foodstore/
 ┃ ┣ 📂 config/        # Configuraciones globales y Seeders
 ┃ ┣ 📂 controller/    # Endpoints REST protegidos
 ┃ ┣ 📂 dto/           # Data Transfer Objects
 ┃ ┣ 📂 enums/         # Enumeraciones tipadas
 ┃ ┣ 📂 exception/     # Manejador global de excepciones
 ┃ ┣ 📂 model/         # Entidades de dominio (JPA)
 ┃ ┣ 📂 repository/    # Interfaces Spring Data JPA
 ┃ ┣ 📂 security/      # Configuración JWT, Filtros y Authentication Providers
 ┃ ┗ 📂 service/       # Lógica de negocio transaccional
 ┣ 📂 src/main/resources/
 ┃ ┗ 📜 application.properties
 ┗ 📜 build.gradle
```

### 🎨 Frontend (Vite + TypeScript)
```
📦 frontend
 ┣ 📂 src/
 ┃ ┣ 📂 assets/        # Recursos multimedia
 ┃ ┣ 📂 css/           # Hojas de estilo modulares (BEM)
 ┃ ┣ 📂 pages/         # Vistas sectorizadas (admin, auth, client, store)
 ┃ ┣ 📂 types/         # Interfaces estandarizadas (TypeScript)
 ┃ ┗ 📂 utils/         # 🔐 Lógica Core (apiFetch JWT Adapter, LocalStorage)
 ┣ 📜 index.html       # Entry point principal
 ┗ 📜 vite.config.ts   # Configuración de compilación
```

## 🗺️ Roadmap Completado
[x] Fase 1: Maquetación estática (HTML/CSS) y diseño de UI/UX.

[x] Fase 2: Lógica de carrito de compras y manipulación del DOM.

[x] Fase 3: Migración a Vite y tipado estricto con TypeScript.

[x] Fase 4: Modelado de Base de Datos y desarrollo de API REST (Spring Boot).

[x] Fase 5: Integración E2E (Frontend - Backend) y consumo dinámico.

[x] Fase 6: Implementación de Seguridad (Spring Security 6, JWT, BCrypt) y refactorización arquitectónica para sesiones Stateless.

## 🧠 Aprendizajes y Habilidades Adquiridas (Key Takeaways)

El desarrollo de Food Store representó un desafío integral que me permitió consolidar conocimientos tanto en el ecosistema Java como en el desarrollo Frontend nativo. Entre los aprendizajes técnicos más destacables se encuentran:

* **Arquitectura de Seguridad:** Comprendí profundamente el ciclo de vida de una petición HTTP al implementar **Spring Security 6**. Pasé de tener controladores públicos a configurar un *Security Filter Chain* desde cero, manejando políticas CORS, deshabilitando CSRF para entornos de API REST y gestionando sesiones **Stateless** (sin estado).

* **Gestión de Identidad (JWT):** Aprendí a construir e interceptar JSON Web Tokens mediante la implementación de un `OncePerRequestFilter`. Comprendí la importancia del cifrado criptográfico con BCrypt y el principio *Fail-Secure* ante la manipulación de credenciales en el lado del cliente.

* **Integración E2E y Depuración:** Desarrollé una fuerte capacidad de *troubleshooting* (resolución de problemas) al conectar el Frontend con el Backend. Superé los clásicos errores `403 Forbidden` y `CORS preflight` analizando las cabeceras de red y centralizando la inyección del token mediante un *Fetch Wrapper* (Patrón Adaptador).

* **Single Source of Truth (Única Fuente de Verdad):** Refactoricé el manejo del `localStorage` en TypeScript para evitar los "Magic Strings", centralizando la sesión del usuario en un único módulo para garantizar la consistencia en toda la aplicación.

* **Buenas Prácticas y Git Flow:** Adopté el uso de *Conventional Commits* (commits atómicos) y el manejo de ramas (*feature branches*) para aislar el desarrollo de nuevas características (como el módulo de seguridad) antes de integrarlas a la rama principal, simulando un entorno de trabajo corporativo.

## ✉️ Contacto y Autor
👨‍💻 Gastón Armando Giorgio

💻 Estudiante de la Tecnicatura Universitaria en Programación.

🏛️ Universidad Tecnológica Nacional (UTN).

📍 Mendoza, Argentina.
