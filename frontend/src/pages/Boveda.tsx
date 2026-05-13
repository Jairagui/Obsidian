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
        categorias, conteoPorCategoria,
        ordenarPor, setOrdenarPor,
        mensaje, tipoMsg
    } = useBoveda();

    const [mostrarForm, setMostrarForm] = useState(false);
    const [nuevoNombre, setNuevoNombre] = useState('');
    const [nuevaMarca, setNuevaMarca] = useState('');
    const [nuevaCategoria, setNuevaCategoria] = useState('Sneakers');
    const [categoriaPersonalizada, setCategoriaPersonalizada] = useState('');
    const [nuevoPrecio, setNuevoPrecio] = useState('');
    const [fotoSeleccionada, setFotoSeleccionada] = useState<File | null>(null);

    // la categoria final es la personalizada si eligio "Otra"
    const categoriaFinal = nuevaCategoria === '__otra__'
        ? categoriaPersonalizada.trim()
        : nuevaCategoria;

    const manejarSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (nuevaCategoria === '__otra__' && categoriaPersonalizada.trim() === '') {
            return; // no dejar guardar sin categoria
        }

        const ok = await agregarArticulo({
            nombre: nuevoNombre,
            marca: nuevaMarca,
            categoria: categoriaFinal,
            anio: new Date().getFullYear(),
            condicion: "Nuevo",
            precio: Number(nuevoPrecio)
        }, fotoSeleccionada);

        if (ok) {
            setMostrarForm(false);
            setNuevoNombre('');
            setNuevaMarca('');
            setNuevoPrecio('');
            setNuevaCategoria('Sneakers');
            setCategoriaPersonalizada('');
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

    // las categorias por defecto + las que el usuario haya creado
    const categoriasDisponibles = ['Sneakers', 'Relojes', 'Figuras',
        ...categorias.filter(c => !['Sneakers', 'Relojes', 'Figuras'].includes(c))
    ];

    // colores para las categorias
    const coloresCategorias: Record<string, string> = {
        'Sneakers': '#2563eb', 'Relojes': '#22c55e', 'Figuras': '#a855f7',
    };
    const coloresExtra = ['#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#14b8a6', '#f97316'];
    const colorDe = (cat: string) => {
        if (coloresCategorias[cat]) return coloresCategorias[cat];
        let hash = 0;
        for (let i = 0; i < cat.length; i++) hash += cat.charCodeAt(i);
        return coloresExtra[hash % coloresExtra.length];
    };

    return (
        <div style={{ padding: '50px' }}>

            {mensaje && (
                <div className={tipoMsg === 'ok' ? 'toast toast-ok' : 'toast toast-error'}>
                    {mensaje}
                </div>
            )}

            <div className="boveda-header">
                <h2>Mi Colección Personal</h2>
                <div className="valor-total">
                    <span className="valor-label">Valor Mostrado </span>
                    <span className="valor-monto">${totalEstimado.toLocaleString()} MXN</span>
                </div>
            </div>

            {/* contadores dinamicos */}
            <div className="resumen-stats">
                <div className="stat-item">
                    <span className="stat-numero">{articulos.length}</span>
                    <span className="stat-label">Total</span>
                </div>
                {categorias.map(cat => (
                    <div className="stat-item" key={cat}>
                        <span className="stat-numero" style={{ color: colorDe(cat) }}>{conteoPorCategoria[cat]}</span>
                        <span className="stat-label">{cat}</span>
                    </div>
                ))}
            </div>

            <div className="toolbar">
                <input type="text" placeholder="Buscar por nombre o marca..." className="input-buscar"
                    value={busqueda} onChange={e => setBusqueda(e.target.value)} />
                <select className="select-filtro" value={categoriaSelect} onChange={e => setCategoriaSelect(e.target.value)}>
                    <option value="Todas">Todas las categorías</option>
                    {categoriasDisponibles.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
                <select className="select-filtro" value={ordenarPor} onChange={e => setOrdenarPor(e.target.value)}>
                    <option value="">Sin orden</option>
                    <option value="nombre">Nombre A-Z</option>
                    <option value="precio-asc">Precio menor</option>
                    <option value="precio-desc">Precio mayor</option>
                </select>
                <button className="btn-primario" onClick={() => setMostrarForm(!mostrarForm)}>
                    {mostrarForm ? 'Cancelar' : '+ Añadir'}
                </button>
                <button className="btn-vaciar" onClick={manejarVaciar}>Vaciar todo</button>
            </div>

            {/* modal para agregar articulo */}
            {mostrarForm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="btn-cerrar" onClick={() => setMostrarForm(false)}>X</button>
                        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Registrar Artículo</h2>
                        <form onSubmit={manejarSubmit}>
                            <div className="form-group">
                                <label>Nombre</label>
                                <input type="text" required value={nuevoNombre}
                                    onChange={e => setNuevoNombre(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Marca</label>
                                <input type="text" required value={nuevaMarca}
                                    onChange={e => setNuevaMarca(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Categoría</label>
                                <select className="select-filtro" style={{ width: '100%' }}
                                    value={nuevaCategoria} onChange={e => setNuevaCategoria(e.target.value)}>
                                    {categoriasDisponibles.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                    <option value="__otra__">+ Otra categoría</option>
                                </select>
                            </div>
                            {nuevaCategoria === '__otra__' && (
                                <div className="form-group">
                                    <label>Nueva categoría</label>
                                    <input type="text" placeholder="Ej: Cartas, Vinilos, Comics..."
                                        value={categoriaPersonalizada}
                                        onChange={e => setCategoriaPersonalizada(e.target.value)} required />
                                </div>
                            )}
                            <div className="form-group">
                                <label>Precio (MXN)</label>
                                <input type="number" required min="1" value={nuevoPrecio}
                                    onChange={e => setNuevoPrecio(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Foto (opcional)</label>
                                <input type="file" accept="image/*"
                                    onChange={e => setFotoSeleccionada(e.target.files?.[0] || null)} />
                            </div>
                            <button type="submit" className="btn-primario"
                                style={{ width: '100%', marginTop: '10px' }}>Guardar</button>
                        </form>
                    </div>
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
                        <div className="estado-vacio">
                            <div className="icono-vacio">◇</div>
                            <h3>No hay artículos</h3>
                            <p>Agrega tu primer artículo con el botón + Añadir</p>
                        </div>
                    ) : (
                        articulosFiltrados.map((item) => (
                            <CartaArticulo key={item._id} articulo={item}
                                alBorrar={borrarArticulo} alEditar={editarArticulo}
                                categoriasDisponibles={categoriasDisponibles} />
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
