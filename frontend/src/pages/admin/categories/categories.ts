import { checkAuthUser } from "../../../utils/auth";
import { setupMenu } from "../../../utils/menu";
import { apiFetch } from "../../../utils/api";
import { mostrarToast } from "../../../utils/toast";
import type { ICategory } from "../../../types/ICategory";

/**
 * Control de acceso y configuración inicial de sesión.
 */
const initPage = (): void => {
  checkAuthUser(
    "/src/pages/auth/login/login.html",
    "/src/pages/store/home/home.html",
    ["admin"]
  );
};
initPage();
setupMenu("admin", "#nav-menu");

/**
 * Referencias al DOM para la tabla y modal de edición/creación.
 */
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

/**
 * Referencias al DOM para el modal de confirmación de eliminación.
 */
const deleteModal = document.getElementById("delete-confirm-modal") as HTMLDivElement | null;
const deleteModalOverlay = document.getElementById("delete-modal-overlay") as HTMLDivElement | null;
const btnCloseDeleteModal = document.getElementById("delete-modal-close") as HTMLButtonElement | null;
const btnCancelDelete = document.getElementById("btn-cancel-delete") as HTMLButtonElement | null;
const btnConfirmDelete = document.getElementById("btn-confirm-delete") as HTMLButtonElement | null;

/**
 * Estado local en memoria.
 */
let currentCategories: ICategory[] = [];
let categoryIdToDelete: number | null = null;

/**
 * Resuelve dinámicamente la ruta absoluta del recurso visual.
 * Incorpora validación de nulidad para proteger la ejecución ante registros sin imagen.
 *
 * @param fileName Nombre del archivo físico o URL remota.
 * @returns Ruta procesada por el bundler (Vite) en tiempo de ejecución o string vacío si es nulo.
 */
const resolveImageUrl = (fileName: string | null | undefined): string => {
  if (!fileName) return "";
  if (fileName.startsWith('http')) return fileName;
  return new URL(`../../../assets/img/${fileName}`, import.meta.url).href;
};

/**
 * Gestión del ciclo de vida visual del modal de Edición/Creación.
 */
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

btnAddCategory?.addEventListener("click", () => {
  if (modalTitle) modalTitle.textContent = "Nueva Categoría";
  if (categoryForm) categoryForm.reset();
  if (inputId) inputId.value = "";
  openModal();
});

/**
 * Gestión del ciclo de vida visual del modal de Eliminación.
 */
const openDeleteModal = (id: number): void => {
  categoryIdToDelete = id;
  if (deleteModal) deleteModal.classList.add("modal--active");
};

const closeDeleteModal = (): void => {
  categoryIdToDelete = null;
  if (deleteModal) deleteModal.classList.remove("modal--active");
};

btnCloseDeleteModal?.addEventListener("click", closeDeleteModal);
deleteModalOverlay?.addEventListener("click", closeDeleteModal);
btnCancelDelete?.addEventListener("click", closeDeleteModal);

/**
 * Interceptor de confirmación de eliminación permanente.
 */
btnConfirmDelete?.addEventListener("click", async () => {
  if (!categoryIdToDelete) return;

  try {
    await apiFetch(`/categories/${categoryIdToDelete}`, { method: "DELETE" });
    renderCategoriesTable();
    mostrarToast("Categoría eliminada exitosamente.");
  } catch (error) {
    mostrarToast("Excepción controlada: No se pudo procesar la baja de la categoría.");
  } finally {
    closeDeleteModal();
  }
});

/**
 * Carga y renderizado de datos principales desde la API RESTful.
 */
const renderCategoriesTable = async (): Promise<void> => {
  if (!tableBody) return;

  try {
    const categories: ICategory[] = await apiFetch("/categories");
    currentCategories = categories;
    tableBody.innerHTML = "";

    if (categories.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="5" class="data-table__empty">
            No hay categorías registradas en el sistema.
          </td>
        </tr>
      `;
      return;
    }

    categories.forEach((category) => {
      const imgPath = resolveImageUrl(category.imagen);
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${category.id}</td>
        <td>
          <img src="${imgPath}" alt="${category.nombre}" class="data-table__img">
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

    attachTableEvents();

  } catch (error) {
    console.error("Error fetching categories:", error);
    mostrarToast("Se produjo un error al cargar el catálogo de categorías.");
  }
};

/**
 * Asignación de delegados de eventos a elementos interactivos generados dinámicamente.
 */
const attachTableEvents = (): void => {
  const editButtons = document.querySelectorAll(".btn-edit");
  const deleteButtons = document.querySelectorAll(".btn-delete");

  editButtons.forEach((btn) => {
    btn.addEventListener("click", (e: Event) => {
      const target = e.currentTarget as HTMLButtonElement;
      const idStr = target.dataset.id;
      if (!idStr) return;
      
      const categoryId = Number(idStr);
      const categoryToEdit = currentCategories.find((c) => c.id === categoryId);

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

  deleteButtons.forEach((btn) => {
    btn.addEventListener("click", (e: Event) => {
      const target = e.currentTarget as HTMLButtonElement;
      const idStr = target.dataset.id;
      if (!idStr) return;
      
      openDeleteModal(Number(idStr));
    });
  });
};

/**
 * Interceptor de envío del formulario para orquestación de operaciones de persistencia (Creación/Edición).
 */
categoryForm?.addEventListener("submit", async (e: Event) => {
  e.preventDefault();

  const id = inputId?.value;
  const isEditing = id && id.trim() !== "";

  const payload = {
    nombre: inputName?.value.trim(),
    descripcion: inputDesc?.value.trim(),
    imagen: inputImg?.value.trim()
  };

  try {
    if (isEditing) {
      await apiFetch(`/categories/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload)
      });
      mostrarToast("Categoría actualizada correctamente.");
    } else {
      await apiFetch("/categories", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      mostrarToast("Categoría creada correctamente.");
    }

    closeModal();
    renderCategoriesTable();
  } catch (error: any) {
    mostrarToast(error.message || "Excepción de validación de negocio.");
  }
});

// Inicialización de ciclo de vida del componente.
renderCategoriesTable();