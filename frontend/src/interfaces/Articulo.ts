// src/interfaces/Articulo.ts
// el modelo del articulo
export interface Articulo {
    _id: string;
    nombre: string;
    marca: string;
    categoria: string;
    anio: number;
    condicion: string;
    precio: number;
}
