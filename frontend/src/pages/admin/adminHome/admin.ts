import { checkAuthUser } from "../../../utils/auth";
import { setupMenu } from "../../../utils/menu";
import { apiFetch } from "../../../utils/api";
import { mostrarToast } from "../../../utils/toast";
import type { ICategory } from "../../../types/ICategory";
import type { IProduct } from "../../../types/IProduct";
import type { IOrder } from "../../../types/IOrder";

/**
 * ============================================================================
 * SECCIÓN: CONTROL DE SESIÓN Y VISTA
 * ============================================================================
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

const statCategories = document.getElementById("stat-categories") as HTMLParagraphElement | null;
const statProducts = document.getElementById("stat-products") as HTMLParagraphElement | null;
const statOrders = document.getElementById("stat-orders") as HTMLParagraphElement | null;
const summaryText = document.querySelector(".dashboard-summary__text") as HTMLParagraphElement | null;

/**
 * ============================================================================
 * SECCIÓN: MOTOR DE INGESTA DE ESTADÍSTICAS EN TIEMPO REAL
 * ============================================================================
 */
const loadDashboardStats = async (): Promise<void> => {
  try {
    const [categories, products, orders] = await Promise.all([
      apiFetch("/categories") as Promise<ICategory[]>,
      apiFetch("/products") as Promise<IProduct[]>,
      apiFetch("/orders") as Promise<IOrder[]>
    ]);

    if (statCategories) statCategories.textContent = categories.length.toString();
    if (statProducts) statProducts.textContent = products.length.toString();
    if (statOrders) statOrders.textContent = orders.length.toString();

    if (summaryText) {
      summaryText.textContent = "Sistema en línea. Estadísticas sincronizadas con la base de datos.";
    }

  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    mostrarToast("Excepción de red: Imposible sincronizar métricas del sistema.");
  }
};

loadDashboardStats();