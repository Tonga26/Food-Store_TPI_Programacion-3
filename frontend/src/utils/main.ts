
// Array de categorias
const listaCategorias = document.getElementById("lista-categorias");

// Cargamos las categorias
const cargarCategorias = () => {
    categorias.forEach(categoria => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="#">${categoria}</a>`;
        li.classList.add('sidebar__category-item');
        listaCategorias.appendChild(li);
    });
}

cargarCategorias();

// Array de productos
const listaProductos = document.getElementById("contenedor-productos");

// Cargamos los productos
const cargarProductos = () => {
    productos.forEach(producto => {
        const article = document.createElement('article');
        article.innerHTML =  `  
            <img class="product-card__img" src="${producto.imagen}" alt="${producto.nombre}" width="250px">
            <h3 class="product-card__name" >${producto.nombre}</h3>
            <p class="product-card__description" >${producto.descripcion}</p>
            <p class="product-card__price" >Precio: <strong>$ ${producto.precio}</strong></p>
            <button class="product-card__btn-details">Ver Detalles</button>
            <button class="product-card__btn-add">Agregar al Carrito</button>`;
        
            article.classList.add('product-card');

        const boton = article.querySelector('.product-card__btn-add');
        boton.addEventListener('click', () => {
            alert(`${producto.nombre} se agregó al carrito correctamente`);
        })
        
        listaProductos.appendChild(article);
    });
}

cargarProductos();