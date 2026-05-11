import { describe, it, expect } from 'vitest'

const filtrarArticulos = (articulos: any[], busqueda: string, categoria: string) => {
    return articulos.filter((item) => {
        const coincideNombre = item.nombre.toLowerCase().includes(busqueda.toLowerCase());
        const coincideCategoria = categoria === 'Todas' || item.categoria === categoria;
        return coincideNombre && coincideCategoria;
    });
};

describe('Filtros', () => {
    it('debe filtrar por nombre y categoria', () => {
        const articulos = [
            { nombre: 'Jordan 1', categoria: 'Sneakers' },
            { nombre: 'Vader Pop', categoria: 'Figuras' },
            { nombre: 'G-Shock', categoria: 'Relojes' },
        ];

        expect(filtrarArticulos(articulos, 'jordan', 'Todas').length).toBe(1)
        expect(filtrarArticulos(articulos, '', 'Figuras').length).toBe(1)
        expect(filtrarArticulos(articulos, '', 'Todas').length).toBe(3)
    })
})
