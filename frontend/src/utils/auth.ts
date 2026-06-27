import type { IUser } from "../types/IUser";
import type { Rol } from "../types/Rol";
import { getUser, saveUser } from "./localStorage";
import { navigate } from "./navigate";

/* ============================================================================
   SECCIÓN: CONTROL DE ACCESO Y AUTENTICACIÓN MULTIROL
   ============================================================================ */
export const checkAuthUser = (
  redireccion1: string,
  redireccion2: string,
  rolesPermitidos: Rol | Rol[]
) => {
 
  // Obtenemos el userData del localStorage
  const userString = getUser();

  // Si no hay nadie registrado en la base de datos
  if (!userString) {
    navigate(redireccion1);
    // Redirigimos al login
    return; 
  } 

  const parseUser: IUser = JSON.parse(userString);

  // Revisamos si el usuario cerró sesión
  if (parseUser.loggedIn === false){
    navigate(redireccion1);
    return;
  }

  const rolesArray = Array.isArray(rolesPermitidos) ? rolesPermitidos : [rolesPermitidos];

  // Revisa si tiene el rol correcto para ingresar
  if (!rolesArray.includes(parseUser.role as Rol)){
    navigate(redireccion2);
    return;
  }
};

/* ============================================================================
   SECCIÓN: GESTIÓN DE CIERRE DE SESIÓN
   ============================================================================ */
export const logout = () => {

  // Buscamos al usuario en la base de datos
  const userString = getUser();

  // Si existe, seteamos el loggedIn a false, y guardamos sus datos
  if (userString){

    // Pasamos de string a objeto js
    const user: IUser = JSON.parse(userString);

    // Cerramos la sesión
    user.loggedIn = false;

    // Guardamos en localStorage
    saveUser(user);
  }
  
  // Lo reenviamos al login
  navigate("/src/pages/auth/login/login.html");
};