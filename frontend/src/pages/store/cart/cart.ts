import { getCart, addProductToCart, decreaseProductFromCart, deleteProductFromCart } from "../../../utils/cart";
import type { ICartItem } from "../../../types/ICartItem";
import { checkAuthUser } from "../../../utils/auth";
import { setupMenu } from "../../../utils/menu";

// 1- VALIDA QUE SOLO USUARIOS CLIENT PUEDAN ENTRAR AL CARRITO
const initPage = () => {
  checkAuthUser(
    "/src/pages/auth/login/login.html",
    "/src/pages/admin/adminHome/admin.html",
    "client"
  );
};
initPage();

// 2- RENDERIZA EL MENU SUPERIOR DEL CARRITO SEGUN EL ROL DEL USUARIO
setupMenu("cart", "#nav-menu");

// 3- CAPTURA LOS ELEMENTOS DEL DOM USADOS PARA RENDERIZAR EL CARRITO
const listaCarrito = document.getElementById("cart-content-list") as HTMLUListElement;
const mensajeVacio = document.getElementById("empty-message") as HTMLParagraphElement;
const cartSummary = document.getElementById("cart-summary") as HTMLElement;
const subtotalCarritoSpan = document.getElementById("cart-subtotal") as HTMLSpanElement;
const totalCarritoSpan = document.getElementById("total-numero") as HTMLSpanElement;

// 4- RENDERIZA EL CARRITO COMPLETO EN PANTALLA SIN RECARGAR LA PAGINA
const renderCart = () => {
    // OBTENCIÓN DE DATOS FRESCOS CADA VEZ QUE SE EJECUTA LA FUNCIÓN
    const carrito: ICartItem[] = getCart();

    // LIMPIEZA DEL CONTENEDOR PARA NO DUPLICAR ELEMENTOS VIEJOS
    listaCarrito.innerHTML = "";

    // 5- MUESTRA ESTADO VACIO O LISTADO SEGUN SI HAY ITEMS EN EL CARRITO
    if (carrito.length === 0) {
        listaCarrito.style.display = "none";
        if (cartSummary) cartSummary.style.display = "block";
        mensajeVacio.style.display = "block";
        
        if (subtotalCarritoSpan) subtotalCarritoSpan.textContent = "$0";
        if (totalCarritoSpan) totalCarritoSpan.textContent = "$0";
    } else {
        mensajeVacio.style.display = "none";
        listaCarrito.style.display = "block";
        if (cartSummary) cartSummary.style.display = "block";

        let sumaTotal = 0;

        // 6- RECORRE LOS ITEMS DEL CARRITO Y CREA CADA FILA VISUAL
        carrito.forEach((item) => {
            const li = document.createElement("li");
            li.classList.add("cart-item");

            const subtotalItem = item.producto.precio * item.cantidad;
            sumaTotal += subtotalItem;

            li.innerHTML = `
              <div class="cart-item__main">
                <img src="${item.producto.imagen}" alt="${item.producto.nombre}" class="cart-item__img">
                <div class="cart-item__info">
                  <h4>${item.producto.nombre}</h4>
                  <p>Precio Unitario: $${item.producto.precio}</p>
                </div>
              </div>
              
              <div class="cart-item__actions">
                <div class="cart-item__controls">
                    <button class="btn-quantity btn-restar">-</button>
                    <p class="cart-item__quantity">${item.cantidad}</p>
                    <button class="btn-quantity btn-sumar">+</button>
                </div>
                <button class="btn-eliminar-item">Eliminar 🗑️</button>
                <div class="cart-item__subtotal">
                  <p><strong>$${subtotalItem}</strong></p>
                </div>
              </div>
            `;

            // 7- ASIGNA EVENTOS DE SUMAR, RESTAR Y ELIMINAR CON RE-RENDER INMEDIATO
            const botonSumar = li.querySelector(".btn-sumar");
            botonSumar?.addEventListener('click', () => {
                addProductToCart(item.producto);
                renderCart(); 
            });

            const botonRestar = li.querySelector(".btn-restar");
            botonRestar?.addEventListener("click", () => {
                decreaseProductFromCart(item.producto.id);
                renderCart(); 
            });

            const botonEliminarItem = li.querySelector(".btn-eliminar-item");
            botonEliminarItem?.addEventListener('click', () => {
                deleteProductFromCart(item.producto.id);
                renderCart();
            });

            listaCarrito.appendChild(li);
        });

        // 8- ACTUALIZA SUBTOTAL Y TOTAL EN BASE A LA SUMA ACUMULADA
        if (subtotalCarritoSpan) subtotalCarritoSpan.textContent = `$${sumaTotal}`;
        if (totalCarritoSpan) totalCarritoSpan.textContent = `$${sumaTotal}`;
    }
};

// 9- EJECUTA EL PRIMER RENDER DEL CARRITO AL ABRIR LA PAGINA
renderCart();