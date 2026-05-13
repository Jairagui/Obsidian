import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_URL, headersConToken } from '../helpers/authHelper';

// pagina del admin, solo la ven los que tienen role admin
export const Admin = () => {
    const [usuarios, setUsuarios] = useState<any[]>([]);
    const [resumen, setResumen] = useState({ totalUsuarios: 0, totalArticulos: 0, valorTotal: 0 });
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        cargarUsuarios();
        cargarResumen();
    }, []);

    const cargarUsuarios = async () => {
        try {
            const resp = await fetch(`${API_URL}/admin/usuarios`, {
                headers: headersConToken()
            });
            if (resp.ok) {
                setUsuarios(await resp.json());
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setCargando(false);
        }
    };

    // traer las estadisticas generales
    const cargarResumen = async () => {
        try {
            const resp = await fetch(`${API_URL}/admin/resumen`, {
                headers: headersConToken()
            });
            if (resp.ok) {
                setResumen(await resp.json());
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const eliminarUsuario = async (id: string, nombre: string) => {
        if (!confirm(`¿Seguro que quieres eliminar a ${nombre}? Se borrarán también todos sus artículos.`)) {
            return;
        }

        try {
            const resp = await fetch(`${API_URL}/admin/usuarios/${id}`, {
                method: 'DELETE',
                headers: headersConToken()
            });

            if (resp.ok) {
                setUsuarios(prev => prev.filter(u => u._id !== id));
                // recargar resumen porque cambio
                cargarResumen();
            } else {
                const datos = await resp.json();
                alert(datos.msg || 'Error al eliminar');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div style={{ padding: '50px', maxWidth: '900px', margin: '0 auto' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Panel de Control</h2>
                <Link to="/" className="btn-secundario" style={{ textDecoration: 'none' }}>Volver al Inicio</Link>
            </div>

            {/* Resumen general de la plataforma */}
            <div className="admin-resumen">
                <div className="admin-stat">
                    <span className="numero">{resumen.totalUsuarios}</span>
                    <span className="label">Usuarios</span>
                </div>
                <div className="admin-stat">
                    <span className="numero">{resumen.totalArticulos}</span>
                    <span className="label">Artículos totales</span>
                </div>
                <div className="admin-stat">
                    <span className="numero">${resumen.valorTotal.toLocaleString()}</span>
                    <span className="label">Valor total MXN</span>
                </div>
            </div>

            <p style={{ color: '#888', marginBottom: '30px' }}>Usuarios registrados en la plataforma.</p>

            {cargando ? (
                <p style={{ color: '#888' }}>Cargando...</p>
            ) : (
                <table className="tabla-admin">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>Artículos</th>
                        <th>Rol</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {usuarios.map((user) => (
                        <tr key={user._id}>
                            <td>#{user._id.slice(-5)}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.totalArticulos || 0}</td>
                            <td>
                <span style={{ backgroundColor: '#222', padding: '5px 10px', borderRadius: '5px', fontSize: '12px' }}>
                  {user.role === 'admin' ? 'Administrador' : 'Coleccionista'}
                </span>
                            </td>
                            <td>
                                {user.role !== 'admin' && (
                                    <button
                                        onClick={() => eliminarUsuario(user._id, user.name)}
                                        style={{
                                            background: 'none',
                                            border: '1px solid #ff4c4c',
                                            color: '#ff4c4c',
                                            padding: '5px 12px',
                                            borderRadius: '5px',
                                            cursor: 'pointer',
                                            fontSize: '12px'
                                        }}
                                    >
                                        Eliminar
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            {/* Footer */}
            <div className="footer">
                <span>Obsidian</span> — Panel de Administración  {new Date().getFullYear()}
            </div>
        </div>
    );
};
