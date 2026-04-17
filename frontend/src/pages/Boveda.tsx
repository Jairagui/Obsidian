// src/pages/Boveda.tsx
import { useState } from 'react';
import { useBoveda } from '../hooks/useBoveda';
import { CartaArticulo } from '../components/CartaArticulo';
import type { Articulo } from '../interfaces/Articulo';

export const Boveda = () => {
    //  hook que hicimos
    const {
        articulos, setArticulos,
        busqueda, setBusqueda,
        categoriaSelect, setCategoriaSelect,
        estaCargando, articulosFiltrados,
        borrarArticulo, totalEstimado
    } = useBoveda();

    // Para mostrar u ocultar el form de agregar
    const [mostrarForm, setMostrarForm] = useState(false);

    // Estados para los inputs del formulario
    const [nuevoNombre, setNuevoNombre] = useState('');
    const [nuevaMarca, setNuevaMarca] = useState('');
    const [nuevaCategoria, setNuevaCategoria] = useState('Sneakers');
    const [nuevoPrecio, setNuevoPrecio] = useState('');

    // Cuando le dan click  aguradar
    const manejarSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // hacemo el prductoq ue nos dio el usuario
        const nuevoObj: Articulo = {
            id: Date.now(),
            nombre: nuevoNombre,
            marca: nuevaMarca,
            categoria: nuevaCategoria,
            anio: new Date().getFullYear(),
            condicion: "Nuevo",
            precio: Number(nuevoPrecio)
        };

        // arreglo de articulos
        setArticulos([...articulos, nuevoObj]);

        // Limpiamos la pantalla
        setMostrarForm(false);
        setNuevoNombre('');
        setNuevaMarca('');
        setNuevoPrecio('');
    };

    return (
        <div style={{ padding: '50px' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Mi Colección Personal</h2>
                <div style={{ background: '#111', padding: '10px 20px', borderRadius: '10px', border: '1px solid #333' }}>
                    <span style={{ color: '#888', fontSize: '14px' }}>Valor Mostrado: </span>
                    <span style={{ fontWeight: 'bold' }}>${totalEstimado} MXN</span>
                </div>
            </div>

            <div className="toolbar">
                <input
                    type="text"
                    placeholder="Buscar tenis o figura..."
                    className="input-buscar"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />

                <select className="select-filtro" value={categoriaSelect} onChange={(e) => setCategoriaSelect(e.target.value)}>
                    <option value="Todas">Todas las categorías</option>
                    <option value="Sneakers">Sneakers</option>
                    <option value="Relojes">Relojes</option>
                    <option value="Figuras">Figuras</option>
                </select>

                <button className="btn-primario" onClick={() => setMostrarForm(!mostrarForm)}>
                    {mostrarForm ? 'Cancelar' : '+ Añadir'}
                </button>
            </div>

            {mostrarForm && (
                <div style={{ background: '#111', padding: '20px', borderRadius: '10px', border: '1px solid #333', marginBottom: '30px' }}>
                    <h3 style={{ marginBottom: '15px' }}>Registrar nuevo</h3>
                    <form onSubmit={manejarSubmit} style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                        <input type="text" placeholder="Nombre" className="input-buscar" required value={nuevoNombre} onChange={(e) => setNuevoNombre(e.target.value)} />
                        <input type="text" placeholder="Marca" className="input-buscar" required value={nuevaMarca} onChange={(e) => setNuevaMarca(e.target.value)} />
                        <select className="select-filtro" value={nuevaCategoria} onChange={(e) => setNuevaCategoria(e.target.value)}>
                            <option value="Sneakers">Sneakers</option>
                            <option value="Relojes">Relojes</option>
                            <option value="Figuras">Figuras</option>
                        </select>
                        <input type="number" placeholder="Precio" className="input-buscar" required min="1" value={nuevoPrecio} onChange={(e) => setNuevoPrecio(e.target.value)} />
                        <button type="submit" className="btn-guardar">Guardar</button>
                    </form>
                </div>
            )}

            {/* Manejo de estado de carga */}
            {estaCargando ? (
                <p style={{ textAlign: 'center', color: '#888', marginTop: '50px' }}>Cargando inventario...</p>
            ) : (
                <div className="grid-articulos">
                    {articulosFiltrados.length === 0 ? (
                        <p style={{ color: '#888' }}>No hay resultados.</p>
                    ) : (
                        articulosFiltrados.map((item) => (
                            <CartaArticulo key={item.id} articulo={item} alBorrar={borrarArticulo} />
                        ))
                    )}
                </div>
            )}

        </div>
    );
};