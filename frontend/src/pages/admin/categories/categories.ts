import { checkAuthUser } from "../../../utils/auth";
import { setupMenu } from "../../../utils/menu";
import { getCategories } from "../../../data/data";

// 1- CONTROL DE ACCESO Y CONFIGURACIÓN DE SESIÓN
const initPage = (): void => {
  checkAuthUser(
    "/src/pages/auth/login/login.html",
    "/src/pages/store/home/home.html",
    "admin"
  );
};
initPage();
setupMenu("admin", "#nav-menu");

// 2- REFERENCIAS DIRECTAS DE ELEMENTOS DEL DOM
const tableBody = document.getElementById("categories-table-body") as HTMLTableSectionElement | null;
const btnAddCategory = document.getElementById("btn-add-category") as HTMLButtonElement | null;
const modal = document.getElementById("category-modal") as HTMLDivElement | null;
const modalOverlay = document.getElementById("modal-overlay") as HTMLDivElement | null;
const btnCloseModal = document.getElementById("modal-close") as HTMLButtonElement | null;
const modalTitle = document.getElementById("modal-title") as HTMLHeadingElement | null;
const categoryForm = document.getElementById("category-form") as HTMLFormElement | null;

const inputId = document.getElementById("category-id") as HTMLInputElement | null;
const inputName = document.getElementById("category-name") as HTMLInputElement | null;
const inputDesc = document.getElementById("category-desc") as HTMLTextAreaElement | null;
const inputImg = document.getElementById("category-img") as HTMLInputElement | null;

// 3- GESTIÓN DE VISIBILIDAD DEL MODAL
const openModal = (): void => {
  if (modal) modal.classList.add("modal--active");
};

const closeModal = (): void => {
  if (modal) modal.classList.remove("modal--active");
  if (categoryForm) categoryForm.reset();
  if (inputId) inputId.value = "";
};

btnCloseModal?.addEventListener("click", closeModal);
modalOverlay?.addEventListener("click", closeModal);

// 4- MANEJO DE EVENTO PARA INSERCIÓN DE NUEVA CATEGORÍA
btnAddCategory?.addEventListener("click", () => {
  if (modalTitle) modalTitle.textContent = "Nueva Categoría";
  if (categoryForm) categoryForm.reset();
  if (inputId) inputId.value = "";
  openModal();
});

// 5- RENDERIZADO DINÁMICO DE DATOS SOBRE LA TABLA
const renderCategoriesTable = (): void => {
  if (!tableBody) return;

  const categories = getCategories();
  tableBody.innerHTML = "";

  if (categories.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; color: #6b7280; padding: 2rem;">
          No hay categorías creadas actualmente.
        </td>
      </tr>
    `;
    return;
  }

  categories.forEach((category) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${category.id}</td>
      <td>
        <img src="${category.imagen}" alt="${category.nombre}" class="data-table__img">
      </td>
      <td>${category.nombre}</td>
      <td>${category.descripcion}</td>
      <td>
        <div class="data-table__actions">
          <button class="btn btn--light btn--sm btn-edit" data-id="${category.id}">Editar</button>
          <button class="btn btn--danger btn--sm btn-delete" data-id="${category.id}">Eliminar</button>
        </div>
      </td>
    `;
    tableBody.appendChild(tr);
  });

  // 6- VINCULACIÓN DE EVENTLISTENERS PARA MODIFICACIÓN DE REGISTROS
  const editButtons = document.querySelectorAll(".btn-edit");
  editButtons.forEach((btn) => {
    btn.addEventListener("click", (e: Event) => {
      const target = e.currentTarget as HTMLButtonElement;
      const idStr = target.dataset.id;
      if (!idStr) return;
      
      const categoryId = Number(idStr);
      const categoryToEdit = categories.find((c) => c.id === categoryId);

      if (categoryToEdit) {
        if (modalTitle) modalTitle.textContent = "Editar Categoría";
        if (inputId) inputId.value = String(categoryToEdit.id);
        if (inputName) inputName.value = categoryToEdit.nombre;
        if (inputDesc) inputDesc.value = categoryToEdit.descripcion;
        if (inputImg) inputImg.value = categoryToEdit.imagen;
        openModal();
      }
    });
  });
};

renderCategoriesTable();

// 7- INTERCEPCIÓN Y ENVÍO DEL FORMULARIO (SUBMIT)
categoryForm?.addEventListener("submit", (e: Event) => {
  e.preventDefault();
  // TODO: FASE 3 - Integración lógica de persistencia con API RESTful
  closeModal();
});