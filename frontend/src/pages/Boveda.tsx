import { useEffect, useState } from 'react';

interface Articulo {
    id_articulo: number;
    nombre: string;
    marca: string;
    categoria: string;
    precio_estimado: number;
}

const datosMock: Articulo[] = [
    { id_articulo: 1, nombre: "Jordan 1 Retro", marca: "Nike", categoria: "Sneakers", precio_estimado: 3500 },
    { id_articulo: 2, nombre: "Vader Funko", marca: "Funko", categoria: "Figuras", precio_estimado: 600 },
    { id_articulo: 3, nombre: "Casio G-Shock", marca: "Casio", categoria: "Relojes", precio_estimado: 2200 }
];

export const Boveda = () => {
    const [articulos, setArticulos] = useState<Articulo[]>([]);

    useEffect(() => {
        // Simulamos que tarda medio segundo en cargar
        setTimeout(() => {
            setArticulos(datosMock);
        }, 500);
    }, []);

    // Suma total
    const total = articulos.reduce((acc, item) => acc + item.precio_estimado, 0);

    return (
        <div>
            <h2>Mi Bóveda Digital</h2>
            <p className="valor-total">Valor Total: ${total} MXN</p>

            <div className="galeria">
                {articulos.map((art) => (
                    <div key={art.id_articulo} className="tarjeta">
                        <h3>{art.nombre}</h3>
                        <p><strong>Marca:</strong> {art.marca}</p>
                        <p><strong>Categoría:</strong> {art.categoria}</p>
                        <p><strong>Valor:</strong> ${art.precio_estimado}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};