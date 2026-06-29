import { checkAuthUser } from "../../../utils/auth";
import { setupMenu } from "../../../utils/menu";
import { apiFetch } from "../../../utils/api";
import { mostrarToast } from "../../../utils/toast";
import type { ICategory } from "../../../types/ICategory";
import type { IProduct } from "../../../types/IProduct";

/**
 * Inicialización de seguridad.
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
 * Referencias al DOM (Creación/Edición)
 */
const tableBody = document.getElementById("products-table-body") as HTMLTableSectionElement | null;
const btnAddProduct = document.getElementById("btn-add-product") as HTMLButtonElement | null;
const modal = document.getElementById("product-modal") as HTMLDivElement | null;
const modalOverlay = document.getElementById("modal-overlay") as HTMLDivElement | null;
const btnCloseModal = document.getElementById("modal-close") as HTMLButtonElement | null;
const productForm = document.getElementById("product-form") as HTMLFormElement | null;
const modalTitle = document.getElementById("modal-title") as HTMLHeadingElement | null;

const inputId = document.getElementById("product-id") as HTMLInputElement | null;
const inputName = document.getElementById("product-name") as HTMLInputElement | null;
const inputDesc = document.getElementById("product-desc") as HTMLTextAreaElement | null;
const inputPrice = document.getElementById("product-price") as HTMLInputElement | null;
const inputStock = document.getElementById("product-stock") as HTMLInputElement | null;
const selectCategory = document.getElementById("product-category") as HTMLSelectElement | null;
const inputImg = document.getElementById("product-img") as HTMLInputElement | null;
const inputAvailable = document.getElementById("product-available") as HTMLInputElement | null;

/**
 * Referencias al DOM (Eliminación)
 */
const deleteModal = document.getElementById("delete-confirm-modal") as HTMLDivElement | null;
const deleteModalOverlay = document.getElementById("delete-modal-overlay") as HTMLDivElement | null;
const btnCloseDeleteModal = document.getElementById("delete-modal-close") as HTMLButtonElement | null;
const btnCancelDelete = document.getElementById("btn-cancel-delete") as HTMLButtonElement | null;
const btnConfirmDelete = document.getElementById("btn-confirm-delete") as HTMLButtonElement | null;

/**
 * Estado local
 */
let currentProducts: IProduct[] = [];
let productIdToDelete: number | null = null;

/**
 * Utilidad de resolución de imágenes (Vite)
 */
const resolveImageUrl = (fileName: string | null | undefined): string => {
  if (!fileName) return "";
  if (fileName.startsWith('http')) return fileName;
  return new URL(`../../../assets/img/${fileName}`, import.meta.url).href;
};

/**
 * Gestión del Modal Principal
 */
const openModal = () => modal?.classList.add("modal--active");
const closeModal = () => {
  modal?.classList.remove("modal--active");
  productForm?.reset();
  if (inputId) inputId.value = "";
};
btnCloseModal?.addEventListener("click", closeModal);
modalOverlay?.addEventListener("click", closeModal);

btnAddProduct?.addEventListener("click", () => {
  if (modalTitle) modalTitle.textContent = "Nuevo Producto";
  if (productForm) productForm.reset();
  if (inputId) inputId.value = "";
  openModal();
});

/**
 * Gestión del Modal de Eliminación
 */
const openDeleteModal = (id: number): void => {
  productIdToDelete = id;
  if (deleteModal) deleteModal.classList.add("modal--active");
};
const closeDeleteModal = (): void => {
  productIdToDelete = null;
  if (deleteModal) deleteModal.classList.remove("modal--active");
};
btnCloseDeleteModal?.addEventListener("click", closeDeleteModal);
deleteModalOverlay?.addEventListener("click", closeDeleteModal);
btnCancelDelete?.addEventListener("click", closeDeleteModal);

/**
 * Flujo de red: Cargar categorías para el selector
 */
const loadCategories = async (): Promise<void> => {
    if (!selectCategory) return;
    try {
        const categories: ICategory[] = await apiFetch("/categories");
        selectCategory.innerHTML = '<option value="" disabled selected>Seleccione una categoría</option>';
        
        categories.forEach(cat => {
            const option = document.createElement("option");
            option.value = String(cat.id);
            option.textContent = cat.nombre;
            selectCategory.appendChild(option);
        });
    } catch (error) {
        mostrarToast("Error al cargar las categorías. Intente recargar la página.");
    }
};

/**
 * Flujo de red: Cargar productos y pintar tabla
 */
const renderProductsTable = async (): Promise<void> => {
  if (!tableBody) return;

  try {
    const products: IProduct[] = await apiFetch("/products");
    currentProducts = products;
    tableBody.innerHTML = "";

    if (products.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="9" style="text-align: center; padding: 2rem;">No hay productos registrados en el sistema.</td></tr>`;
      return;
    }

    products.forEach(product => {
      const imgPath = resolveImageUrl(product.imagen);
      const tr = document.createElement("tr");
      const statusText = product.disponible ? "Sí" : "No";
      const statusClass = product.disponible ? "badge--success" : "badge--danger";

      tr.innerHTML = `
        <td>${product.id}</td>
        <td><img src="${imgPath}" alt="${product.nombre}" class="data-table__img"></td>
        <td>${product.nombre}</td>
        <td>${product.descripcion}</td>
        <td>$${product.precio.toFixed(2)}</td>
        <td>${product.categoriaNombre}</td>
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

    attachTableEvents();
  } catch (error) {
    mostrarToast("Se produjo un error al cargar el catálogo de productos.");
  }
};

/**
 * Delegación de eventos para botones generados dinámicamente
 */
const attachTableEvents = (): void => {
  document.querySelectorAll(".btn-edit").forEach(btn => {
    btn.addEventListener("click", (e: Event) => {
      const target = e.currentTarget as HTMLButtonElement;
      const id = Number(target.dataset.id);
      const product = currentProducts.find(p => p.id === id);
      
      if (product) {
        if (modalTitle) modalTitle.textContent = "Editar Producto";
        if (inputId) inputId.value = String(product.id);
        if (inputName) inputName.value = product.nombre;
        if (inputDesc) inputDesc.value = product.descripcion;
        if (inputPrice) inputPrice.value = String(product.precio);
        if (inputStock) inputStock.value = String(product.stock);
        if (selectCategory) selectCategory.value = String(product.categoriaId);
        if (inputImg) inputImg.value = product.imagen;
        if (inputAvailable) inputAvailable.checked = product.disponible;
        openModal();
      }
    });
  });

  document.querySelectorAll(".btn-delete").forEach(btn => {
    btn.addEventListener("click", (e: Event) => {
      const target = e.currentTarget as HTMLButtonElement;
      openDeleteModal(Number(target.dataset.id));
    });
  });
};

/**
 * Operación DELETE
 */
btnConfirmDelete?.addEventListener("click", async () => {
    if (!productIdToDelete) return;
    try {
      await apiFetch(`/products/${productIdToDelete}`, { method: "DELETE" });
      renderProductsTable();
      mostrarToast("Producto eliminado exitosamente.");
    } catch (error) {
      mostrarToast("No se pudo procesar la baja del producto.");
    } finally {
      closeDeleteModal();
    }
  });

/**
 * Operaciones POST y PUT
 */
productForm?.addEventListener("submit", async (e: Event) => {
  e.preventDefault();

  const id = inputId?.value;
  const isEditing = id && id.trim() !== "";

  // Construcción del payload respetando el ProductoCreate / ProductoEdit del Backend
  const payload = {
    nombre: inputName?.value.trim(),
    descripcion: inputDesc?.value.trim(),
    precio: Number(inputPrice?.value),
    stock: Number(inputStock?.value),
    categoriaId: Number(selectCategory?.value),
    imagen: inputImg?.value.trim(),
    disponible: inputAvailable?.checked
  };

  try {
    if (isEditing) {
      await apiFetch(`/products/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload)
      });
      mostrarToast("Producto actualizado correctamente.");
    } else {
      await apiFetch("/products", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      mostrarToast("Producto creado correctamente.");
    }

    closeModal();
    renderProductsTable();
  } catch (error: any) {
    mostrarToast(error.message || "Error de validación al procesar el producto.");
  }
});

/**
 * Inicialización asíncrona de datos
 */
const initData = async () => {
    await loadCategories();
    await renderProductsTable();
};
initData();