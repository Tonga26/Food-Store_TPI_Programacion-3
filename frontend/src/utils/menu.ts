import type { IUser } from "../types/IUser";
import type { MenuItem, MenuPage } from "../types/Menu";
import { logout } from "./auth";
import { getCart } from "./cart";
import { getUser } from "./localStorage";

// 1- OBTIENE EL USUARIO LOGUEADO Y LO PARSEA DE FORMA SEGURA
const getLoggedUser = (): IUser | null => {
  const userString = getUser();
  if (!userString) return null;

  try {
    return JSON.parse(userString) as IUser;
  } catch {
    return null;
  }
};

// 2- RENDERIZA UN MENU DINAMICO EN EL CONTENEDOR INDICADO
const renderMenu = (containerSelector: string, items: MenuItem[]): void => {
  const menuContainer = document.querySelector(containerSelector) as HTMLUListElement | null;

  if (!menuContainer) {
    console.error(`setupMenu Error: No se encontró el contenedor '${containerSelector}' en el DOM.`);
    return;
  }

  menuContainer.innerHTML = "";

  const cartItemsCount = getCart().reduce((total, item) => total + item.cantidad, 0);

  items.forEach((item) => {
    const li = document.createElement("li");
    li.className = item.id === "logoutButton" ? "nav__item nav__item--logout" : "nav__item";

    const link = document.createElement("a");
    link.textContent = item.label;
    link.href = item.href;
    link.className = item.className ?? "nav__link";

    if (item.label.includes("Carrito")) {
      link.classList.add("nav__link--cart");

      if (cartItemsCount > 0) {
        const badge = document.createElement("span");
        badge.className = "nav__badge";
        badge.textContent = String(cartItemsCount);
        link.appendChild(badge);
      }
    }

    if (item.id) link.id = item.id;

    li.appendChild(link);
    menuContainer.appendChild(li);
  });
};

// 3- CARGA EL BOTON DE CIERRE DE SESION DEL MENU YA RENDERIZADO
const bindLogoutButton = (buttonSelector: string = "#logoutButton"): void => {
  const buttonLogout = document.querySelector(buttonSelector) as HTMLAnchorElement | null;
  
  buttonLogout?.addEventListener("click", (e: Event) => {
    e.preventDefault();
    logout();
  });
};

// 4- DEFINE LAS OPCIONES DEL MENU DE LA TIENDA PARA CLIENTE
const getStoreClientMenu = (user: IUser): MenuItem[] => [
  { label: "Inicio", href: "../home/home.html", className: "nav__link nav__link--active" },
  { label: "Mis Pedidos", href: "#", className: "nav__link" },
  { label: "Administración", href: "/src/pages/admin/adminHome/admin.html", className: "nav__link" },
  { label: "🛒 Carrito", href: "../cart/cart.html", className: "nav__link" },
  { label: `${user.nombre} ${user.apellido}`, href: "#", className: "nav__link nav__link--user" },
  { label: "Cerrar Sesión", href: "#", id: "logoutButton", className: "nav__link nav__link--logout" },
];

// 5- DEFINE LAS OPCIONES DEL MENU DEL CARRITO PARA CLIENTE
const getCartClientMenu = (): MenuItem[] => [
  { label: "Inicio", href: "../home/home.html", className: "nav__link nav__link--active" },
  { label: "Mis Pedidos", href: "#", className: "nav__link" },
  { label: "Cerrar Sesión", href: "#", id: "logoutButton", className: "nav__link nav__link--logout" },
];

// 6- DEFINE LAS OPCIONES DEL MENU DEL PANEL ADMIN PARA CLIENTE
const getAdminClientMenu = (): MenuItem[] => [
  { label: "Inicio", href: "/src/pages/store/home/home.html", className: "nav__link" },
  { label: "Mis Pedidos", href: "#", className: "nav__link" },
  { label: "Carrito", href: "/src/pages/store/cart/cart.html", className: "nav__link" },
  { label: "Cerrar Sesión", href: "#", id: "logoutButton", className: "nav__link nav__link--logout" },
];

// 7- DEFINE LAS OPCIONES DEL MENU QUE VE EL USUARIO ADMIN
const getAdminRoleMenu = (_page: MenuPage, user: IUser): MenuItem[] => [
  { label: "Tienda", href: "/src/pages/store/home/home.html", className: "nav__link" },
  { label: "Panel Admin", href: "/src/pages/admin/adminHome/admin.html", className: "nav__link nav__link--active" },
  { label: `${user.nombre} ${user.apellido}`, href: "#", className: "nav__link nav__link--user" },
  { label: "Cerrar Sesión", href: "#", id: "logoutButton", className: "nav__link nav__link--logout" },
];

// 8- DEVUELVE LAS OPCIONES DE MENU SEGUN ROL Y PAGINA ACTUAL
const getMenuItems = (page: MenuPage, user: IUser): MenuItem[] => {
  if (user.role === "admin") {
    return getAdminRoleMenu(page, user);
  }

  if (page === "store") return getStoreClientMenu(user);
  if (page === "cart") return getCartClientMenu();
  
  return getAdminClientMenu();
};

// 9- INICIALIZA EL MENU CORRESPONDIENTE A CADA PANTALLA
export const setupMenu = (page: MenuPage, containerSelector: string): void => {
  const user = getLoggedUser();

  if (!user) {
    console.error("setupMenu Warning: Sesión no encontrada o nula. Abortando renderizado del menú.");
    return;
  }

  const items = getMenuItems(page, user);

  renderMenu(containerSelector, items);
  bindLogoutButton();
};