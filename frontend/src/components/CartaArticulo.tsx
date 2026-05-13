import { useState } from 'react';
import type { Articulo } from '../interfaces/Articulo-front.ts';
import { obtenerToken, API_URL } from '../helpers/authHelper';

// sacamos la base de la url
const BASE_URL = API_URL.replace('/api', '');

// la tarjeta de cada articulo
export const CartaArticulo = ({ articulo, alBorrar, alEditar, categoriasDisponibles }: {
    articulo: Articulo,
    alBorrar: (id: string) => void,
    alEditar: (a: Articulo) => void,
    categoriasDisponibles?: string[]
}) => {
    const [editando, setEditando] = useState(false);
    const [nombre, setNombre] = useState(articulo.nombre);
    const [marca, setMarca] = useState(articulo.marca);
    const [precio, setPrecio] = useState(String(articulo.precio));
    const [categoriaEdit, setCategoriaEdit] = useState(articulo.categoria);
    const [nuevaFoto, setNuevaFoto] = useState<File | null>(null);

    // colores para las categorias - las 3 originales + extras para las nuevas
    const coloresCategorias: Record<string, string> = {
        'Sneakers': '#2563eb',
        'Relojes': '#22c55e',
        'Figuras': '#a855f7',
    };
    // paleta para categorias nuevas que vaya creando el usuario
    const coloresExtra = ['#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#14b8a6', '#f97316'];

    const obtenerColor = (categoria: string) => {
        if (coloresCategorias[categoria]) return coloresCategorias[categoria];
        // le asignamos un color segun la posicion del nombre
        let hash = 0;
        for (let i = 0; i < categoria.length; i++) hash += categoria.charCodeAt(i);
        return coloresExtra[hash % coloresExtra.length];
    };

    const colorCategoria = obtenerColor(articulo.categoria);

    // cuando abrimos el modal reseteamos los valores por si cancelo antes
    const abrirEditar = () => {
        setNombre(articulo.nombre);
        setMarca(articulo.marca);
        setPrecio(String(articulo.precio));
        setCategoriaEdit(articulo.categoria);
        setNuevaFoto(null);
        setEditando(true);
    };

    // guardar cambios con FormData por si cambia la foto
    const guardarCambios = async () => {
        try {
            const form = new FormData();
            form.append('nombre', nombre);
            form.append('marca', marca);
            form.append('precio', precio);
            form.append('categoria', categoriaEdit);
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

    // las categorias que mostramos en el select
    const cats = categoriasDisponibles || ['Sneakers', 'Relojes', 'Figuras'];

    return (
        <>
            <div className="item-card" style={{ borderLeft: `3px solid ${colorCategoria}` }}>
                <button className="btn-eliminar" onClick={() => {
                    if (confirm('Seguro que quieres borrar esto?')) alBorrar(articulo._id)
                }}>X</button>

                {/* mostramos la foto si tiene, si no un cuadro gris */}
                {articulo.imagen && articulo.imagen !== "" ? (
                    <img
                        src={`${BASE_URL}/uploads/${articulo.imagen}`}
                        alt={articulo.nombre}
                        className="imagen-articulo"
                    />
                ) : (
                    <div className="imagen-placeholder">Sin foto</div>
                )}

                <h3>{articulo.nombre}</h3>
                <p><strong>Marca:</strong> {articulo.marca}</p>
                <p><strong>Categoría:</strong> {articulo.categoria}</p>
                <p><strong>Condición:</strong> {articulo.condicion}</p>
                <p className="info-extra">Año: {articulo.anio}</p>
                <span className="precio-tag">Precio: ${articulo.precio.toLocaleString()}</span>
                <div className="botones-carta">
                    <button className="btn-editar-carta" onClick={abrirEditar}>Editar</button>
                </div>
            </div>

            {/* modal de editar, igual que el de agregar */}
            {editando && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="btn-cerrar" onClick={() => setEditando(false)}>X</button>
                        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Editar Artículo</h2>
                        <div className="form-group">
                            <label>Nombre</label>
                            <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Marca</label>
                            <input type="text" value={marca} onChange={e => setMarca(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Categoría</label>
                            <select className="select-filtro" style={{ width: '100%' }}
                                value={categoriaEdit} onChange={e => setCategoriaEdit(e.target.value)}>
                                {cats.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Precio (MXN)</label>
                            <input type="number" value={precio} onChange={e => setPrecio(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Cambiar foto (opcional)</label>
                            <input type="file" accept="image/*"
                                onChange={e => setNuevaFoto(e.target.files?.[0] || null)} />
                        </div>
                        <button onClick={guardarCambios} className="btn-primario"
                            style={{ width: '100%', marginTop: '10px' }}>Guardar</button>
                    </div>
                </div>
            )}
        </>
    );
};
