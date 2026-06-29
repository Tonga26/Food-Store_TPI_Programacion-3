import { checkAuthUser } from "../../../utils/auth";
import { setupMenu } from "../../../utils/menu";
import { apiFetch } from "../../../utils/api";
import { mostrarToast } from "../../../utils/toast";
import type { ICategory } from "../../../types/ICategory";
import type { IProduct } from "../../../types/IProduct";

/**
 * Control de acceso y configuración inicial de sesión para el panel principal.
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

/**
 * Referencias al DOM para la inyección de métricas.
 */
const statCategories = document.getElementById("stat-categories") as HTMLParagraphElement | null;
const statProducts = document.getElementById("stat-products") as HTMLParagraphElement | null;
const summaryText = document.querySelector(".dashboard-summary__text") as HTMLParagraphElement | null;

/**
 * Orquesta las peticiones asíncronas concurrentes para resolver las estadísticas del sistema
 * y renderiza los indicadores (KPIs) en el Dashboard.
 */
const loadDashboardStats = async (): Promise<void> => {
  try {
    // Fase 1: Extracción concurrente de datos de Categorías y Productos
    const [categories, products] = await Promise.all([
        apiFetch("/categories") as Promise<ICategory[]>,
        apiFetch("/products") as Promise<IProduct[]>
    ]);
    
    // Inyección en la UI
    if (statCategories) {
      statCategories.textContent = categories.length.toString();
    }
    if (statProducts) {
      statProducts.textContent = products.length.toString();
    }

    // Actualización del estado global de la vista
    if (summaryText) {
      // Nota: Aquí integraremos las métricas de stock crítico más adelante
      summaryText.textContent = "Sistema en línea. Estadísticas sincronizadas con la base de datos.";
    }

  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    mostrarToast("Excepción de red: Imposible sincronizar métricas del sistema.");
    
    if (summaryText) {
      summaryText.textContent = "Alerta: El sistema operando fuera de línea o sin conexión al servidor.";
    }
  }
};

// Inicialización de la ingesta de datos
loadDashboardStats();