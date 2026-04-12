import type { Rol } from "./Rol";

export interface IUser {
  id?: string;
  nombre: string;
  apellido: string;
  email: string;
  celular?: string;
  password: string;
  loggedIn: boolean;
  role: Rol;
}
