import { checkAuthUser, logout } from "../../../utils/auth";
import { getCategories, PRODUCTS } from "../../../utils/data";
import type { Product } from "../../../types/Product";

// Verifica si el usuario tiene permiso (rol client) para acceder a esta vista
const initPage = () => {
  checkAuthUser(
    "/src/pages/auth/login/login.html",
    "/src/pages/admin/adminHome/admin.html",
    "client"
  );
};
initPage();

const categorias = getCategories();
const productos = PRODUCTS;

const listaCategorias = document.getElementById("lista-categorias");

if (listaCategorias) {
  categorias.forEach(categoria => {
    const li = document.createElement('li');
    li.innerHTML = `<a href="#">${categoria.nombre}</a>`;
    li.classList.add('sidebar__category-item');
    listaCategorias.appendChild(li);
  });
}

const contenedorProductos = document.getElementById("contenedor-productos") as HTMLDivElement;

// Renderiza dinámicamente las tarjetas de los productos en la grilla del DOM
const renderProducts = (productosAMostrar: Product[]) => {
  contenedorProductos.innerHTML = "";

  if (productosAMostrar.length === 0) {
    contenedorProductos.innerHTML = "<p>No se encontraron productos para tu búsqueda.</p>";
    return;
  }

  productosAMostrar.forEach(producto => {
    const article = document.createElement('article');
    article.classList.add('product-card');
    article.innerHTML = `
      <img class="product-card__img" src="${producto.imagen}" alt="${producto.nombre}">
      <h3 class="product-card__name">${producto.nombre}</h3>
      <p class="product-card__description">${producto.descripcion}</p>
      <p class="product-card__price">Precio: <strong>$ ${producto.precio}</strong></p>
      <button class="product-card__btn-details">Ver Detalles</button>
      <button class="product-card__btn-add">Agregar al Carrito</button>
    `;

    const boton = article.querySelector('.product-card__btn-add');
    
    // Muestra una alerta confirmando que el producto se agregó al carrito
    boton?.addEventListener('click', () => {
      alert(`${producto.nombre} se agregó al carrito correctamente.`);
    });

    contenedorProductos.appendChild(article);
  });
};

renderProducts(productos);

const form = document.getElementById("search-form") as HTMLFormElement;
const searchinput = document.getElementById("buscarProducto") as HTMLInputElement;

// Filtra los productos en tiempo real a medida que el usuario escribe en el input
searchinput?.addEventListener("input", () => {
  const nombreBuscado = searchinput.value.toLowerCase().trim();
  const filtrados = productos.filter(p => 
    p.nombre.toLowerCase().includes(nombreBuscado)
  );
  renderProducts(filtrados);
});

const buttonLogout = document.getElementById("logoutButton") as HTMLButtonElement;

// Cierra la sesión del usuario y lo redirige al login
buttonLogout?.addEventListener("click", (e: Event) => {
  e.preventDefault();
  logout();
});