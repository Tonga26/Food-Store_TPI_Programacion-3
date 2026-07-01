import { checkAuthUser } from "../../../utils/auth";
import { setupMenu } from "../../../utils/menu";
import { apiFetch } from "../../../utils/api";
import { mostrarToast } from "../../../utils/toast";
import type { ICategory } from "../../../types/ICategory";
import type { IProduct } from "../../../types/IProduct";
import type { IOrder } from "../../../types/IOrder";

/* ============================================================================
   SECCIÓN 1: CONTROL DE ACCESO PERIMETRAL
   ============================================================================ */

const initPage = (): void => {
  checkAuthUser(
    "/src/pages/auth/login/login.html",
    "/src/pages/store/home/home.html",
    ["admin"]
  );
};
initPage();
setupMenu("admin", "#nav-menu");

/* ============================================================================
   SECCIÓN 2: REFERENCIAS AL DOM
   ============================================================================ */

const statCategories = document.getElementById("stat-categories") as HTMLParagraphElement | null;
const statProducts = document.getElementById("stat-products") as HTMLParagraphElement | null;
const statOrders = document.getElementById("stat-orders") as HTMLParagraphElement | null;
const statAvailable = document.getElementById("stat-available") as HTMLParagraphElement | null;
const summaryContainer = document.querySelector(".dashboard-summary") as HTMLElement | null;

/* ============================================================================
   SECCIÓN 3: PROCESAMIENTO ESTADÍSTICO Y RENDERIZADO
   ============================================================================ */

const loadDashboardStats = async (): Promise<void> => {
  try {
    const [categories, products, orders] = await Promise.all([
        apiFetch("/categories") as Promise<ICategory[]>,
        apiFetch("/products") as Promise<IProduct[]>,
        apiFetch("/orders") as Promise<IOrder[]>
    ]);
    
    const totalCategories = categories.length;
    const totalProducts = products.length;
    const totalOrders = orders.length;
    
    const activeProducts = products.filter(p => p.disponible).length;
    const inactiveProducts = totalProducts - activeProducts;

    const ordersByStatus = orders.reduce((acc, order) => {
        const estado = order.estado.toUpperCase();
        acc[estado] = (acc[estado] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    if (statCategories) statCategories.textContent = totalCategories.toString();
    if (statProducts) statProducts.textContent = totalProducts.toString();
    if (statOrders) statOrders.textContent = totalOrders.toString();
    if (statAvailable) statAvailable.textContent = activeProducts.toString();

    if (summaryContainer) {
        const orderStatsHTML = Object.entries(ordersByStatus)
            .map(([estado, cantidad]) => `
                <div class="dashboard-panel__row dashboard-panel__row--dashed">
                    <span class="dashboard-panel__label">${estado}</span>
                    <span class="dashboard-panel__value dashboard-panel__value--highlight">${cantidad}</span>
                </div>
            `).join('');

        summaryContainer.innerHTML = `
            <h3 class="dashboard-summary__title dashboard-summary__title--large">📊 Panel de Resumen Detallado</h3>
            
            <div class="dashboard-panels">
                <div class="dashboard-panel">
                    <h4 class="dashboard-panel__title">📦 Inventario Operativo</h4>
                    
                    <div class="dashboard-panel__row dashboard-panel__row--dashed">
                        <span class="dashboard-panel__label">Categorías Activas</span>
                        <span class="dashboard-panel__value dashboard-panel__value--blue">${totalCategories}</span>
                    </div>
                    
                    <div class="dashboard-panel__row dashboard-panel__row--dashed">
                        <span class="dashboard-panel__label">Productos Activos</span>
                        <span class="dashboard-panel__value dashboard-panel__value--green">${activeProducts}</span>
                    </div>
                    
                    <div class="dashboard-panel__row">
                        <span class="dashboard-panel__label">Productos Inactivos</span>
                        <span class="dashboard-panel__value dashboard-panel__value--red">${inactiveProducts}</span>
                    </div>
                </div>

                <div class="dashboard-panel">
                    <h4 class="dashboard-panel__title">🚚 Pedidos por Estado</h4>
                    ${orderStatsHTML || '<p class="dashboard-panel__empty">No hay operaciones registradas.</p>'}
                </div>
            </div>
        `;
    }

  } catch (error) {
    console.error("Error al recuperar estadísticas del dashboard:", error);
    mostrarToast("Excepción de red: Imposible sincronizar métricas del sistema.");
    
    if (summaryContainer) {
      summaryContainer.innerHTML = `
          <h3 class="dashboard-summary__title">📊 Panel de Resumen Detallado</h3>
          <div class="dashboard-alert">
            <strong>⚠️ Alerta Crítica:</strong> El sistema está operando fuera de línea o perdió conexión con el servidor.
          </div>
      `;
    }
  }
};

/* ============================================================================
   SECCIÓN 4: INICIALIZACIÓN
   ============================================================================ */

loadDashboardStats();