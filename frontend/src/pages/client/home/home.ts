import { checkAuhtUser, logout } from "../../../utils/auth";
import { categorias, productos } from "../../../utils/data";

const initPage = () => {
  console.log("inicio de pagina");
  checkAuhtUser(
    "/src/pages/auth/login/login.html",
    "/src/pages/admin/home/admin.html",
    "client"
  );
};
initPage();

// Cargamos las categorias en la barra lateral
const listaCategorias = document.getElementById("lista-categorias");

if (listaCategorias) { // Validamos que el elemento exista en el HTML
  categorias.forEach(categoria => {
    const li = document.createElement('li');
    li.innerHTML = `<a href="#">${categoria}</a>`;
    li.classList.add('sidebar__category-item');
    listaCategorias.appendChild(li);
  })
}

// Cargamos los productos en la grilla central
const listaProductos = document.getElementById("contenedor-productos");

if (listaProductos) { // Validamos que el elemento exista en el HTML
  productos.forEach(producto => {
    const article = document.createElement('article');
    article.classList.add('product-card'); 
    article.innerHTML =`
      <img class="product-card__img" src="${producto.imagen}" alt="${producto.nombre}" width="250px">
      <h3 class="product-card__name" >${producto.nombre}</h3>
      <p class="product-card__description" >${producto.descripcion}</p>
      <p class="product-card__price" >Precio: <strong>$ ${producto.precio}</strong></p>
      <button class="product-card__btn-details">Ver Detalles</button>
      <button class="product-card__btn-add">Agregar al Carrito</button>`
    
    // Agregamos el evento al botón de "Agregar"
    const boton = article.querySelector('.product-card__btn-add');
    boton?.addEventListener('click', () => {
      alert(`${producto.nombre} se agregó al carrito correctamente.`);
    })

    listaProductos.appendChild(article);
  })
}

// Cerrar sesión
const buttonLogout = document.getElementById("logoutButton") as HTMLButtonElement;
buttonLogout?.addEventListener("click", (e: Event) => {
  e.preventDefault();
  logout();
});



