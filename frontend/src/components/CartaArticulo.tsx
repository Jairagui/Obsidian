import { useState } from 'react';
import type { Articulo } from '../interfaces/Articulo-front.ts';
import { obtenerToken, API_URL } from '../helpers/authHelper';

// la tarjeta de cada articulo
export const CartaArticulo = ({ articulo, alBorrar, alEditar }: {
    articulo: Articulo,
    alBorrar: (id: string) => void,
    alEditar: (a: Articulo) => void
}) => {
    const [editando, setEditando] = useState(false);
    const [nombre, setNombre] = useState(articulo.nombre);
    const [marca, setMarca] = useState(articulo.marca);
    const [precio, setPrecio] = useState(String(articulo.precio));
    const [nuevaFoto, setNuevaFoto] = useState<File | null>(null);

    // para el color del borde segun categoria
    let claseCat = '';
    if (articulo.categoria === 'Sneakers') claseCat = 'cat-sneakers';
    if (articulo.categoria === 'Relojes') claseCat = 'cat-relojes';
    if (articulo.categoria === 'Figuras') claseCat = 'cat-figuras';

    // guardar cambios con FormData por si cambia la foto
    const guardarCambios = async () => {
        try {
            const form = new FormData();
            form.append('nombre', nombre);
            form.append('marca', marca);
            form.append('precio', precio);
            if (nuevaFoto) {
                form.append('imagen', nuevaFoto);
            }

            const resp = await fetch(`${API_URL}/articulos/${articulo._id}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${obtenerToken()}` },
                body: form
            });
            if (resp.ok) {
                const data = await resp.json();
                alEditar(data);
                setEditando(false);
                setNuevaFoto(null);
            }
        } catch (err) {
            console.log("error editando:", err)
        }
    };

    return (
        <div className={`item-card ${claseCat}`}>
            <button className="btn-eliminar" onClick={() => {
                if (confirm('Seguro que quieres borrar esto?')) alBorrar(articulo._id)
            }}>X</button>

            {/* mostramos la foto si tiene, si no un cuadro gris */}
            {articulo.imagen && articulo.imagen !== "" ? (
                <img
                    src={`http://localhost:3000/uploads/${articulo.imagen}`}
                    alt={articulo.nombre}
                    className="imagen-articulo"
                />
            ) : (
                <div className="imagen-placeholder">Sin foto</div>
            )}

            {editando ? (
                // formulario de editar
                <div className="form-editar-carta">
                    <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Nombre" />
                    <input value={marca} onChange={e => setMarca(e.target.value)} placeholder="Marca" />
                    <input type="number" value={precio} onChange={e => setPrecio(e.target.value)} placeholder="Precio" />
                    {/* cambiar la foto */}
                    <input type="file" accept="image/*" className="input-buscar"
                        onChange={e => setNuevaFoto(e.target.files?.[0] || null)} />
                    <div className="botones-editar">
                        <button className="btn-guardar-editar" onClick={guardarCambios}>Guardar</button>
                        <button className="btn-cancelar-editar" onClick={() => { setEditando(false); setNuevaFoto(null); }}>Cancelar</button>
                    </div>
                </div>
            ) : (
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
