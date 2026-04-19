import { checkAuthUser } from "../../../utils/auth";
import { PRODUCTS, getCategories } from "../../../utils/data";
import { setupMenu } from "../../../utils/menu";

// 1- VALIDA AUTENTICACION Y ROL ADMIN ANTES DE CARGAR LA VISTA
const initPage = () => {
  console.log("inicio de pagina");
  checkAuthUser(
    "/src/pages/auth/login/login.html",
    "/src/pages/store/home/home.html",
    "admin"
  );
};
initPage();

// 2- RENDERIZA EL MENU SUPERIOR DEL PANEL ADMIN SEGUN EL ROL DEL USUARIO
setupMenu("admin", "header nav ul");

// 3- REFERENCIAS A ELEMENTOS DEL DOM QUE SE VAN A RENDERIZAR
const productsTableBody = document.getElementById("admin-products-body") as HTMLTableSectionElement | null;
const categorySelect = document.getElementById("categoria") as HTMLSelectElement | null;

// 4- FORMATEA PRECIOS AL ESTILO ARGENTINO PARA MOSTRAR EN TABLA
const formatPrice = (price: number): string => {
  return price.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  });
};

// 5- RENDERIZA FILAS DE PRODUCTOS DEL DATASET EN LA TABLA ADMIN
const renderAdminProducts = (): void => {
  // CORTA SI EL TBODY NO EXISTE EN EL HTML
  if (!productsTableBody) return;

  // LIMPIA TABLA ANTES DE VOLVER A PINTAR LOS DATOS
  productsTableBody.innerHTML = "";

  // CREA UNA FILA POR CADA PRODUCTO DISPONIBLE
  PRODUCTS.forEach((product) => {
    const row = document.createElement("tr");
    const categoriesText = product.categorias.map((category) => category.nombre).join(", ");

    row.innerHTML = `
      <td>${product.id}</td>
      <td><img src="${product.imagen}" alt="${product.nombre}" width="100" height="80"></td>
      <td>${product.nombre}</td>
      <td>${categoriesText}</td>
      <td>${formatPrice(product.precio)}</td>
      <td>${product.stock}</td>
      <td class="table__actions">
        <a href="#" class="btn-action btn-action--edit">Editar</a>
        <a href="#" class="btn-action btn-action--delete">Eliminar</a>
      </td>
    `;

    productsTableBody.appendChild(row);
  });
};

// 6- RENDERIZA LAS OPCIONES DE CATEGORIAS EN EL SELECT DEL FORMULARIO
const renderCategoryOptions = (): void => {
  // CORTA SI EL SELECT NO EXISTE EN EL HTML.
  if (!categorySelect) return;

  // OBTIENE CATEGORIAS ACTIVAS DESDE LA FUENTE DE DATOS
  const categories = getCategories();

  // LIMPIA OPCIONES PREVIAS PARA EVITAR DUPLICADOS
  categorySelect.innerHTML = "";

  // AGREGA OPCION INICIAL VACIA COMO PLACEHOLDER
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Elige una opción...";
  categorySelect.appendChild(defaultOption);

  // AGREGA UNA OPCION POR CADA CATEGORIA DISPONIBLE
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = String(category.id);
    option.textContent = category.nombre;
    categorySelect.appendChild(option);
  });
};

// 7- DISPARA EL RENDER INICIAL DE TABLA Y SELECT
renderAdminProducts();
renderCategoryOptions();

