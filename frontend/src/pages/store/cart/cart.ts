import { getCart, addProductToCart, decreaseProductFromCart, deleteProductFromCart } from "../../../utils/cart";
import type { ICartItem } from "../../../types/ICartItem";
import { checkAuthUser } from "../../../utils/auth";
import { setupMenu } from "../../../utils/menu";
import { apiFetch } from "../../../utils/api";
import { mostrarToast } from "../../../utils/toast";
import { getUser } from "../../../utils/localStorage";

/**
 * Control de acceso y configuración inicial de sesión para la vista del carrito.
 */
const initPage = (): void => {
  checkAuthUser(
    "/src/pages/auth/login/login.html",
    "/src/pages/admin/adminHome/admin.html",
    "client"
  );
};
initPage();
setupMenu("cart", "#nav-menu");

const listaCarrito = document.getElementById("cart-content-list") as HTMLUListElement | null;
const mensajeVacio = document.getElementById("empty-message") as HTMLParagraphElement | null;
const cartSummary = document.getElementById("cart-summary") as HTMLElement | null;
const subtotalCarritoSpan = document.getElementById("cart-subtotal") as HTMLSpanElement | null;
const shippingCarritoSpan = document.getElementById("cart-shipping") as HTMLSpanElement | null;
const totalCarritoSpan = document.getElementById("total-numero") as HTMLSpanElement | null;
const btnEmptyCart = document.getElementById("btn-empty-cart") as HTMLButtonElement | null;

let totalPedidoActual: number = 0;

/**
 * Formatea un valor numérico a una representación de cadena con formato monetario.
 *
 * @param value - El monto numérico a formatear.
 * @returns Cadena de texto formateada (ej. $1500.00).
 */
const formatPrice = (value: number): string => `$${value.toFixed(2)}`;

/**
 * Resuelve dinámicamente la ruta absoluta del recurso visual imagen.
 *
 * @param fileName - Nombre del archivo físico o URL remota.
 * @returns Ruta procesada por el bundler (Vite) en tiempo de ejecución.
 */
const resolveImageUrl = (fileName: string | null | undefined): string => {
    if (!fileName) return "";
    if (fileName.startsWith('http')) return fileName;
    return new URL(`../../../assets/img/${fileName}`, import.meta.url).href;
};

/**
 * Calcula el costo logístico de envío aplicando reglas de negocio basadas en el subtotal.
 *
 * @param subtotal - El monto acumulado de los productos en el carrito.
 * @returns Costo de envío calculado.
 */
const getShippingCost = (subtotal: number): number => {
  if (subtotal <= 0) return 0;
  return subtotal >= 50000 ? 0 : 2500;
};

/**
 * Purga el estado de persistencia local del carrito y desencadena una actualización visual.
 */
const clearCart = (): void => {
  localStorage.removeItem("foodstore_cart");
  renderCart();
};
btnEmptyCart?.addEventListener("click", clearCart);

/**
 * Procesa el estado actual del carrito y orquesta el renderizado del DOM de forma dinámica.
 */
const renderCart = (): void => {
    if (!listaCarrito) return;
    
    const carrito: ICartItem[] = getCart();
    listaCarrito.innerHTML = "";
    
    if (carrito.length === 0) {
        listaCarrito.style.display = "none";
        if (cartSummary) cartSummary.style.display = "block";
        if (mensajeVacio) mensajeVacio.style.display = "block";
        
        if (subtotalCarritoSpan) subtotalCarritoSpan.textContent = formatPrice(0);
        if (shippingCarritoSpan) shippingCarritoSpan.textContent = formatPrice(0);
        if (totalCarritoSpan) totalCarritoSpan.textContent = formatPrice(0);
        totalPedidoActual = 0;
    } else {
        if (mensajeVacio) mensajeVacio.style.display = "none";
        listaCarrito.style.display = "block";
        if (cartSummary) cartSummary.style.display = "block";

        let sumaTotal = 0;

        carrito.forEach((item) => {
            const li = document.createElement("li");
            li.classList.add("cart-item");

            const subtotalItem = item.producto.precio * item.cantidad;
            sumaTotal += subtotalItem;
            const imgPath = resolveImageUrl(item.producto.imagen);

            li.innerHTML = `
              <div class="cart-item__main">
                <img src="${imgPath}" alt="${item.producto.nombre}" class="cart-item__img">
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

            li.querySelector(".btn-sumar")?.addEventListener('click', () => {
                addProductToCart(item.producto);
                renderCart(); 
            });

            li.querySelector(".btn-restar")?.addEventListener("click", () => {
                decreaseProductFromCart(item.producto.id);
                renderCart(); 
            });

            li.querySelector(".btn-eliminar-item")?.addEventListener('click', () => {
                deleteProductFromCart(item.producto.id);
                renderCart();
            });

            listaCarrito.appendChild(li);
        });

        const shippingCost = getShippingCost(sumaTotal);
        totalPedidoActual = sumaTotal + shippingCost;

        if (subtotalCarritoSpan) subtotalCarritoSpan.textContent = formatPrice(sumaTotal);
        if (shippingCarritoSpan) shippingCarritoSpan.textContent = formatPrice(shippingCost);
        if (totalCarritoSpan) totalCarritoSpan.textContent = formatPrice(totalPedidoActual);
    }
};
renderCart();

const checkoutModal = document.getElementById("checkout-modal") as HTMLDivElement | null;
const checkoutOverlay = document.getElementById("checkout-overlay") as HTMLDivElement | null;
const checkoutClose = document.getElementById("checkout-close") as HTMLButtonElement | null;
const checkoutForm = document.getElementById("checkout-form") as HTMLFormElement | null;
const btnProceedPay = document.getElementById("btn-proceed-pay") as HTMLButtonElement | null;
const checkoutTotalValue = document.getElementById("checkout-total-value") as HTMLSpanElement | null;

const inputPhone = document.getElementById("checkout-phone") as HTMLInputElement | null;
const inputAddress = document.getElementById("checkout-address") as HTMLTextAreaElement | null;
const selectPayment = document.getElementById("checkout-payment") as HTMLSelectElement | null;
const inputNotes = document.getElementById("checkout-notes") as HTMLTextAreaElement | null;

/**
 * Controla la apertura del modal de confirmación e inyecta el total calculado.
 */
const openCheckoutModal = (): void => {
  const carrito = getCart();
  if (carrito.length === 0) {
    mostrarToast("El carrito se encuentra vacío.");
    return;
  }

  if (checkoutTotalValue) {
    checkoutTotalValue.textContent = formatPrice(totalPedidoActual);
  }
  checkoutModal?.classList.add("modal--active");
};

/**
 * Cierra el modal de confirmación y restablece el estado del formulario.
 */
const closeCheckoutModal = (): void => {
  checkoutModal?.classList.remove("modal--active");
  checkoutForm?.reset();
};

btnProceedPay?.addEventListener("click", openCheckoutModal);
checkoutClose?.addEventListener("click", closeCheckoutModal);
checkoutOverlay?.addEventListener("click", closeCheckoutModal);

/**
 * Interceptor de envío del formulario de checkout para la construcción y despacho del payload transaccional.
 */
checkoutForm?.addEventListener("submit", async (e: Event) => {
  e.preventDefault();

  const userString = getUser();
  if (!userString) {
      mostrarToast("Excepción de sesión: Autenticación requerida.");
      window.location.href = "/src/pages/auth/login/login.html";
      return;
  }
  
  const parseUser = JSON.parse(userString);
  const usuarioId = Number(parseUser.id);

  const direccionText = inputAddress?.value.trim() || "";
  const telefonoText = inputPhone?.value.trim() || "";
  const notasText = inputNotes?.value.trim() || "";
  const paymentValue = selectPayment?.value.toUpperCase() || "";

  const carritoItems = getCart();
  const detallesPayload = carritoItems.map(item => ({
      productoId: Number(item.producto.id),
      cantidad: Number(item.cantidad)
  }));

  const payload = {
      usuarioId: usuarioId,
      formaPago: paymentValue,
      direccion: direccionText,
      telefono: telefonoText,
      notas: notasText,
      detalles: detallesPayload
  };

  try {
      await apiFetch("/orders", {
          method: "POST",
          body: JSON.stringify(payload)
      });

      mostrarToast("Orden procesada y registrada exitosamente.");
      clearCart();
      closeCheckoutModal();

      setTimeout(() => {
          window.location.href = "../../client/orders/orders.html";
      }, 1500);

  } catch (error: any) {
      console.error("Error processing order:", error);
      mostrarToast(error.message || "Fallo transaccional al procesar el pedido.");
  }
});