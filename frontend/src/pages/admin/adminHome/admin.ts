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

/**
 * Intercepta la carga del módulo para validar la autenticación y el rol de sesión.
 * Redirecciona al usuario en caso de validación negativa.
 */
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

/**
 * Orquesta peticiones HTTP concurrentes para extraer métricas globales de la base de datos,
 * aplica funciones de reducción y agrupamiento, e inyecta dinámicamente los KPIs.
 * * @returns {Promise<void>} Promesa que resuelve al finalizar la mutación del DOM.
 */
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
                <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px dashed #e5e7eb;">
                    <span style="font-weight: 600; color: #4b5563;">${estado}</span>
                    <span style="font-weight: 700; color: #ff6347; background: #fff0ed; padding: 0.1rem 0.6rem; border-radius: 20px;">${cantidad}</span>
                </div>
            `).join('');

        summaryContainer.innerHTML = `
            <h3 class="dashboard-summary__title" style="margin-bottom: 1.5rem; font-size: 1.25rem;">📊 Panel de Resumen Detallado</h3>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
                
                <div style="background: #ffffff; padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #ecf0f1;">
                    <h4 style="margin-bottom: 1rem; color: #1f2937; border-bottom: 2px solid #f3f4f6; padding-bottom: 0.5rem;">📦 Inventario Operativo</h4>
                    
                    <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px dashed #e5e7eb;">
                        <span style="font-weight: 600; color: #4b5563;">Categorías Activas</span>
                        <span style="font-weight: 700; color: #3b82f6;">${totalCategories}</span>
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px dashed #e5e7eb;">
                        <span style="font-weight: 600; color: #4b5563;">Productos Activos</span>
                        <span style="font-weight: 700; color: #10b981;">${activeProducts}</span>
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; padding: 0.5rem 0;">
                        <span style="font-weight: 600; color: #4b5563;">Productos Inactivos</span>
                        <span style="font-weight: 700; color: #ef4444;">${inactiveProducts}</span>
                    </div>
                </div>

                <div style="background: #ffffff; padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #ecf0f1;">
                    <h4 style="margin-bottom: 1rem; color: #1f2937; border-bottom: 2px solid #f3f4f6; padding-bottom: 0.5rem;">🚚 Pedidos por Estado</h4>
                    
                    ${orderStatsHTML || '<p style="color: #6b7280; font-size: 0.9rem; text-align: center; margin-top: 1rem;">No hay operaciones registradas.</p>'}
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
          <div style="background-color: #fee2e2; color: #991b1b; padding: 1rem; border-radius: 8px; margin-top: 1rem; border: 1px solid #fca5a5;">
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