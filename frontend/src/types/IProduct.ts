import type { ICategory } from "./ICategory";

export interface IProduct {
    id: number,
    eliminado: boolean,
    createdAt: string | Date,
    nombre: string,
    precio: number,
    descripcion: string,
    stock: number,
    imagen: string,
    disponible: boolean,
    categorias: ICategory[],
}