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

    const userString = getUser();

    if (!userString) {
        navigate(redireccion1);
        // Redirigimos al login
        return;
    }

    const parseUser: IUser = JSON.parse(userString);

    if (parseUser.loggedIn === false){
        navigate(redireccion1);
        return;
    }

    const rolesArray = Array.isArray(rolesPermitidos) ? rolesPermitidos : [rolesPermitidos];

    if (!rolesArray.includes(parseUser.role as Rol)){
        navigate(redireccion2);
        return;
    }
};

/* ============================================================================
   SECCIÓN: GESTIÓN DE CIERRE DE SESIÓN
   ============================================================================ */
export const logout = () => {

    const userString = getUser();

    if (userString){
        const user: IUser = JSON.parse(userString);
        user.loggedIn = false;
        user.token = "";
        saveUser(user);
    }

    navigate("/src/pages/auth/login/login.html");
};