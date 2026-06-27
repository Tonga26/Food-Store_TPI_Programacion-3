import { checkAuthUser } from "../../../utils/auth";
import { setupMenu } from "../../../utils/menu";
import { ORDERS } from "../../../data/data";

// ============================================================================
// 1- CONTROL DE ACCESO Y SEGURIDAD
// ============================================================================
const initPage = (): void => {
  checkAuthUser(
    "/src/pages/auth/login/login.html",
    "/src/pages/store/home/home.html",
    "admin"
  );
};
initPage();
setupMenu("admin", "#nav-menu");

// ============================================================================
// 2- REFERENCIAS DIRECTAS DEL DOM
// ============================================================================
const ordersContainer = document.getElementById("orders-container") as HTMLDivElement | null;
const modal = document.getElementById("order-modal") as HTMLDivElement | null;
const modalOverlay = document.getElementById("modal-overlay") as HTMLDivElement | null;
const btnCloseModal = document.getElementById("modal-close") as HTMLButtonElement | null;
const formAction = document.getElementById("order-action-form") as HTMLFormElement | null;

const modalTitle = document.getElementById("modal-title") as HTMLHeadingElement | null;
const detailCustomer = document.getElementById("detail-customer") as HTMLSpanElement | null;
const detailDate = document.getElementById("detail-date") as HTMLSpanElement | null;
const detailPhone = document.getElementById("detail-phone") as HTMLSpanElement | null;
const detailAddress = document.getElementById("detail-address") as HTMLSpanElement | null;
const detailPayment = document.getElementById("detail-payment") as HTMLSpanElement | null;
const detailStatusBadge = document.getElementById("detail-status-badge") as HTMLSpanElement | null;
const detailItemsList = document.getElementById("detail-items-list") as HTMLUListElement | null;
const detailSubtotal = document.getElementById("detail-subtotal") as HTMLSpanElement | null;
const detailShipping = document.getElementById("detail-shipping") as HTMLSpanElement | null;
const detailTotal = document.getElementById("detail-total") as HTMLSpanElement | null;
const inputId = document.getElementById("order-id") as HTMLInputElement | null;
const selectStatus = document.getElementById("order-status-select") as HTMLSelectElement | null;

// ============================================================================
// 3- GESTIÓN DE VISIBILIDAD DEL MODAL
// ============================================================================
const closeModal = (): void => {
  modal?.classList.remove("modal--active");
  formAction?.reset();
};

btnCloseModal?.addEventListener("click", closeModal);
modalOverlay?.addEventListener("click", closeModal);

// ============================================================================
// 4- DETALLE INTERNO DEL MODAL DE PEDIDOS
// ============================================================================
const openOrderModal = (order: typeof ORDERS[0]): void => {
  if (modalTitle) modalTitle.textContent = `Detalle del Pedido #${order.id}`;
  if (detailCustomer) detailCustomer.textContent = order.cliente;
  if (detailDate) detailDate.textContent = order.fecha;
  if (detailPhone) detailPhone.textContent = order.telefono;
  if (detailAddress) detailAddress.textContent = order.direccion;
  if (detailPayment) detailPayment.textContent = order.metodoPago;
  
  if (detailStatusBadge) {
    detailStatusBadge.textContent = order.estado.toUpperCase();
    detailStatusBadge.className = "badge badge--warning";
  }

  if (detailItemsList) {
    detailItemsList.innerHTML = "";
    order.items.forEach(item => {
      const li = document.createElement("li");
      li.className = "order-item";
      li.innerHTML = `
        <div class="order-item__details">
            <span class="order-item__name">${item.nombre}</span>
            <span class="order-item__qty">Cantidad: ${item.cantidad} × $${item.precioUnitario}</span>
        </div>
        <span class="order-item__price">$${(item.cantidad * item.precioUnitario).toFixed(2)}</span>
      `;
      detailItemsList.appendChild(li);
    });
  }

  if (detailSubtotal) detailSubtotal.textContent = `$${order.subtotal.toFixed(2)}`;
  if (detailShipping) detailShipping.textContent = `$${order.envio.toFixed(2)}`;
  if (detailTotal) detailTotal.textContent = `$${order.total.toFixed(2)}`;
  
  if (inputId) inputId.value = order.id;
  if (selectStatus) selectStatus.value = order.estado;

  modal?.classList.add("modal--active");
};

// ============================================================================
// 5- RENDERIZADO DINÁMICO DE TARJETAS SOBRE EL PANEL
// ============================================================================
const renderOrders = (): void => {
  if (!ordersContainer) return;
  ordersContainer.innerHTML = "";

  ORDERS.forEach(order => {
    const card = document.createElement("div");
    card.classList.add("order-card");
    card.dataset.id = order.id;

    let badgeClass = "badge--warning";
    if (order.estado === "Completado" || order.estado === "Entregado") badgeClass = "badge--success";
    
    const productsCount = order.items.reduce((acc, item) => acc + item.cantidad, 0);

    card.innerHTML = `
      <div class="order-card__header">
          <div>
              <h3 class="order-card__title">Pedido #${order.id}</h3>
              <p class="order-card__subtitle">Cliente: ${order.cliente}</p>
              <p class="order-card__subtitle">${order.fecha}</p>
          </div>
          <span class="badge ${badgeClass}">${order.estado.toUpperCase()}</span>
      </div>
      <div class="order-card__footer">
          <span>${productsCount} producto(s)</span>
          <span class="order-card__total">$${order.total.toFixed(2)}</span>
      </div>
    `;

    card.addEventListener("click", () => {
      openOrderModal(order);
    });

    ordersContainer.appendChild(card);
  });
};

// ============================================================================
// 6- INTERCEPCIÓN Y ENVÍO DEL FORMULARIO (SUBMIT)
// ============================================================================
formAction?.addEventListener("submit", (e) => {
  e.preventDefault();
  closeModal();
});

renderOrders();