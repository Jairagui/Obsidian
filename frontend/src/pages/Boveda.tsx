// src/pages/Boveda.tsx
import { useState } from 'react';
import { useBoveda } from '../hooks/useBoveda';
import { CartaArticulo } from '../components/CartaArticulo';

export const Boveda = () => {
    const {
        articulos, busqueda, setBusqueda,
        categoriaSelect, setCategoriaSelect,
        estaCargando, articulosFiltrados,
        borrarArticulo, agregarArticulo, editarArticulo,
        vaciarBoveda, totalEstimado,
        conteoSneakers, conteoRelojes, conteoFiguras, mensaje, tipoMsg
    } = useBoveda();

    const [mostrarForm, setMostrarForm] = useState(false);
    const [nuevoNombre, setNuevoNombre] = useState('');
    const [nuevaMarca, setNuevaMarca] = useState('');
    const [nuevaCategoria, setNuevaCategoria] = useState('Sneakers');
    const [nuevoPrecio, setNuevoPrecio] = useState('');
    const [fotoSeleccionada, setFotoSeleccionada] = useState<File | null>(null);

    const manejarSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const ok = await agregarArticulo({
            nombre: nuevoNombre,
            marca: nuevaMarca,
            categoria: nuevaCategoria,
            anio: new Date().getFullYear(),
            condicion: "Nuevo",
            precio: Number(nuevoPrecio)
        }, fotoSeleccionada);

        if (ok) {
            setMostrarForm(false);
            setNuevoNombre('');
            setNuevaMarca('');
            setNuevoPrecio('');
            setFotoSeleccionada(null);
        }
    };

    const manejarVaciar = () => {
        if (articulos.length === 0) {
            alert('No tienes articulos');
            return
        }
        if (confirm('Vas a borrar TODOS tus articulos, seguro?')) {
            if (confirm('Ya no se pueden recuperar, continuar?')) {
                vaciarBoveda();
            }
        }
    };

    return (
        <div style={{ padding: '50px' }}>

            {/* mensaje verde si esta bien, rojo si hay error */}
            {mensaje && (
                <div className={tipoMsg === 'ok' ? 'toast toast-ok' : 'toast toast-error'}>
                    {mensaje}
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Mi Colección Personal</h2>
                <div style={{ background: '#111', padding: '10px 20px', borderRadius: '10px', border: '1px solid #333' }}>
                    <span style={{ color: '#888', fontSize: '14px' }}>Valor Mostrado: </span>
                    <span style={{ fontWeight: 'bold' }}>${totalEstimado.toLocaleString()} MXN</span>
                </div>
            </div>

            {/* los contadores de arriba */}
            <div className="resumen-stats">
                <div className="stat-item">
                    <span className="stat-numero">{articulos.length}</span>
                    <span className="stat-label">Total</span>
                </div>
                <div className="stat-item">
                    <span className="stat-numero" style={{color: '#2563eb'}}>{conteoSneakers}</span>
                    <span className="stat-label">Sneakers</span>
                </div>
                <div className="stat-item">
                    <span className="stat-numero" style={{color: '#22c55e'}}>{conteoRelojes}</span>
                    <span className="stat-label">Relojes</span>
                </div>
                <div className="stat-item">
                    <span className="stat-numero" style={{color: '#a855f7'}}>{conteoFiguras}</span>
                    <span className="stat-label">Figuras</span>
                </div>
            </div>

            <div className="toolbar">
                <input type="text" placeholder="Buscar tenis o figura..." className="input-buscar"
                    value={busqueda} onChange={e => setBusqueda(e.target.value)} />
                <select className="select-filtro" value={categoriaSelect} onChange={e => setCategoriaSelect(e.target.value)}>
                    <option value="Todas">Todas las categorías</option>
                    <option value="Sneakers">Sneakers</option>
                    <option value="Relojes">Relojes</option>
                    <option value="Figuras">Figuras</option>
                </select>
                <button className="btn-primario" onClick={() => setMostrarForm(!mostrarForm)}>
                    {mostrarForm ? 'Cancelar' : '+ Añadir'}
                </button>
                <button className="btn-vaciar" onClick={manejarVaciar}>Vaciar todo</button>
            </div>

            {mostrarForm && (
                <div style={{ background: '#111', padding: '20px', borderRadius: '10px', border: '1px solid #333', marginBottom: '30px' }}>
                    <h3 style={{ marginBottom: '15px' }}>Registrar nuevo</h3>
                    <form onSubmit={manejarSubmit} style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                        <input type="text" placeholder="Nombre" className="input-buscar" required
                            value={nuevoNombre} onChange={e => setNuevoNombre(e.target.value)} />
                        <input type="text" placeholder="Marca" className="input-buscar" required
                            value={nuevaMarca} onChange={e => setNuevaMarca(e.target.value)} />
                        <select className="select-filtro" value={nuevaCategoria} onChange={e => setNuevaCategoria(e.target.value)}>
                            <option value="Sneakers">Sneakers</option>
                            <option value="Relojes">Relojes</option>
                            <option value="Figuras">Figuras</option>
                        </select>
                        <input type="number" placeholder="Precio" className="input-buscar" required min="1"
                            value={nuevoPrecio} onChange={e => setNuevoPrecio(e.target.value)} />
                        <input type="file" accept="image/*" className="input-buscar"
                            onChange={e => setFotoSeleccionada(e.target.files?.[0] || null)} />
                        <button type="submit" className="btn-guardar">Guardar</button>
                    </form>
                </div>
            )}

            {estaCargando ? (
                <div style={{ textAlign: 'center', marginTop: '50px' }}>
                    <div className="spinner"></div>
                    <p style={{ color: '#888', marginTop: '15px' }}>Cargando inventario...</p>
                </div>
            ) : (
                <div className="grid-articulos">
                    {articulosFiltrados.length === 0 ? (
                        <p style={{ color: '#888' }}>No hay resultados.</p>
                    ) : (
                        articulosFiltrados.map((item) => (
                            <CartaArticulo key={item._id} articulo={item}
                                alBorrar={borrarArticulo} alEditar={editarArticulo} />
                        ))
                    )}
                </div>
            )}

            <div className="footer">
                <span>Obsidian</span> — Bóveda Digital para Coleccionistas © {new Date().getFullYear()}
            </div>
        </div>
    );
};
