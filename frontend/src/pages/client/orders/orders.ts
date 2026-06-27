import { checkAuthUser } from "../../../utils/auth";
import { setupMenu } from "../../../utils/menu";
import { ORDERS } from "../../../data/data";

// 1- CONTROL DE ACCESO Y CONFIGURACIÓN INICIAL
const initPage = (): void => {
  checkAuthUser(
    "/src/pages/auth/login/login.html",
    "/src/pages/store/home/home.html",
    "client"
  );
};
initPage();
setupMenu("orders", "#nav-menu");

// 2- REFERENCIAS DIRECTAS DEL DOM
const ordersContainer = document.getElementById("client-orders-container") as HTMLDivElement | null;
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

// 3- GESTIÓN DE VISIBILIDAD DEL MODAL
const closeModal = (): void => modal?.classList.remove("modal--active");

btnCloseModal?.addEventListener("click", closeModal);
modalOverlay?.addEventListener("click", closeModal);

// 4- DETALLE INTERNO DEL MODAL DE PEDIDOS (CLIENTE)
const openOrderModal = (order: typeof ORDERS[0]): void => {
  if (modalDate) modalDate.textContent = order.fecha;
  if (modalAddress) modalAddress.textContent = order.direccion;
  if (modalPhone) modalPhone.textContent = order.telefono;
  if (modalPayment) modalPayment.textContent = order.metodoPago;

  if (modalStatus) {
    modalStatus.textContent = order.estado.toUpperCase();
    modalStatus.className = "badge badge--warning";
  }

  if (modalItems) {
    modalItems.innerHTML = "";
    order.items.forEach(item => {
      const li = document.createElement("li");
      li.className = "order-item";
      li.style.backgroundColor = "transparent";
      li.style.padding = "0.5rem 0";
      li.innerHTML = `
        <div class="order-item__details">
            <span class="order-item__name">${item.nombre}</span>
            <span class="order-item__qty">Cantidad: ${item.cantidad} × $${item.precioUnitario.toFixed(2)}</span>
        </div>
        <span class="order-item__price" style="color: #ff6347;">$${(item.cantidad * item.precioUnitario).toFixed(2)}</span>
      `;
      modalItems.appendChild(li);
    });
  }

  if (modalSubtotal) modalSubtotal.textContent = `$${order.subtotal.toFixed(2)}`;
  if (modalShipping) modalShipping.textContent = `$${order.envio.toFixed(2)}`;
  if (modalTotal) modalTotal.textContent = `$${order.total.toFixed(2)}`;

  if (modalAlert) {
    if (order.estado === "Completado" || order.estado === "Entregado") {
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

// 5- RENDERIZADO DINÁMICO DE TARJETAS (VISTA CLIENTE)
const renderClientOrders = (): void => {
  if (!ordersContainer) return;
  ordersContainer.innerHTML = "";

  ORDERS.forEach(order => {
    const card = document.createElement("div");
    card.classList.add("order-card");
    
    let badgeClass = "badge--warning";
    if (order.estado === "Completado" || order.estado === "Entregado") badgeClass = "badge--success";
    
    const productsCount = order.items.reduce((acc, item) => acc + item.cantidad, 0);
    
    let itemsPreviewHtml = "";
    order.items.forEach(item => {
        itemsPreviewHtml += `<p>• ${item.nombre} (x${item.cantidad})</p>`;
    });

    card.innerHTML = `
      <div class="order-card__header">
          <div>
              <h3 class="order-card__title">Pedido #${order.id}</h3>
              <p class="order-card__subtitle">📅 ${order.fecha}</p>
          </div>
          <span class="badge ${badgeClass}">${order.estado.toUpperCase()}</span>
      </div>
      
      <div class="client-order-preview">
          ${itemsPreviewHtml}
      </div>

      <div class="order-card__footer">
          <span>📦 ${productsCount} producto(s)</span>
          <span class="order-card__total">$${order.total.toFixed(2)}</span>
      </div>
    `;

    card.addEventListener("click", () => openOrderModal(order));
    ordersContainer.appendChild(card);
  });
};

renderClientOrders();