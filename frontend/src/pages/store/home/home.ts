import { checkAuthUser } from "../../../utils/auth";
import { getCategories, PRODUCTS } from "../../../data/data";
import type { IProduct } from "../../../types/IProduct";
import { setupMenu } from "../../../utils/menu";

// 1- VERIFICACIÓN DE PERMISOS Y AUTENTICACIÓN
const initPage = () => {
  checkAuthUser(
    "/src/pages/auth/login/login.html",
    "/src/pages/admin/adminHome/admin.html",
    "client"
  );
};
initPage();

// 2- RENDERIZA EL MENU SUPERIOR DEL CATALOGO SEGUN EL ROL DEL USUARIO
setupMenu("store", "#nav-menu");

// 3- CARGA DE DATOS EN MEMORIA
const categorias = getCategories();
const productos = PRODUCTS;

// 3.1- DEVUELVE UN EMOJI ACORDE A LA CATEGORIA PARA HACER MAS LECTIBLE EL MENU
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

// 3.2- DEFINE EL TEXTO Y COLOR SEGUN EL ESTADO DEL STOCK
const getProductStockState = (product: IProduct) => {
  if (!product.disponible || product.stock <= 0) {
    return { label: "No disponible", className: "product-card__status--danger" };
  }

  if (product.stock < 5) {
    return { label: "Casi sin stock", className: "product-card__status--warning" };
  }

  return { label: "Disponible", className: "product-card__status--success" };
};

// 4- RENDERIZADO DEL MENÚ LATERAL Y FILTRADO POR CATEGORÍA
const listaCategorias = document.getElementById("lista-categorias") as HTMLUListElement;

if (listaCategorias) {

  // BOTÓN "TODAS LAS CATEGORÍAS" (RESET)
  const liTodas = document.createElement('li');
  liTodas.innerHTML = `<a href="#">📋 Todas las categorías</a>`;
  liTodas.classList.add('sidebar__category-item');

  // 4.1- RESTABLECE LA GRILLA COMPLETA AL SELECCIONAR TODAS LAS CATEGORIAS
  liTodas?.addEventListener('click', (e: Event) => {
    e.preventDefault();
    renderProducts(productos);
  });

  listaCategorias.appendChild(liTodas);

  // BOTONES DINÁMICOS POR CATEGORÍA
  categorias.forEach(categoria => {
    const li = document.createElement('li');
    li.innerHTML = `<a href="#">${getCategoryEmoji(categoria.nombre)} ${categoria.nombre}</a>`;
    li.classList.add('sidebar__category-item');

    // 4.2- FILTRA LOS PRODUCTOS DE ACUERDO A LA CATEGORIA ELEGIDA
    li?.addEventListener('click', (e: Event) => {
      e.preventDefault();
      const productosFiltrados = productos.filter(p =>
        p.categorias.some(c => c.id === categoria.id)
      );
      renderProducts(productosFiltrados);
    });

    listaCategorias.appendChild(li);
  });
}

// 5- RENDERIZADO DE LA GRILLA DE PRODUCTOS
const contenedorProductos = document.getElementById("contenedor-productos") as HTMLDivElement;
const productsCount = document.getElementById("products-count") as HTMLParagraphElement | null;

// 5.1- ACTUALIZA EL TEXTO SUPERIOR CON LA CANTIDAD ACTUAL DE PRODUCTOS
const updateProductsCount = (count: number) => {
  if (!productsCount) return;
  productsCount.textContent = `${count} ${count === 1 ? "producto" : "productos"}`;
};

// 5.2- DIBUJA LAS TARJETAS DE PRODUCTOS SEGUN EL FILTRO ACTIVO
const renderProducts = (productosAMostrar: IProduct[]) => {
  contenedorProductos.innerHTML = "";
  updateProductsCount(productosAMostrar.length);

  if (productosAMostrar.length === 0) {
    contenedorProductos.innerHTML = "<p class=\"products-empty-message\">No se encontraron productos para tu búsqueda.</p>";
    return;
  }

  productosAMostrar.forEach(producto => {
    const status = getProductStockState(producto);
    const article = document.createElement('article');
    article.classList.add('product-card', 'product-card--clickable');
    article.innerHTML = `
      <img class="product-card__img" src="${producto.imagen}" alt="${producto.nombre}">
      <div class="product-card__body">
        <span class="product-card__category">${producto.categorias[0]?.nombre || 'Sin categoría'}</span>
        <h3 class="product-card__name">${producto.nombre}</h3>
        <p class="product-card__description">${producto.descripcion}</p>
        <p class="product-card__price">$ ${producto.precio}</p>
        <span class="product-card__status ${status.className}">${status.label}</span>
      </div>
    `;

    // 5.3- ABRE LA VISTA DE DETALLE AL HACER CLIC EN LA TARJETA
    article.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;

      if (target.closest('button, a')) return;

      window.location.href = `../productDetail/productDetail.html?id=${producto.id}`;
    });

    contenedorProductos.appendChild(article);
  });
};

// 6- INICIALIZACIÓN DEL CATÁLOGO
renderProducts(productos);

// 7- BÚSQUEDA Y FILTRADO EN TIEMPO REAL POR NOMBRE
const searchinput = document.getElementById("buscarProducto") as HTMLInputElement;

// 7.1- FILTRA LOS PRODUCTOS ESCRITOS EN EL BUSCADOR
searchinput?.addEventListener("input", () => {
  const nombreBuscado = searchinput.value.toLowerCase().trim();
  const filtrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(nombreBuscado)
  );
  renderProducts(filtrados);
});
