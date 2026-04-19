import type { IUser } from "../types/IUser";
import type { MenuItem, MenuPage } from "../types/Menu.ts";
import { logout } from "./auth";
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

  if (!menuContainer) return;

  menuContainer.innerHTML = "";

  items.forEach((item) => {
    const li = document.createElement("li");
    li.className = "nav__item";

    const link = document.createElement("a");
    link.textContent = item.label;
    link.href = item.href;
    link.className = item.className ?? "nav__link";

    if (item.id) {
      link.id = item.id;
    }

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
const getStoreClientMenu = (): MenuItem[] => {
  return [
    { label: "Inicio", href: "../home/home.html", className: "nav__link nav__link--active" },
    { label: "Mis Pedidos", href: "#", className: "nav__link" },
    { label: "Carrito", href: "../cart/cart.html", className: "nav__link" },
    { label: "Panel Admin", href: "../../admin/adminHome/admin.html", className: "nav__link nav__link--admin" },
    { label: "Cerrar Sesión", href: "#", id: "logoutButton", className: "nav__link" },
  ];
};

// 5- DEFINE LAS OPCIONES DEL MENU DEL CARRITO PARA CLIENTE
const getCartClientMenu = (): MenuItem[] => {
  return [
    { label: "Inicio", href: "../home/home.html", className: "nav__link nav__link--active" },
    { label: "Mis Pedidos", href: "#", className: "nav__link" },
    { label: "Panel Admin", href: "../../admin/adminHome/admin.html", className: "nav__link nav__link--admin" },
    { label: "Cerrar Sesión", href: "#", id: "logoutButton", className: "nav__link" },
  ];
};

// 6- DEFINE LAS OPCIONES DEL MENU DEL PANEL ADMIN PARA CLIENTE
const getAdminClientMenu = (): MenuItem[] => {
  return [
    { label: "Inicio", href: "/src/pages/store/home/home.html", className: "nav__link" },
    { label: "Mis Pedidos", href: "#", className: "nav__link" },
    { label: "Carrito", href: "/src/pages/store/cart/cart.html", className: "nav__link" },
    { label: "Cerrar Sesión", href: "#", id: "logoutButton", className: "nav__link" },
  ];
};

// 7- DEFINE LAS OPCIONES DEL MENU QUE VE EL USUARIO ADMIN
const getAdminRoleMenu = (page: MenuPage): MenuItem[] => {
  if (page === "admin") {
    return [
      { label: "Volver a la Tienda", href: "/src/pages/store/home/home.html", className: "nav__link" },
      { label: "Panel Admin", href: "/src/pages/admin/adminHome/admin.html", className: "nav__link nav__link--active" },
      { label: "Cerrar Sesión", href: "#", id: "logoutButton", className: "nav__link" },
    ];
  }

  return [
    { label: "Panel Admin", href: "../../admin/adminHome/admin.html", className: "nav__link nav__link--admin" },
    { label: "Cerrar Sesión", href: "#", id: "logoutButton", className: "nav__link" },
  ];
};

// 8- DEVUELVE LAS OPCIONES DE MENU SEGUN ROL Y PAGINA ACTUAL
const getMenuItems = (page: MenuPage, role: IUser["role"]): MenuItem[] => {
  if (role === "admin") {
    return getAdminRoleMenu(page);
  }

  if (page === "store") {
    return getStoreClientMenu();
  }

  if (page === "cart") {
    return getCartClientMenu();
  }

  return getAdminClientMenu();
};

// 9- INICIALIZA EL MENU CORRESPONDIENTE A CADA PANTALLA
export const setupMenu = (page: MenuPage, containerSelector: string): void => {
  const user = getLoggedUser();

  if (!user) return;

  const items = getMenuItems(page, user.role);

  renderMenu(containerSelector, items);
  bindLogoutButton();
};