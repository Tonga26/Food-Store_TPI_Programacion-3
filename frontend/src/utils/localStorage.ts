import type { IUser } from "../types/IUser";

export const saveUserToDatabase = (user: IUser) => {

  // Buscamos el array existente o creamos un vacío
  const usersString = localStorage.getItem("users");
  const usersArray: IUser[] = usersString ? JSON.parse(usersString) : [];

  // Agregamos el nuevo usuario al array
  usersArray.push(user);

  // Volvemos a guardar el array completo
  localStorage.setItem("users", JSON.stringify(usersArray));
}

export const getAllUsers = (): IUser[] => {{
  const usersString = localStorage.getItem("users");
  return usersString ? JSON.parse(usersString) : [];
}}

// --- GESTIÓN DE LA SESIÓN ACTIVA (Clave 'userData') ---
export const saveUser = (user: IUser) => {
  const parseUser = JSON.stringify(user);
  localStorage.setItem("userData", parseUser);
};

export const getUser = () => {
  return localStorage.getItem("userData");
};

export const removeUser = () => {
  localStorage.removeItem("userData");
};
