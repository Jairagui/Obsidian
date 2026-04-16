import type { Articulo } from '../interfaces/Articulo';

// la info del articulo y la funcion para borrarlo
export const CartaArticulo = ({ articulo, alBorrar }: { articulo: Articulo, alBorrar: (id: number) => void }) => {
    return (
        <div className="item-card">
            <button className="btn-eliminar" onClick={() => alBorrar(articulo.id)}>X</button>

            <h3>{articulo.nombre}</h3>
            <p><strong>Marca:</strong> {articulo.marca}</p>
            <p><strong>Categoría:</strong> {articulo.categoria} | {articulo.condicion}</p>
            <span className="precio-tag">Precio: ${articulo.precio}</span>
        </div>
    );
};

