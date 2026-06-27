import { checkAuthUser } from "../../../utils/auth";
import { setupMenu } from "../../../utils/menu";
import { PRODUCTS, getCategories } from "../../../data/data";

// 1- CONTROL DE ACCESO Y SESIÓN
const initPage = (): void => {
  checkAuthUser(
    "/src/pages/auth/login/login.html",
    "/src/pages/store/home/home.html",
    "admin"
  );
};
initPage();
setupMenu("admin", "#nav-menu");

// 2- REFERENCIAS AL DOM
const tableBody = document.getElementById("products-table-body") as HTMLTableSectionElement | null;
const btnAddProduct = document.getElementById("btn-add-product") as HTMLButtonElement | null;
const modal = document.getElementById("product-modal") as HTMLDivElement | null;
const modalOverlay = document.getElementById("modal-overlay") as HTMLDivElement | null;
const btnCloseModal = document.getElementById("modal-close") as HTMLButtonElement | null;
const productForm = document.getElementById("product-form") as HTMLFormElement | null;
const modalTitle = document.getElementById("modal-title") as HTMLHeadingElement | null;

// Inputs del formulario
const inputId = document.getElementById("product-id") as HTMLInputElement | null;
const inputName = document.getElementById("product-name") as HTMLInputElement | null;
const inputDesc = document.getElementById("product-desc") as HTMLTextAreaElement | null;
const inputPrice = document.getElementById("product-price") as HTMLInputElement | null;
const inputStock = document.getElementById("product-stock") as HTMLInputElement | null;
const selectCategory = document.getElementById("product-category") as HTMLSelectElement | null;
const inputImg = document.getElementById("product-img") as HTMLInputElement | null;
const inputAvailable = document.getElementById("product-available") as HTMLInputElement | null;

// 3- FUNCIONES DE CONTROL DE INTERFAZ (MODAL)
const openModal = () => modal?.classList.add("modal--active");
const closeModal = () => {
  modal?.classList.remove("modal--active");
  productForm?.reset();
  if (inputId) inputId.value = "";
};

btnCloseModal?.addEventListener("click", closeModal);
modalOverlay?.addEventListener("click", closeModal);

// 4- CARGA DE CATEGORÍAS EN EL SELECTOR
const fillCategorySelect = (): void => {
  if (!selectCategory) return;
  const categories = getCategories();
  selectCategory.innerHTML = '<option value="" disabled selected>Seleccione una categoría</option>';
  
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = String(cat.id);
    option.textContent = cat.nombre;
    selectCategory.appendChild(option);
  });
};

// 5- RENDERIZADO DINÁMICO DE LA TABLA DE PRODUCTOS
const renderProductsTable = (): void => {
  if (!tableBody) return;
  const products = PRODUCTS;
  tableBody.innerHTML = "";

  products.forEach(product => {
    const tr = document.createElement("tr");
    const statusText = product.disponible ? "Sí" : "No";
    const statusClass = product.disponible ? "badge--success" : "badge--danger";

    tr.innerHTML = `
      <td>${product.id}</td>
      <td><img src="${product.imagen}" class="data-table__img"></td>
      <td>${product.nombre}</td>
      <td>${product.descripcion}</td>
      <td>$${product.precio.toFixed(2)}</td>
      <td>${product.categorias[0]?.nombre || "Sin categoría"}</td>
      <td>${product.stock}</td>
      <td><span class="badge ${statusClass}">${statusText}</span></td>
      <td>
        <div class="data-table__actions">
          <button class="btn btn--light btn--sm btn-edit" data-id="${product.id}">Editar</button>
          <button class="btn btn--danger btn--sm btn-delete" data-id="${product.id}">Eliminar</button>
        </div>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

  // SECCIÓN: VINCULACIÓN DE EVENTOS DE EDICIÓN Y ELIMINACIÓN
  document.querySelectorAll(".btn-edit").forEach(btn => {
    btn.addEventListener("click", (e: Event) => {
      
      const target = e.currentTarget as HTMLButtonElement;
      const id = Number(target.dataset.id);
      const product = PRODUCTS.find(p => p.id === id);
      
      if (product) {
        if (modalTitle) modalTitle.textContent = "Editar Producto";
        if (inputId) inputId.value = String(product.id);
        if (inputName) inputName.value = product.nombre;
        if (inputDesc) inputDesc.value = product.descripcion;
        
        if (inputPrice) inputPrice.value = String(product.precio);
        
        if (inputStock) inputStock.value = String(product.stock);
        if (selectCategory) selectCategory.value = String(product.categorias[0]?.id);
        if (inputImg) inputImg.value = product.imagen;
        if (inputAvailable) inputAvailable.checked = product.disponible;
        openModal();
      }
    });
  });

// 6- INICIALIZACIÓN DE EVENTOS LÓGICOS
btnAddProduct?.addEventListener("click", () => {
  if (modalTitle) modalTitle.textContent = "Nuevo Producto";
  openModal();
});

productForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  closeModal();
});

// Ejecución inicial
fillCategorySelect();
renderProductsTable();