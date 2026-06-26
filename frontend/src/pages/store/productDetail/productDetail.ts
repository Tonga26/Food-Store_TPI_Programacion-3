import { checkAuthUser } from "../../../utils/auth";
import { PRODUCTS } from "../../../data/data";
import { addProductToCart } from "../../../utils/cart";
import { mostrarToast } from "../../../utils/toast";
import { setupMenu } from "../../../utils/menu";
import type { IProduct } from "../../../types/IProduct";

// 1- VALIDA EL ACCESO Y LIMITA LA VISTA A USUARIOS CLIENTE
const initPage = () => {
  checkAuthUser(
    "/src/pages/auth/login/login.html",
    "/src/pages/admin/adminHome/admin.html",
    "client"
  );
};

initPage();
setupMenu("store", "#nav-menu");

const productDetailContainer = document.getElementById("product-detail") as HTMLElement | null;
const searchParams = new URLSearchParams(window.location.search);
const productId = Number(searchParams.get("id"));

// 2- DEFINE EL ESTADO VISUAL SEGUN EL STOCK DEL PRODUCTO
const getProductStockState = (product: IProduct) => {
  if (!product.disponible || product.stock <= 0) {
    return { label: "No disponible", className: "product-detail__status--danger" };
  }

  if (product.stock < 5) {
    return { label: "Casi sin stock", className: "product-detail__status--warning" };
  }

  return { label: "Disponible", className: "product-detail__status--success" };
};

// 3- MUESTRA UN MENSAJE SIMPLE SI EL PRODUCTO NO EXISTE
const renderNotFound = () => {
  if (!productDetailContainer) return;

  productDetailContainer.innerHTML = `
    <article class="product-detail__card product-detail__card--empty">
      <div class="product-detail__info">
        <h2 class="product-detail__title">Producto no encontrado</h2>
        <p class="product-detail__description">El producto que buscás no existe o ya no está disponible en esta vista.</p>
        <a class="product-detail__back-link" href="../home/home.html">← Volver</a>
      </div>
    </article>
  `;
};

// 4- RENDERIZA LA TARJETA GRANDE DEL PRODUCTO Y SUS CONTROLES
const renderProductDetail = (product: IProduct) => {
  if (!productDetailContainer) return;

  const status = getProductStockState(product);
  let quantity = 1;

  productDetailContainer.innerHTML = `
    <article class="product-detail__card">
      <div class="product-detail__media">
        <img class="product-detail__img" src="${product.imagen}" alt="${product.nombre}">
      </div>

      <div class="product-detail__info">
        <span class="product-detail__category">${product.categorias[0]?.nombre || "Sin categoría"}</span>
        <h2 class="product-detail__title">${product.nombre}</h2>
        <p class="product-detail__price">$ ${product.precio}</p>
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

  // 4.1- CAPTURA LOS CONTROLES PARA MODIFICAR LA CANTIDAD
  const quantityValue = document.getElementById("quantity-value") as HTMLSpanElement | null;
  const quantityMinus = document.getElementById("quantity-minus") as HTMLButtonElement | null;
  const quantityPlus = document.getElementById("quantity-plus") as HTMLButtonElement | null;
  const btnAddCart = document.getElementById("btn-add-cart") as HTMLButtonElement | null;

  // 4.2- SINCRONIZA EL ESTADO DE LOS BOTONES SEGUN LA CANTIDAD Y EL STOCK
  const updateQuantity = () => {
    if (quantityValue) quantityValue.textContent = String(quantity);
    if (quantityMinus) quantityMinus.disabled = quantity <= 1;
    if (quantityPlus) quantityPlus.disabled = quantity >= product.stock || product.stock <= 0;
    if (btnAddCart) btnAddCart.disabled = product.stock <= 0;
  };

  // 4.3- DISMINUYE LA CANTIDAD SOLO SI ES MAYOR A UNO
  quantityMinus?.addEventListener("click", () => {
    if (quantity > 1) {
      quantity -= 1;
      updateQuantity();
    }
  });

  // 4.4- AUMENTA LA CANTIDAD HASTA EL LIMITE DEL STOCK
  quantityPlus?.addEventListener("click", () => {
    if (quantity < product.stock && product.stock > 0) {
      quantity += 1;
      updateQuantity();
    }
  });

  // 4.5- AGREGA AL CARRITO LA CANTIDAD SELECCIONADA Y MUESTRA UN TOAST
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

// 5- BUSCA EL PRODUCTO SOLICITADO Y RENDERIZA LA VISTA ADECUADA
const product = PRODUCTS.find((item) => item.id === productId);

if (!product) {
  renderNotFound();
} else {
  renderProductDetail(product);
}
