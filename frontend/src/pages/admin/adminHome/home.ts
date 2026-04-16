import { checkAuthUser, logout } from "../../../utils/auth";

// Redireccion segun el login y el rol
const initPage = () => {
  console.log("inicio de pagina");
  checkAuthUser(
    "/src/pages/auth/login/login.html",
    "/src/pages/store/home/home.html",
    "admin"
  );
};
initPage();

// Cerrar sesion
const buttonLogout = document.getElementById("logoutButton") as HTMLButtonElement;
buttonLogout?.addEventListener("click", (e: Event) => {
  e.preventDefault();
  logout();
});

