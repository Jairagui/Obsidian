import { useState } from 'react';
import type { Articulo } from '../interfaces/Articulo';
import { API_URL, headersConToken } from '../helpers/authHelper';

// la info del articulo, editar y borrar
export const CartaArticulo = ({ articulo, alBorrar, alEditar }: {
    articulo: Articulo,
    alBorrar: (id: string) => void,
    alEditar: (actualizado: Articulo) => void
}) => {

    const [editando, setEditando] = useState(false);

    // estados para los campos de editar
    const [nombre, setNombre] = useState(articulo.nombre);
    const [marca, setMarca] = useState(articulo.marca);
    const [precio, setPrecio] = useState(String(articulo.precio));

    // color segun la categoria
    const claseCat = articulo.categoria === 'Sneakers' ? 'cat-sneakers'
        : articulo.categoria === 'Relojes' ? 'cat-relojes'
        : articulo.categoria === 'Figuras' ? 'cat-figuras' : '';

    // guardar los cambios
    const guardarEdicion = async () => {
        try {
            const resp = await fetch(`${API_URL}/articulos/${articulo._id}`, {
                method: 'PUT',
                headers: headersConToken(),
                body: JSON.stringify({
                    nombre,
                    marca,
                    precio: Number(precio)
                })
            });

            if (resp.ok) {
                const actualizado = await resp.json();
                alEditar(actualizado);
                setEditando(false);
            }
        } catch (error) {
            console.error('Error al editar:', error);
        }
    };

    // cancelar y dejar como estaba
    const cancelarEdicion = () => {
        setNombre(articulo.nombre);
        setMarca(articulo.marca);
        setPrecio(String(articulo.precio));
        setEditando(false);
    };

    return (
        <div className={`item-card ${claseCat}`}>
            <button className="btn-eliminar" onClick={() => {
                if (confirm('¿Seguro que quieres eliminar este artículo?')) {
                    alBorrar(articulo._id);
                }
            }}>X</button>

            {editando ? (
                // modo editar
                <div className="form-editar-carta">
                    <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre" />
                    <input value={marca} onChange={(e) => setMarca(e.target.value)} placeholder="Marca" />
                    <input type="number" value={precio} onChange={(e) => setPrecio(e.target.value)} placeholder="Precio" />
                    <div className="botones-editar">
                        <button className="btn-guardar-editar" onClick={guardarEdicion}>Guardar</button>
                        <button className="btn-cancelar-editar" onClick={cancelarEdicion}>Cancelar</button>
                    </div>
                </div>
            ) : (
                // modo normal
                <>
                    <h3>{articulo.nombre}</h3>
                    <p><strong>Marca:</strong> {articulo.marca}</p>
                    <p><strong>Categoría:</strong> {articulo.categoria}</p>
                    <p><strong>Condición:</strong> {articulo.condicion}</p>
                    <p className="info-extra">Año: {articulo.anio}</p>
                    <span className="precio-tag">Precio: ${articulo.precio.toLocaleString()}</span>

                    <div className="botones-carta">
                        <button className="btn-editar-carta" onClick={() => setEditando(true)}>Editar</button>
                    </div>
                </>
            )}
        </div>
    );
};
