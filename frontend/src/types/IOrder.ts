import type { IUser } from "./IUser";

export interface IOrderDetail {
    id: number;
    cantidad: number;
    subtotal: number;
    producto: {
        id: number;
        nombre: string;
        precio: number;
    };
}

export interface IOrder {
    id: number;
    fecha: string;
    estado: string;
    formaPago: string;
    total: number;
    direccion: string;
    telefono: string;
    notas: string;
    usuario: IUser;
    detalles: IOrderDetail[];
}