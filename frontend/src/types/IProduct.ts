export interface IProduct {
    id: number;
    nombre: string;
    precio: number;
    descripcion: string;
    stock: number;
    imagen: string;
    disponible: boolean;
    categoriaId: number;
    categoriaNombre: string;
}