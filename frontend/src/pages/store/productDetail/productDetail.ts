import { checkAuthUser } from "../../../utils/auth";
import { setupMenu } from "../../../utils/menu";
import { addProductToCart } from "../../../utils/cart";
import { mostrarToast } from "../../../utils/toast";
import { apiFetch } from "../../../utils/api";
import type { IProduct } from "../../../types/IProduct";
import type { ICategory } from "../../../types/ICategory";

/* ============================================================================
   SECCIÓN 1: CONTROL DE ACCESO
   ============================================================================ */

/**
 * Valida la sesión activa del usuario y determina sus permisos de acceso.
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
   SECCIÓN 2: REFERENCIAS AL DOM Y ESTADO GLOBAL
   ============================================================================ */

const productDetailContainer = document.getElementById("product-detail") as HTMLElement | null;
const searchParams = new URLSearchParams(window.location.search);
const productId = Number(searchParams.get("id"));

let allCategories: ICategory[] = [];

/* ============================================================================
   SECCIÓN 3: UTILIDADES Y FORMATEO
   ============================================================================ */

/**
 * Define el estado visual de stock de un producto para la interfaz de usuario.
 *
 * @param product - Objeto del producto a evaluar.
 * @returns Objeto con etiqueta semántica y clase CSS correspondiente.
 */
const getProductStockState = (product: IProduct) => {
  if (!product.disponible || product.stock <= 0) {
    return { label: "No disponible", className: "product-detail__status--danger" };
  }
  if (product.stock < 5) {
    return { label: "Casi sin stock", className: "product-detail__status--warning" };
  }
  return { label: "Disponible", className: "product-detail__status--success" };
};

/**
 * Extrae de forma segura el identificador de la categoría de un producto.
 *
 * @param p - Instancia del producto a evaluar.
 * @returns Identificador numérico o cadena de la categoría vinculada.
 */
const getProductCategoryId = (p: any): string | undefined => {
    return (p.categoriaID || p.categoriaId || p.categoria?.id)?.toString();
};

/* ============================================================================
   SECCIÓN 4: RENDERIZADO VISUAL E INTERACTIVIDAD
   ============================================================================ */

/**
 * Inyecta un mensaje de error estilizado si el producto no se encuentra en el servidor.
 */
const renderNotFound = (): void => {
  if (!productDetailContainer) return;
  productDetailContainer.innerHTML = `
    <article class="product-detail__card product-detail__card--empty">
      <div class="product-detail__info">
        <h2 class="product-detail__title">Producto no encontrado</h2>
        <p class="product-detail__description">El producto que buscás no existe o ya no está disponible en la base de datos.</p>
        <a class="product-detail__back-link" href="../home/home.html">← Volver al catálogo</a>
      </div>
    </article>
  `;
};

/**
 * Construye e inyecta la tarjeta principal de detalle de producto y configura
 * los eventos de sus controles interactivos (botones de cantidad y agregar al carrito).
 *
 * @param product - Producto obtenido dinámicamente desde la API Rest.
 */
const renderProductDetail = (product: IProduct): void => {
  if (!productDetailContainer) return;

  const status = getProductStockState(product);
  let quantity = 1;

  const imgPath = product.imagen?.startsWith('http') 
        ? product.imagen 
        : new URL(`../../../assets/img/${product.imagen}`, import.meta.url).href;

  const idCat = getProductCategoryId(product);
  const matchedCategory = allCategories.find(c => c.id.toString() === idCat);
  const categoryName = matchedCategory ? matchedCategory.nombre : 'Sin categoría';

  productDetailContainer.innerHTML = `
    <article class="product-detail__card">
      <div class="product-detail__media">
        <img class="product-detail__img" src="${imgPath}" alt="${product.nombre}">
      </div>

      <div class="product-detail__info">
        <span class="product-detail__category">${categoryName}</span>
        <h2 class="product-detail__title">${product.nombre}</h2>
        <p class="product-detail__price">$ ${product.precio.toFixed(2)}</p>
        <p class="product-detail__stock ${status.className}">
          ${status.label} <strong>(Stock: ${product.stock})</strong>
        </p>
        <p class="product-detail__description">${product.descripcion}</p>

        <div class="product-detail__quantity-block">
          <p class="product-detail__quantity-label">Cantidad</p>
          <div class="product-detail__quantity-controls">
            <button class="product-detail__quantity-btn" id="quantity-minus" type="button">-</button>
            <span class="product-detail__quantity-value" id="quantity-value">1</span>
            <button class="product-detail__quantity-btn" id="quantity-plus" type="button">+</button>
          </div>
        </div>

        <div class="product-detail__actions">
          <button class="product-card__btn-add" id="btn-add-cart" type="button">Agregar al Carrito</button>
          <a class="product-detail__back-link" href="../home/home.html">← Volver</a>
        </div>
      </div>
    </article>
  `;

  const quantityValue = document.getElementById("quantity-value") as HTMLSpanElement | null;
  const quantityMinus = document.getElementById("quantity-minus") as HTMLButtonElement | null;
  const quantityPlus = document.getElementById("quantity-plus") as HTMLButtonElement | null;
  const btnAddCart = document.getElementById("btn-add-cart") as HTMLButtonElement | null;

  const updateQuantity = () => {
    if (quantityValue) quantityValue.textContent = String(quantity);
    if (quantityMinus) quantityMinus.disabled = quantity <= 1;
    if (quantityPlus) quantityPlus.disabled = quantity >= product.stock || product.stock <= 0;
    if (btnAddCart) btnAddCart.disabled = product.stock <= 0;
  };

  quantityMinus?.addEventListener("click", () => {
    if (quantity > 1) {
      quantity -= 1;
      updateQuantity();
    }
  });

  quantityPlus?.addEventListener("click", () => {
    if (quantity < product.stock && product.stock > 0) {
      quantity += 1;
      updateQuantity();
    }
  });

  btnAddCart?.addEventListener("click", () => {
    if (product.stock <= 0) return;

    for (let index = 0; index < quantity; index += 1) {
      addProductToCart(product);
    }

    setupMenu("store", "#nav-menu");
    mostrarToast(`¡${quantity} x ${product.nombre} agregado al carrito! 🍔`);
  });

  updateQuantity();
};

/* ============================================================================
   SECCIÓN 5: CONSUMO DE API REST Y ARRANQUE
   ============================================================================ */

/**
 * Consulta de forma asíncrona y concurrente el catálogo de categorías y la
 * información específica del producto seleccionado para su inyección en la UI.
 */
const fetchProductDetail = async (): Promise<void> => {
  if (isNaN(productId) || productId <= 0) {
      renderNotFound();
      return;
  }

  try {
    const [categories, product] = await Promise.all([
        apiFetch("/categories") as Promise<ICategory[]>,
        apiFetch(`/products/${productId}`) as Promise<IProduct>
    ]);
    
    allCategories = categories;
    renderProductDetail(product);
    
  } catch (error) {
    console.error("Error al obtener detalle de producto:", error);
    renderNotFound();
    mostrarToast("No fue posible cargar la información del producto.");
  }
};

fetchProductDetail();