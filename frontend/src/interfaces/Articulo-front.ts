// el modelo del articulo le pusimos imagen para las fotos
export interface Articulo {
    _id: string;
    nombre: string;
    marca: string;
    categoria: string;
    anio: number;
    condicion: string;
    precio: number;
    imagen: string;
}
