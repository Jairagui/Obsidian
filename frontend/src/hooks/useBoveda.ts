// src/hooks/useBoveda.ts
import { useState, useEffect } from 'react';
import type { Articulo } from '../interfaces/Articulo';

// Datos estaticos (de mientras  )
const inventarioInicial: Articulo[] = [
    { id: 1, nombre: "Jordan 1 Retro", marca: "Nike", categoria: "Sneakers", anio: 2015, condicion: "Nuevo", precio: 3500 },
    { id: 2, nombre: "Vader Funko Pop", marca: "Funko", categoria: "Figuras", anio: 2020, condicion: "Con caja", precio: 600 },
    { id: 3, nombre: "Casio G-Shock", marca: "Casio", categoria: "Relojes", anio: 2018, condicion: "Usado", precio: 2200 }
];

// manejos de etados
export const useBoveda = () => {
    const [articulos, setArticulos] = useState<Articulo[]>([]);
    const [busqueda, setBusqueda] = useState('');
    const [categoriaSelect, setCategoriaSelect] = useState('Todas');
    const [estaCargando, setEstaCargando] = useState(true);

    // Simulamos que carga el API
    useEffect(() => {
        setEstaCargando(true);
        setTimeout(() => {
            setArticulos(inventarioInicial);
            setEstaCargando(false);
        }, 1500);
    }, []);

    // Funcion sencilla para eliminar usando filter
    const borrarArticulo = (id: number) => {
        const listaActualizada = articulos.filter(item => item.id !== id);
        setArticulos(listaActualizada);
    };

    // Buscador y filtros combinados
    const articulosFiltrados = articulos.filter((item) => {
        // Revisamos si el nombre tiene las letras que escribieron
        const coincideNombre = item.nombre.toLowerCase().includes(busqueda.toLowerCase());
        // Revisamos si la categoria es la misma que la del select
        const coincideCategoria = categoriaSelect === 'Todas' || item.categoria === categoriaSelect;

        return coincideNombre && coincideCategoria;
    });

    // Sumamos los precios usando u
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