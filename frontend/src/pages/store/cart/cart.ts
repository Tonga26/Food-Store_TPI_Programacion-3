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
const shippingCarritoSpan = document.getElementById("cart-shipping") as HTMLSpanElement;
const totalCarritoSpan = document.getElementById("total-numero") as HTMLSpanElement;
const btnEmptyCart = document.getElementById("btn-empty-cart") as HTMLButtonElement | null;

// 3.1- FORMATEA LOS PRECIOS CON DOS DECIMALES Y SIMBOLO DE PESO
const formatPrice = (value: number): string => `$${value.toFixed(2)}`;

// 3.2- CALCULA EL ENVIO SOLO SI HAY PRODUCTOS EN EL CARRITO
const getShippingCost = (subtotal: number): number => {
  if (subtotal <= 0) return 0;
  return subtotal >= 50000 ? 0 : 2500;
};

// 3.3- VACIA COMPLETAMENTE EL CARRITO Y RE-RENDERIZA LA VISTA
const clearCart = () => {
  localStorage.removeItem("foodstore_cart");
  renderCart();
};

btnEmptyCart?.addEventListener("click", clearCart);

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
        
      if (subtotalCarritoSpan) subtotalCarritoSpan.textContent = formatPrice(0);
      if (shippingCarritoSpan) shippingCarritoSpan.textContent = formatPrice(0);
      if (totalCarritoSpan) totalCarritoSpan.textContent = formatPrice(0);
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
                  <p class="cart-item__description">${item.producto.descripcion}</p>
                  <p class="cart-item__unit-price">${formatPrice(item.producto.precio)} c/u</p>
                </div>
              </div>
              
              <div class="cart-item__actions">
                <div class="cart-item__controls">
                    <button class="btn-quantity btn-restar">-</button>
                    <p class="cart-item__quantity">${item.cantidad}</p>
                    <button class="btn-quantity btn-sumar">+</button>
                </div>
                <div class="cart-item__subtotal">
                  <p><strong>${formatPrice(subtotalItem)}</strong></p>
                </div>
                <button class="btn-eliminar-item">🗑️</button>
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
    const shippingCost = getShippingCost(sumaTotal);
    const total = sumaTotal + shippingCost;

    if (subtotalCarritoSpan) subtotalCarritoSpan.textContent = formatPrice(sumaTotal);
    if (shippingCarritoSpan) shippingCarritoSpan.textContent = formatPrice(shippingCost);
    if (totalCarritoSpan) totalCarritoSpan.textContent = formatPrice(total);
    }
};

// 9- EJECUTA EL PRIMER RENDER DEL CARRITO AL ABRIR LA PAGINA
renderCart();

// ============================================================================
// REFERENCIAS AL DOM: MODAL DE CHECKOUT
// ============================================================================
const checkoutModal = document.getElementById("checkout-modal") as HTMLDivElement | null;
const checkoutOverlay = document.getElementById("checkout-overlay") as HTMLDivElement | null;
const checkoutClose = document.getElementById("checkout-close") as HTMLButtonElement | null;
const checkoutForm = document.getElementById("checkout-form") as HTMLFormElement | null;
const btnProceedPay = document.getElementById("btn-proceed-pay") as HTMLButtonElement | null;
const checkoutTotalValue = document.getElementById("checkout-total-value") as HTMLSpanElement | null;

// ============================================================================
// CONTROL DE ESTADO DEL MODAL
// ============================================================================
const openCheckoutModal = (): void => {
  // TODO: Reemplazar con la variable real que contenga la sumatoria del carrito
  const cartTotal = 25500.00; 
  
  if (checkoutTotalValue) {
    checkoutTotalValue.textContent = `$${cartTotal.toFixed(2)}`;
  }
  checkoutModal?.classList.add("modal--active");
};

const closeCheckoutModal = (): void => {
  checkoutModal?.classList.remove("modal--active");
  checkoutForm?.reset();
};

btnProceedPay?.addEventListener("click", openCheckoutModal);
checkoutClose?.addEventListener("click", closeCheckoutModal);
checkoutOverlay?.addEventListener("click", closeCheckoutModal);

// ============================================================================
// PROCESAMIENTO DEL PEDIDO (SUBMIT)
// ============================================================================
checkoutForm?.addEventListener("submit", (e: Event) => {
  e.preventDefault();
  // TODO: Fase 3 - Construir objeto OrderRequest y realizar POST al Backend
  console.log("Pedido confirmado. Procesando...");
  closeCheckoutModal();
});