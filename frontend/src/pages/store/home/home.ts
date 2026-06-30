import { checkAuthUser } from "../../../utils/auth";
import { setupMenu } from "../../../utils/menu";
import { apiFetch } from "../../../utils/api";
import { mostrarToast } from "../../../utils/toast";
import type { IProduct } from "../../../types/IProduct";
import type { ICategory } from "../../../types/ICategory";

/* ============================================================================
   SECCIÓN: CONTROL DE ACCESO E INICIALIZACIÓN
   ============================================================================ */
/**
 * Valida la sesión activa del usuario y determina sus permisos de acceso.
 * Si la validación falla, redirecciona al controlador correspondiente.
 */
const initPage = (): void => {
  checkAuthUser(
    "/src/pages/auth/login/login.html",
    "/src/pages/admin/adminHome/admin.html",
    ["client", "admin"]
  );
};
initPage();
setupMenu("store", "#nav-menu");

/* ============================================================================
   SECCIÓN: REFERENCIAS AL DOM Y ESTADO GLOBAL
   ============================================================================ */
let allProducts: IProduct[] = [];
let allCategories: ICategory[] = [];

/**
 * Máquina de estado para el motor de búsqueda. Almacena los criterios activos
 * que se aplicarán de forma concurrente sobre el catálogo de productos.
 */
const filterState = {
    search: "",
    categoryId: "all",
    sort: "default"
};

const contenedorProductos = document.getElementById("contenedor-productos") as HTMLDivElement;
const listaCategorias = document.getElementById("lista-categorias") as HTMLUListElement;
const productsCount = document.getElementById("products-count") as HTMLParagraphElement;

const searchInput = document.getElementById("buscarProducto") as HTMLInputElement;
const sortSelect = document.getElementById("ordenarProducto") as HTMLSelectElement;
const categorySelect = document.getElementById("categoriaProductoSelect") as HTMLSelectElement;
const searchForm = document.getElementById("search-form") as HTMLFormElement;

const btnToggleSidebar = document.getElementById("mobile-sidebar-toggle") as HTMLButtonElement;
const sidebar = document.getElementById("sidebar") as HTMLElement;
const sidebarOverlay = document.getElementById("sidebar-overlay") as HTMLDivElement;

/* ============================================================================
   SECCIÓN: MÉTODOS DE FORMATEO Y UTILERÍA VISUAL
   ============================================================================ */

/**
 * Devuelve un emoji correspondiente al nombre semántico de una categoría.
 *
 * @param categoryName - Nombre de la categoría a evaluar.
 * @returns Icono emoji representativo.
 */
const getCategoryEmoji = (categoryName: string): string => {
  const name = categoryName.toLowerCase();
  if (name.includes("pizza")) return "🍕";
  if (name.includes("hamburguesa")) return "🍔";
  if (name.includes("bebida")) return "🥤";
  if (name.includes("postre")) return "🍰";
  if (name.includes("empanada")) return "🥟";
  if (name.includes("ensalada")) return "🥗";
  return "🍽️";
};

/**
 * Ejecuta la mutación de clases CSS para alternar la visibilidad de la 
 * barra lateral de navegación en resoluciones móviles.
 */
const toggleMobileSidebar = (): void => {
    sidebar.classList.toggle("sidebar--active");
    sidebarOverlay.classList.toggle("sidebar-overlay--active");
};

btnToggleSidebar?.addEventListener("click", toggleMobileSidebar);
sidebarOverlay?.addEventListener("click", toggleMobileSidebar);

/* ============================================================================
   SECCIÓN: MOTOR DE FILTRADO COMBINADO Y RENDERIZACIÓN
   ============================================================================ */

/**
 * Extrae de forma segura el identificador de la categoría de un producto,
 * previniendo errores de tipado o variaciones en la estructura de la API.
 * * @param p - Instancia del producto a evaluar.
 * @returns Identificador numérico o cadena de la categoría vinculada.
 */
const getProductCategoryId = (p: any): string | undefined => {
    return (p.categoriaID || p.categoriaId || p.categoria?.id)?.toString();
};

/**
 * Aplica de forma secuencial la búsqueda textual, por categoría y ordenamiento matemático.
 */
const applyCombinedFilters = (): void => {
    let result = [...allProducts];

    // Fase 1: Coincidencia textual parcial
    if (filterState.search.trim() !== "") {
        const query = filterState.search.toLowerCase();
        result = result.filter(p => 
            p.nombre.toLowerCase().includes(query) || 
            p.descripcion.toLowerCase().includes(query)
        );
    }

    // Fase 2: Reducción por identificador categórico
    if (filterState.categoryId !== "all") {
        result = result.filter(p => {
            const idCat = getProductCategoryId(p);
            return idCat === filterState.categoryId;
        });
    }

    // Fase 3: Reordenamiento del conjunto de datos resultante
    switch (filterState.sort) {
        case "az":
            result.sort((a, b) => a.nombre.localeCompare(b.nombre));
            break;
        case "za":
            result.sort((a, b) => b.nombre.localeCompare(a.nombre));
            break;
        case "precioAsc":
            result.sort((a, b) => a.precio - b.precio);
            break;
        case "precioDesc":
            result.sort((a, b) => b.precio - a.precio);
            break;
    }

    renderProducts(result);
};

/**
 * Renderiza las tarjetas de productos resultantes en el contenedor correspondiente de la grilla.
 *
 * @param productsToRender - Colección ordenada de productos filtrados.
 */
const renderProducts = (productsToRender: IProduct[]): void => {
  if (!contenedorProductos) return;
  contenedorProductos.innerHTML = "";
  
  if (productsCount) {
      productsCount.textContent = `${productsToRender.length} producto(s) encontrado(s)`;
  }

  if (productsToRender.length === 0) {
      contenedorProductos.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #6b7280; margin-top: 2rem;">No se encontraron productos que coincidan con los filtros seleccionados.</p>`;
      return;
  }

  productsToRender.forEach((producto) => {
    const status = producto.disponible 
        ? { label: 'Disponible', className: 'badge--success' }
        : { label: 'Agotado', className: 'badge--danger' };

    const article = document.createElement("article");
    article.classList.add('product-card', 'product-card--clickable');
    
    const imgPath = producto.imagen?.startsWith('http') 
        ? producto.imagen 
        : new URL(`../../../assets/img/${producto.imagen}`, import.meta.url).href;

    // Resuelve el nombre semántico de la categoría cruzando los datos en memoria
    const idCat = getProductCategoryId(producto);
    const matchedCategory = allCategories.find(c => c.id.toString() === idCat);
    const categoryName = matchedCategory ? matchedCategory.nombre : 'Sin categoría';

    article.innerHTML = `
      <img class="product-card__img" src="${imgPath}" alt="${producto.nombre}">
      <div class="product-card__body">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
            <span class="product-card__category">${categoryName}</span>
        </div>
        <h3 class="product-card__name">${producto.nombre}</h3>
        <p class="product-card__description">${producto.descripcion}</p>
        <p class="product-card__price">$ ${producto.precio.toFixed(2)}</p>
        <span class="product-card__status badge ${status.className}" style="align-self: flex-start; font-size: 0.75rem;">${status.label}</span>
      </div>
    `;

    article.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target.closest('button, a')) return;
      window.location.href = `../productDetail/productDetail.html?id=${producto.id}`;
    });

    contenedorProductos.appendChild(article);
  });
};

/**
 * Dibuja los elementos del menú lateral y añade las opciones al selector nativo del buscador.
 */
const renderCategories = (): void => {
    if (!listaCategorias) return;
    listaCategorias.innerHTML = `
        <li class="sidebar__category-item">
            <a href="#" class="nav__link nav__link--active" data-id="all">🍽️ Todas las categorías</a>
        </li>
    `;

    allCategories.forEach(categoria => {
        const li = document.createElement("li");
        li.className = "sidebar__category-item";
        li.innerHTML = `<a href="#" class="nav__link" data-id="${categoria.id}">${getCategoryEmoji(categoria.nombre)} ${categoria.nombre}</a>`;
        listaCategorias.appendChild(li);

        if (categorySelect) {
            const option = document.createElement("option");
            option.value = categoria.id.toString();
            option.textContent = categoria.nombre;
            categorySelect.appendChild(option);
        }
    });
};

/**
 * Recupera de forma asíncrona la información del catálogo desde los endpoints REST del backend.
 */
const fetchStoreData = async (): Promise<void> => {
    try {
        const [categories, products] = await Promise.all([
            apiFetch("/categories") as Promise<ICategory[]>,
            apiFetch("/products") as Promise<IProduct[]>
        ]);
        
        allCategories = categories;
        allProducts = products;
        
        renderCategories();
        applyCombinedFilters();
        
    } catch (error) {
        console.error("Error fetching store data:", error);
        mostrarToast("No fue posible establecer conexión con el catálogo.");
    }
};

/* ============================================================================
   SECCIÓN: ESCUCHADORES DE EVENTOS E INTERACCIONES
   ============================================================================ */
searchInput?.addEventListener("input", (e: Event) => {
    filterState.search = (e.target as HTMLInputElement).value;
    applyCombinedFilters();
});

sortSelect?.addEventListener("change", (e: Event) => {
    filterState.sort = (e.target as HTMLSelectElement).value;
    applyCombinedFilters();
});

categorySelect?.addEventListener("change", (e: Event) => {
    const selectedId = (e.target as HTMLSelectElement).value;
    filterState.categoryId = selectedId;
    
    document.querySelectorAll(".sidebar__category-item .nav__link").forEach(link => {
        link.classList.remove("nav__link--active");
        if ((link as HTMLElement).dataset.id === selectedId) {
            link.classList.add("nav__link--active");
        }
    });
    
    applyCombinedFilters();
});

listaCategorias?.addEventListener("click", (e: Event) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains("nav__link")) {
        e.preventDefault();
        
        document.querySelectorAll(".sidebar__category-item .nav__link").forEach(link => link.classList.remove("nav__link--active"));
        target.classList.add("nav__link--active");
        
        const categoryId = target.dataset.id || "all";
        filterState.categoryId = categoryId;
        
        if (categorySelect) {
            categorySelect.value = categoryId;
        }
        
        if (window.innerWidth <= 1024) {
            toggleMobileSidebar();
        }
        
        applyCombinedFilters();
    }
});

searchForm?.addEventListener("submit", (e: Event) => e.preventDefault());

fetchStoreData();