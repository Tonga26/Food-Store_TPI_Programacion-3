import { checkAuthUser } from "../../../utils/auth";
import { setupMenu } from "../../../utils/menu";
import { apiFetch } from "../../../utils/api";
import { mostrarToast } from "../../../utils/toast";
import { getUser } from "../../../utils/localStorage";
import type { IOrder } from "../../../types/IOrder";

/**
 * Control de acceso y configuración inicial de sesión para la vista del historial de compras.
 */
const initPage = (): void => {
  checkAuthUser(
    "/src/pages/auth/login/login.html",
    "/src/pages/store/home/home.html",
    "client"
  );
};
initPage();
setupMenu("orders", "#nav-menu");

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

/**
 * Cierra el modal de detalle de pedido removiendo la clase activa de visibilidad.
 */
const closeModal = (): void => modal?.classList.remove("modal--active");

btnCloseModal?.addEventListener("click", closeModal);
modalOverlay?.addEventListener("click", closeModal);

/**
 * Calcula el costo de logística asociado a un monto total.
 * * @param subtotal - La sumatoria del costo de los productos del pedido.
 * @returns El costo de envío calculado según reglas de negocio (Umbral: $50000).
 */
const getShippingCost = (subtotal: number): number => {
    if (subtotal <= 0) return 0;
    return subtotal >= 50000 ? 0 : 2500;
};

/**
 * Renderiza dinámicamente la información detallada de una transacción en el modal visual.
 * * @param order - El objeto de transferencia de datos con la información completa de la orden.
 */
const openOrderModal = (order: IOrder): void => {
  if (modalDate) modalDate.textContent = order.fecha;
  if (modalAddress) modalAddress.textContent = order.direccion || "Retiro en local";
  if (modalPhone) modalPhone.textContent = order.telefono || "No especificado";
  if (modalPayment) modalPayment.textContent = order.formaPago;
  
  if (modalStatus) {
    modalStatus.textContent = order.estado;
    modalStatus.className = `badge ${order.estado === 'ENTREGADO' ? 'badge--success' : 'badge--warning'}`;
  }

  if (modalItems) {
    modalItems.innerHTML = "";
    order.detalles.forEach(item => {
      const li = document.createElement("li");
      li.className = "order-item";
      li.style.backgroundColor = "transparent";
      li.style.padding = "0.5rem 0";
      li.innerHTML = `
        <div class="order-item__details">
            <span class="order-item__name">${item.producto.nombre}</span>
            <span class="order-item__qty">Cantidad: ${item.cantidad} × $${item.producto.precio.toFixed(2)}</span>
        </div>
        <span class="order-item__price" style="color: #ff6347;">$${item.subtotal.toFixed(2)}</span>
      `;
      modalItems.appendChild(li);
    });
  }

  const shipping = getShippingCost(order.total);
  const totalConEnvio = order.total + shipping;

  if (modalSubtotal) modalSubtotal.textContent = `$${order.total.toFixed(2)}`;
  if (modalShipping) modalShipping.textContent = `$${shipping.toFixed(2)}`;
  if (modalTotal) modalTotal.textContent = `$${totalConEnvio.toFixed(2)}`;
  
  if (modalAlert) {
    if (order.estado === "ENTREGADO") {
      modalAlert.className = "alert-box alert-box--success";
      modalAlert.innerHTML = `
        <strong>✅ Pedido Entregado</strong>
        <p style="margin: 0; font-size: 0.85rem;">Esperamos que lo hayas disfrutado.</p>
      `;
    } else {
      modalAlert.className = "alert-box alert-box--warning";
      modalAlert.innerHTML = `
        <strong>⏳ Tu pedido está siendo procesado</strong>
        <p style="margin: 0; font-size: 0.85rem;">Te notificaremos cuando esté listo para entrega.</p>
      `;
    }
  }

  modal?.classList.add("modal--active");
};

/**
 * Pinta el listado de tarjetas de órdenes de compra en el contenedor principal.
 * * @param ordersToRender - Colección de órdenes a iterar para inyección en el DOM.
 */
const renderClientOrders = (ordersToRender: IOrder[]): void => {
  if (!ordersContainer) return;
  ordersContainer.innerHTML = "";

  if (ordersToRender.length === 0) {
      ordersContainer.innerHTML = `<p style="text-align: center; width: 100%; color: #6b7280;">No se encontraron pedidos en esta categoría.</p>`;
      return;
  }

  ordersToRender.forEach(order => {
    const card = document.createElement("div");
    card.classList.add("order-card");
    
    let badgeClass = "badge--warning";
    if (order.estado === "ENTREGADO") badgeClass = "badge--success";
    
    const productsCount = order.detalles.reduce((acc, item) => acc + item.cantidad, 0);
    const shipping = getShippingCost(order.total);
    const totalFinal = order.total + shipping;
    
    let itemsPreviewHtml = "";
    order.detalles.forEach(item => {
        itemsPreviewHtml += `<p>• ${item.producto.nombre} (x${item.cantidad})</p>`;
    });

    card.innerHTML = `
      <div class="order-card__header">
          <div>
              <h3 class="order-card__title">Pedido #${order.id}</h3>
              <p class="order-card__subtitle">📅 ${order.fecha}</p>
          </div>
          <span class="badge ${badgeClass}">${order.estado}</span>
      </div>
      
      <div class="client-order-preview">
          ${itemsPreviewHtml}
      </div>

      <div class="order-card__footer">
          <span>📦 ${productsCount} producto(s)</span>
          <span class="order-card__total">$${totalFinal.toFixed(2)}</span>
      </div>
    `;
    
    card.addEventListener("click", () => openOrderModal(order));
    ordersContainer.appendChild(card);
  });
};

/**
 * Orquesta la solicitud HTTP para recuperar el historial transaccional del cliente autenticado.
 */
const fetchOrders = async (): Promise<void> => {
    try {
        const userString = getUser();
        if (!userString) throw new Error("Sesión inválida.");
        const user = JSON.parse(userString);
        
        const orders: IOrder[] = await apiFetch(`/orders/user/${user.id}`);
        
        // Se ordenan los pedidos para mostrar los más recientes primero
        currentOrders = orders.sort((a, b) => b.id - a.id);
        renderClientOrders(currentOrders);
    } catch (error) {
        console.error("Error fetching client orders:", error);
        mostrarToast("No fue posible recuperar tu historial de pedidos.");
    }
};

/**
 * Interceptor de eventos para aplicar el filtrado visual de pedidos basado en su estado.
 */
orderFilter?.addEventListener("change", (e: Event) => {
    const filterValue = (e.target as HTMLSelectElement).value.toLowerCase();
    
    if (filterValue === "all") {
        renderClientOrders(currentOrders);
        return;
    }
    
    const filteredOrders = currentOrders.filter(order => order.estado.toLowerCase() === filterValue);
    renderClientOrders(filteredOrders);
});

// Desencadenador inicial del ciclo de vida
fetchOrders();