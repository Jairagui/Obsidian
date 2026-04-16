// src/hooks/useBoveda.ts
import { useState, useEffect } from 'react';
import type { Articulo } from '../interfaces/Articulo';

// Datos de mientars
const inventarioInicial: Articulo[] = [
    { id: 1, nombre: "Jordan 1 Retro", marca: "Nike", categoria: "Sneakers", anio: 2015, condicion: "Nuevo", precio: 3500 },
    { id: 2, nombre: "Vader Funko Pop", marca: "Funko", categoria: "Figuras", anio: 2020, condicion: "Con caja", precio: 600 },
    { id: 3, nombre: "Casio G-Shock", marca: "Casio", categoria: "Relojes", anio: 2018, condicion: "Usado", precio: 2200 }
];

// manejos de estados
export const useBoveda = () => {
    const [articulos, setArticulos] = useState<Articulo[]>([]);
    const [busqueda, setBusqueda] = useState('');
    const [categoriaSelect, setCategoriaSelect] = useState('Todas');
    const [estaCargando, setEstaCargando] = useState(true);

    // api momentanea
    useEffect(() => {
        setEstaCargando(true);
        setTimeout(() => {
            setArticulos(inventarioInicial);
            setEstaCargando(false);
        }, 1500);
    }, []);

    // Funcion para eliminar filtro  juanpa
    const borrarArticulo = (id: number) => {
        const listaActualizada = articulos.filter(item => item.id !== id);
        setArticulos(listaActualizada);
    };

    // Buscador y filtros combinados
    const articulosFiltrados = articulos.filter((item) => {
        // aqui junap vemos si si esta alguna letra que escrbio el usaruio
        const coincideNombre = item.nombre.toLowerCase().includes(busqueda.toLowerCase());
        // Revisamos si la categoria es la misma que la del select
        const coincideCategoria = categoriaSelect === 'Todas' || item.categoria === categoriaSelect;

        return coincideNombre && coincideCategoria;
    });

    // Sumamos los precios usando
    const totalEstimado = articulosFiltrados.reduce((acumulado, item) => acumulado + item.precio, 0);

    return {
        articulos,
        setArticulos,
        busqueda,
        setBusqueda,
        categoriaSelect,
        setCategoriaSelect,
        estaCargando,
        articulosFiltrados,
        borrarArticulo,
        totalEstimado
    };
};