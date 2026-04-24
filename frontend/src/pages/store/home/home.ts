import { checkAuthUser } from "../../../utils/auth";
import { getCategories, PRODUCTS } from "../../../data/data";
import type { IProduct } from "../../../types/IProduct";
import { addProductToCart } from "../../../utils/cart";
import { mostrarToast } from "../../../utils/toast";
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
setupMenu("store", ".nav__menu");

// 3- CARGA DE DATOS EN MEMORIA
const categorias = getCategories();
const productos = PRODUCTS;

// 4- RENDERIZADO DEL MENÚ LATERAL Y FILTRADO POR CATEGORÍA
const listaCategorias = document.getElementById("lista-categorias") as HTMLUListElement;

if (listaCategorias) {

  // BOTÓN "TODAS LAS CATEGORÍAS" (RESET)
  const liTodas = document.createElement('li');
  liTodas.innerHTML = `<a href="#">Todas las categorías</a>`;
  liTodas.classList.add('sidebar__category-item');

  liTodas?.addEventListener('click', (e: Event) => {
    e.preventDefault();
    renderProducts(productos);
  });

  listaCategorias.appendChild(liTodas);

  // BOTONES DINÁMICOS POR CATEGORÍA
  categorias.forEach(categoria => {
    const li = document.createElement('li');
    li.innerHTML = `<a href="#">${categoria.nombre}</a>`;
    li.classList.add('sidebar__category-item');

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

const renderProducts = (productosAMostrar: IProduct[]) => {
  contenedorProductos.innerHTML = "";

  if (productosAMostrar.length === 0) {
    contenedorProductos.innerHTML = "<p class=\"products-empty-message\">No se encontraron productos para tu búsqueda.</p>";
    return;
  }

  productosAMostrar.forEach(producto => {
    const article = document.createElement('article');
    article.classList.add('product-card');
    article.innerHTML = `
      <img class="product-card__img" src="${producto.imagen}" alt="${producto.nombre}">
      <span class="product-card__category">${producto.categorias[0]?.nombre || 'Sin categoría'}</span>
      <h3 class="product-card__name">${producto.nombre}</h3>
      <p class="product-card__description">${producto.descripcion}</p>
      <p class="product-card__price">$ ${producto.precio}</p>
      <button class="product-card__btn-add">Agregar al Carrito</button>
    `;

    const boton = article.querySelector('.product-card__btn-add');

    // EVENTO DE AGREGAR AL CARRITO
    boton?.addEventListener('click', () => {
      addProductToCart(producto);
      mostrarToast(`¡${producto.nombre} agregado al carrito! 🍔`);
    });

    contenedorProductos.appendChild(article);
  });
};

// 6- INICIALIZACIÓN DEL CATÁLOGO
renderProducts(productos);

// 7- BÚSQUEDA Y FILTRADO EN TIEMPO REAL POR NOMBRE
const searchinput = document.getElementById("buscarProducto") as HTMLInputElement;

searchinput?.addEventListener("input", () => {
  const nombreBuscado = searchinput.value.toLowerCase().trim();
  const filtrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(nombreBuscado)
  );
  renderProducts(filtrados);
});
