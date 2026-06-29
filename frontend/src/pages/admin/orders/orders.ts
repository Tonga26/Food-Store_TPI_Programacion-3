import { checkAuthUser } from "../../../utils/auth";
import { setupMenu } from "../../../utils/menu";
import { apiFetch } from "../../../utils/api";
import { mostrarToast } from "../../../utils/toast";
import type { IOrder } from "../../../types/IOrder";

/**
 * ============================================================================
 * SECCIÓN: CONTROL DE ACCESO
 * ============================================================================
 */
const initPage = (): void => {
  checkAuthUser(
    "/src/pages/auth/login/login.html",
    "/src/pages/store/home/home.html",
    "admin"
  );
};
initPage();
setupMenu("admin", "#nav-menu");

const ordersContainer = document.getElementById("orders-container") as HTMLDivElement | null;
const modal = document.getElementById("order-modal") as HTMLDivElement | null;
const modalOverlay = document.getElementById("modal-overlay") as HTMLDivElement | null;
const btnCloseModal = document.getElementById("modal-close") as HTMLButtonElement | null;
const formAction = document.getElementById("order-action-form") as HTMLFormElement | null;
const orderStatusSelect = document.getElementById("order-status-select") as HTMLSelectElement | null;

const modalTitle = document.getElementById("modal-title") as HTMLHeadingElement | null;
const detailCustomer = document.getElementById("detail-customer") as HTMLSpanElement | null;
const detailDate = document.getElementById("detail-date") as HTMLSpanElement | null;
const detailPhone = document.getElementById("detail-phone") as HTMLSpanElement | null;
const detailAddress = document.getElementById("detail-address") as HTMLSpanElement | null;
const detailPayment = document.getElementById("detail-payment") as HTMLSpanElement | null;
const detailNotes = document.getElementById("detail-notes") as HTMLSpanElement | null;
const detailItems = document.getElementById("detail-items") as HTMLUListElement | null;
const detailSubtotal = document.getElementById("detail-subtotal") as HTMLSpanElement | null;
const detailShipping = document.getElementById("detail-shipping") as HTMLSpanElement | null;
const detailTotal = document.getElementById("detail-total") as HTMLSpanElement | null;

let currentOrders: IOrder[] = [];
let currentOrderId: number | null = null;

/**
 * ============================================================================
 * SECCIÓN: LÓGICA DE NEGOCIO Y ESTILOS DINÁMICOS
 * ============================================================================
 */
const formatPrice = (value: number): string => `$${value.toFixed(2)}`;

const getShippingCost = (subtotal: number): number => {
  return subtotal >= 50000 || subtotal <= 0 ? 0 : 2500;
};

const getBadgeClass = (status: string): string => {
  switch (status.toUpperCase()) {
    case "PENDIENTE": return "badge--pendiente";
    case "CONFIRMADO": return "badge--confirmado";
    case "TERMINADO":
    case "ENTREGADO": return "badge--entregado";
    case "CANCELADO": return "badge--cancelado";
    default: return "badge--pendiente";
  }
};

const closeModal = (): void => {
  modal?.classList.remove("modal--active");
  currentOrderId = null;
};
btnCloseModal?.addEventListener("click", closeModal);
modalOverlay?.addEventListener("click", closeModal);

const openOrderModal = (order: IOrder): void => {
  currentOrderId = order.id;

  if (modalTitle) modalTitle.textContent = `Pedido #${order.id}`;
  if (detailCustomer) detailCustomer.textContent = `${order.usuario.nombre} ${order.usuario.apellido}`;
  if (detailDate) detailDate.textContent = order.fecha;
  if (detailPhone) detailPhone.textContent = order.telefono || "No provisto";
  if (detailAddress) detailAddress.textContent = order.direccion || "Retiro en tienda";
  if (detailPayment) detailPayment.textContent = order.formaPago;
  if (detailNotes) detailNotes.textContent = order.notas || "Sin instrucciones";

  if (detailItems) {
    detailItems.innerHTML = "";
    order.detalles.forEach(item => {
      const li = document.createElement("li");
      li.className = "order-items__item";
      li.innerHTML = `<span>${item.cantidad}x ${item.producto.nombre}</span><span>${formatPrice(item.subtotal)}</span>`;
      detailItems.appendChild(li);
    });
  }

  const shipping = getShippingCost(order.total);
  if (detailSubtotal) detailSubtotal.textContent = formatPrice(order.total);
  if (detailShipping) detailShipping.textContent = formatPrice(shipping);
  if (detailTotal) detailTotal.textContent = formatPrice(order.total + shipping);
  if (orderStatusSelect) orderStatusSelect.value = order.estado.toUpperCase();

  modal?.classList.add("modal--active");
};

/**
 * ============================================================================
 * SECCIÓN: RENDERIZACIÓN DE LISTA VERICAL
 * ============================================================================
 */
const renderOrders = (orders: IOrder[]): void => {
  if (!ordersContainer) return;
  ordersContainer.innerHTML = "";

  if (orders.length === 0) {
    ordersContainer.innerHTML = `<p style="text-align: center; color: #6b7280;">No hay pedidos registrados.</p>`;
    return;
  }

  orders.forEach(order => {
    const card = document.createElement("div");
    card.className = "order-card-row";

    const badgeClass = getBadgeClass(order.estado);
    const productsCount = order.detalles.reduce((acc, item) => acc + item.cantidad, 0);
    const totalFinal = order.total + getShippingCost(order.total);

    card.innerHTML = `
      <div class="order-card-row__left">
          <h3 class="order-card-row__title">Pedido #${order.id}</h3>
          <p class="order-card-row__subtitle">👤 ${order.usuario.nombre} ${order.usuario.apellido} | 📅 ${order.fecha}</p>
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

const fetchOrders = async (): Promise<void> => {
  try {
    const orders: IOrder[] = await apiFetch("/orders");
    currentOrders = orders.sort((a, b) => b.id - a.id);
    renderOrders(currentOrders);
  } catch (error) {
    mostrarToast("Excepción al recuperar el listado de pedidos.");
  }
};

formAction?.addEventListener("submit", async (e: Event) => {
  e.preventDefault();
  if (!currentOrderId || !orderStatusSelect) return;

  const newStatus = orderStatusSelect.value;
  try {
    await apiFetch(`/orders/${currentOrderId}`, {
      method: "PUT",
      body: JSON.stringify({ estado: newStatus })
    });
    mostrarToast(`Pedido #${currentOrderId} actualizado a ${newStatus}.`);
    closeModal();
    fetchOrders();
  } catch (error: any) {
    mostrarToast(error.message || "Error al actualizar estado.");
  }
});

fetchOrders();