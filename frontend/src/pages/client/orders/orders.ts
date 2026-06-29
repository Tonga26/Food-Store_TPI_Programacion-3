import { checkAuthUser } from "../../../utils/auth";
import { setupMenu } from "../../../utils/menu";
import { apiFetch } from "../../../utils/api";
import { mostrarToast } from "../../../utils/toast";
import { getUser } from "../../../utils/localStorage";
import type { IOrder } from "../../../types/IOrder";

/* ============================================================================
   SECCIÓN 1: CONTROL DE ACCESO PERIMETRAL
   ============================================================================ */
const initPage = (): void => {
  checkAuthUser(
    "/src/pages/auth/login/login.html",
    "/src/pages/store/home/home.html",
    "client"
  );
};
initPage();
setupMenu("orders", "#nav-menu");

/* ============================================================================
   SECCIÓN 2: REFERENCIAS DIRECTAS DEL DOM
   ============================================================================ */
const ordersContainer = document.getElementById("client-orders-container") as HTMLDivElement | null;
const orderFilter = document.getElementById("client-order-filter") as HTMLSelectElement | null;

const modal = document.getElementById("client-order-modal") as HTMLDivElement | null;
const modalOverlay = document.getElementById("client-modal-overlay") as HTMLDivElement | null;
const btnCloseModal = document.getElementById("client-modal-close") as HTMLButtonElement | null;

const modalStatus = document.getElementById("modal-client-status") as HTMLSpanElement | null;
const modalDate = document.getElementById("modal-client-date") as HTMLSpanElement | null;
const modalAddress = document.getElementById("modal-client-address") as HTMLSpanElement | null;
const modalPhone = document.getElementById("modal-client-phone") as HTMLSpanElement | null;
const modalPayment = document.getElementById("modal-client-payment") as HTMLSpanElement | null;
const modalItems = document.getElementById("modal-client-items") as HTMLUListElement | null;
const modalSubtotal = document.getElementById("modal-client-subtotal") as HTMLSpanElement | null;
const modalShipping = document.getElementById("modal-client-shipping") as HTMLSpanElement | null;
const modalTotal = document.getElementById("modal-client-total") as HTMLSpanElement | null;
const modalAlert = document.getElementById("modal-client-alert") as HTMLDivElement | null;

let currentOrders: IOrder[] = [];

/* ============================================================================
   SECCIÓN 3: UTILIDADES Y BUSCADORES DE ESTILOS
   ============================================================================ */

/**
 * Formatea un valor numérico flotante a una cadena con formato de moneda local.
 * * @param value - Monto decimal a formatear.
 * @returns Cadena con prefijo monetario.
 */
const formatPrice = (value: number): string => `$${value.toFixed(2)}`;

/**
 * Evalúa las reglas logísticas para determinar la tasa de envío aplicable.
 * * @param subtotal - Sumatoria base de los ítems comprados.
 * @returns Costo logístico calculado.
 */
const getShippingCost = (subtotal: number): number => {
    return subtotal >= 50000 || subtotal <= 0 ? 0 : 2500;
};

/**
 * Mapea el estado semántico de la orden a una clase de insignia global.
 * * @param status - Estado proveniente del servidor API REST.
 * @returns Nombre de la clase CSS de la insignia.
 */
const getBadgeClass = (status: string): string => {
  switch (status.toUpperCase()) {
    case "PENDIENTE": return "badge--pendiente";
    case "CONFIRMADO":
    case "EN PREPARACIÓN":
    case "EN CAMINO": 
      return "badge--confirmado";
    case "TERMINADO":
    case "ENTREGADO": 
      return "badge--entregado";
    case "CANCELADO": return "badge--cancelado";
    default: return "badge--pendiente";
  }
};

/* ============================================================================
   SECCIÓN 4: MANEJO Y RENDERIZACIÓN DEL MODAL DE DETALLE
   ============================================================================ */

/**
 * Contrae el panel modal y limpia las referencias temporales de pantalla.
 */
const closeModal = (): void => modal?.classList.remove("modal--active");
btnCloseModal?.addEventListener("click", closeModal);
modalOverlay?.addEventListener("click", closeModal);

/**
 * Carga las especificaciones de una orden y muta dinámicamente el mensaje de estado inferior.
 * * @param order - Objeto de transferencia de datos con la orden seleccionada.
 */
const openOrderModal = (order: IOrder): void => {
  if (modalDate) modalDate.textContent = order.fecha;
  if (modalAddress) modalAddress.textContent = order.direccion || "Retiro en local";
  if (modalPhone) modalPhone.textContent = order.telefono || "No especificado";
  if (modalPayment) modalPayment.textContent = order.formaPago;
  
  if (modalStatus) {
    modalStatus.textContent = order.estado;
    modalStatus.className = `badge ${getBadgeClass(order.estado)}`;
  }

  if (modalItems) {
    modalItems.innerHTML = "";
    order.detalles.forEach(item => {
      const li = document.createElement("li");
      li.className = "order-items__item";
      li.style.borderBottom = "1px solid #dee2e6";
      li.innerHTML = `
        <span>${item.cantidad}x ${item.producto.nombre}</span>
        <span style="color: var(--color-primario); font-weight: 600;">${formatPrice(item.subtotal)}</span>
      `;
      modalItems.appendChild(li);
    });
  }

  const shipping = getShippingCost(order.total);
  if (modalSubtotal) modalSubtotal.textContent = formatPrice(order.total);
  if (modalShipping) modalShipping.textContent = formatPrice(shipping);
  if (modalTotal) modalTotal.textContent = formatPrice(order.total + shipping);

  if (modalAlert) {
    const estado = order.estado.toUpperCase();
    if (estado === "PENDIENTE") {
        modalAlert.className = "alert-box alert-box--pendiente";
        modalAlert.innerHTML = `<strong>⏳ Tu pedido está pendiente</strong><p style="margin: 0; font-size: 0.85rem; font-weight: 500;">Estamos esperando que la cocina confirme tu orden.</p>`;
    } else if (estado === "CONFIRMADO" || estado === "EN PREPARACIÓN" || estado === "EN CAMINO") {
        modalAlert.className = "alert-box alert-box--confirmado";
        modalAlert.innerHTML = `<strong>👨‍🍳 ¡Pedido confirmado!</strong><p style="margin: 0; font-size: 0.85rem; font-weight: 500;">Tu comida ya se está preparando o va en camino a tu dirección.</p>`;
    } else if (estado === "TERMINADO" || estado === "ENTREGADO") {
        modalAlert.className = "alert-box alert-box--entregado";
        modalAlert.innerHTML = `<strong>✅ ¡Pedido entregado!</strong><p style="margin: 0; font-size: 0.85rem; font-weight: 500;">¡Que lo disfrutes! Muchas gracias por comprar en nuestra tienda.</p>`;
    } else if (estado === "CANCELADO") {
        modalAlert.className = "alert-box alert-box--cancelado";
        modalAlert.innerHTML = `<strong>❌ Pedido cancelado</strong><p style="margin: 0; font-size: 0.85rem; font-weight: 500;">Esta orden fue anulada. Comunícate con soporte ante cualquier duda.</p>`;
    }
  }

  modal?.classList.add("modal--active");
};

/* ============================================================================
   SECCIÓN 5: RENDERIZADO DINÁMICO DE TARJETAS (VISTA CLIENTE)
   ============================================================================ */

/**
 * Pinta la colección de pedidos del comprador mapeando los contenedores de fila estructurados.
 * * @param ordersToRender - Colección ordenada de pedidos.
 */
const renderClientOrders = (ordersToRender: IOrder[]): void => {
  if (!ordersContainer) return;
  ordersContainer.innerHTML = "";

  if (ordersToRender.length === 0) {
      ordersContainer.innerHTML = `<p style="text-align: center; color: #6b7280; width: 100%;">No tienes transacciones registradas en este estado.</p>`;
      return;
  }

  ordersToRender.forEach(order => {
    const card = document.createElement("div");
    card.className = "order-card-row";
    
    const badgeClass = getBadgeClass(order.estado);
    const productsCount = order.detalles.reduce((acc, item) => acc + item.cantidad, 0);
    const totalFinal = order.total + getShippingCost(order.total);
    
    card.innerHTML = `
      <div class="order-card-row__left">
          <h3 class="order-card-row__title">Pedido #${order.id}</h3>
          <p class="order-card-row__subtitle">📅 ${order.fecha}</p>
      </div>
      <div class="order-card-row__right">
          <span class="badge ${badgeClass}">${order.estado}</span>
          <span class="order-card-row__subtitle">📦 ${productsCount} producto(s)</span>
          <span class="order-card-row__total">${formatPrice(totalFinal)}</span>
      </div>
    `;
    
    card.addEventListener("click", () => openOrderModal(order));
    ordersContainer.appendChild(card);
  });
};

/* ============================================================================
   SECCIÓN 6: CONSUMO DE API REST Y FILTRADO OPERATIVO
   ============================================================================ */
const fetchOrders = async (): Promise<void> => {
    try {
        const userString = getUser();
        if (!userString) throw new Error("Sesión inválida.");
        const user = JSON.parse(userString);
        
        const orders: IOrder[] = await apiFetch(`/orders/user/${user.id}`);
        currentOrders = orders.sort((a, b) => b.id - a.id);
        renderClientOrders(currentOrders);
    } catch (error) {
        console.error("Error fetching client orders:", error);
        mostrarToast("No fue posible recuperar tu historial de pedidos.");
    }
};

orderFilter?.addEventListener("change", (e: Event) => {
    const filterValue = (e.target as HTMLSelectElement).value.toLowerCase();
    
    if (filterValue === "all") {
        renderClientOrders(currentOrders);
        return;
    }
    
    const filteredOrders = currentOrders.filter(order => {
        if (filterValue === "completado") {
            return order.estado.toLowerCase() === "completado" || order.estado.toLowerCase() === "entregado" || order.estado.toLowerCase() === "terminado";
        }
        return order.estado.toLowerCase() === filterValue;
    });
    
    renderClientOrders(filteredOrders);
});

fetchOrders();