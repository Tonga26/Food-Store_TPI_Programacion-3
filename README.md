# 🍔 Food Store - Sistema de Gestión de Pedidos

![Estado del Proyecto](https://img.shields.io/badge/Estado-En_Desarrollo_(Fase_Frontend)-orange)
![Tecnologías](https://img.shields.io/badge/Tecnologías-HTML5_|_CSS3_|_Vanilla_JS-blue)
![Materia](https://img.shields.io/badge/Materia-Programación_III_(UTN)-success)

## 📌 Descripción del Proyecto

**Food Store** es un proyecto integrador full-stack desarrollado para la materia **Programación III** de la Tecnicatura Universitaria en Programación (UTN). 

El sistema consiste en una aplicación web de e-commerce orientada a la venta de comida, con gestión de usuarios (Admin/Cliente), catálogo dinámico de productos y administración de pedidos.

**Actualmente el proyecto se encuentra en la Fase 1 (Frontend DOM):** El objetivo de esta etapa fue transformar una maqueta estática en una interfaz dinámica utilizando únicamente **Vanilla JavaScript**, manipulando el DOM para renderizar componentes a partir de una base de datos local simulada (Arrays de Objetos).

## ✨ Características (Estado Actual)

* **Catálogo Dinámico:** Renderizado automático de productos y categorías mediante iteradores de JavaScript y Template Strings.
* **Diseño Responsivo:** Maquetación estructurada utilizando CSS Grid y Flexbox.
* **Arquitectura CSS:** Uso de variables globales (`:root`) para mantener la consistencia de la paleta de colores y metodología basada en componentes.
* **Múltiples Vistas:**
  * `index.html`: Vista principal para los clientes (Catálogo, Menú, Sidebar).
  * `admin.html`: Panel de control (CRUD) estructurado para el rol de administrador.
  * `login.html`: Interfaz de autenticación de usuarios.

## 🛠️ Tecnologías Utilizadas

* **Estructura:** HTML5 Semántico.
* **Estilos:** CSS3 (Variables, Grid, Flexbox, transiciones y estados hover).
* **Lógica:** JavaScript (ES6+, Manipulación del DOM, Event Listeners).

## 📁 Estructura del Proyecto

```text
📦 PROYECTO FOOD STORE / frontend
 ┣ 📂 assets
 ┃ ┗ 📂 img                 # Imágenes de los productos y logo
 ┣ 📂 css
 ┃ ┣ 📜 admin.css           # Estilos específicos del panel de control
 ┃ ┣ 📜 login.css           # Estilos de la pantalla de autenticación
 ┃ ┗ 📜 styles.css          # Estilos globales y de la tienda principal
 ┣ 📂 js
 ┃ ┣ 📜 data.js             # Base de datos simulada (Arrays y Objetos)
 ┃ ┗ 📜 main.js             # Lógica de renderizado e interacciones del DOM
 ┣ 📜 admin.html            # Maquetación del Panel de Administración
 ┣ 📜 index.html            # Maquetación de la Tienda (Main)
 ┗ 📜 login.html            # Maquetación del Login