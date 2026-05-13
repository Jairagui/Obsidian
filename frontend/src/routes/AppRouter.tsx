import { useState } from 'react';
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import { Landing } from '../pages/Landing';
import { Boveda } from '../pages/Boveda';
import { Admin } from '../pages/Admin';
import { GoogleCallback } from '../pages/GoogleCallback';
import { ModalLogin, ModalRegistro } from '../components/Modales';
import {
    cerrarSesionHelper, API_URL, headersConToken,
    obtenerUsuario, obtenerRol, haySesionActiva
} from '../helpers/authHelper';

//Componente para proteger las rutas
const RutaProtegida = ({ children, ocupasAdmin = false }: { children: React.ReactNode, ocupasAdmin?: boolean }) => {
    const rol = obtenerRol();

    if (!haySesionActiva()) {
        return <Navigate to="/" />;
    }

    if (ocupasAdmin === true && rol !== 'admin') {
        return <Navigate to="/boveda" />;
    }

    return children;
};

export const AppRouter = () => {
    const navegar = useNavigate();
    const usuario = obtenerUsuario();
    const rolActual = obtenerRol();

    const [verLogin, setVerLogin] = useState(false);
    const [verRegistro, setVerRegistro] = useState(false);
    const [verConfirmLogout, setVerConfirmLogout] = useState(false);

    const abrirLogin = () => {
        setVerRegistro(false);
        setVerLogin(true);
    };
    const abrirRegistro = () => {
        setVerLogin(false);
        setVerRegistro(true);
    };
    const cerrarModales = () => {
        setVerLogin(false);
        setVerRegistro(false);
        setVerConfirmLogout(false);
    };

    const cerrarSesion = () => {
        cerrarSesionHelper();
        setVerConfirmLogout(false);
        navegar('/');
        window.location.reload();
    };

    // borrar la cuenta del usuario
    const borrarMiCuenta = async () => {
        if (!confirm('SEGURO que quieres borrar tu cuenta? Se pierden todos tus articulos')) return;
        try {
            const resp = await fetch(`${API_URL}/auth/mi-cuenta`, {
                method: 'DELETE',
                headers: headersConToken()
            });
            if (resp.ok) {
                cerrarSesionHelper();
                navegar('/');
                window.location.reload();
            }
        } catch (err) {
            console.log("error borrando cuenta", err)
        }
    };

    return (
        <div>
            <nav className="nav-principal">
                <div className="nav-logo">
                    <Link to="/">Obsidian</Link>
                </div>

                <div className="nav-links">
                    {rolActual === 'admin' ? (
                        <Link to="/admin">Panel Admin</Link>
                    ) : haySesionActiva() ? (
                        <Link to="/boveda">Bóveda</Link>
                    ) : null}

                    {haySesionActiva() ? (
                        <>
                            <span style={{ color: '#888', fontSize: '14px' }}>
                                Hola, {usuario?.name || 'Usuario'}
                            </span>
                            <button onClick={() => setVerConfirmLogout(true)} className="btn-secundario">Salir</button>
                        </>
                    ) : (
                        <>
                            <button onClick={abrirLogin} className="btn-secundario">Login</button>
                            <button onClick={abrirRegistro} className="btn-primario">Sign Up</button>
                        </>
                    )}
                </div>
            </nav>
            {verLogin && <ModalLogin cerrar={cerrarModales} abrirRegistro={abrirRegistro} />}
            {verRegistro && <ModalRegistro cerrar={cerrarModales} abrirLogin={abrirLogin} />}

            {/* confirmacion para cerrar sesion */}
            {verConfirmLogout && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ textAlign: 'center' }}>
                        <button className="btn-cerrar" onClick={() => setVerConfirmLogout(false)}>X</button>
                        <h2 style={{ marginBottom: '20px' }}>¿Cerrar sesión?</h2>
                        <p style={{ color: '#888', marginBottom: '20px' }}>Tu colección se queda guardada para cuando vuelvas.</p>
                        <button onClick={cerrarSesion} className="btn-primario" style={{ width: '100%', marginBottom: '10px' }}>
                            Sí, cerrar sesión
                        </button>
                        <button onClick={() => setVerConfirmLogout(false)} className="btn-secundario" style={{ width: '100%' }}>
                            Cancelar
                        </button>
                        <hr style={{ border: 'none', borderTop: '1px solid #333', margin: '20px 0' }} />
                        <button onClick={borrarMiCuenta}
                            style={{ background: 'none', border: 'none', color: '#ff4c4c', cursor: 'pointer', fontSize: '13px' }}>
                            Eliminar mi cuenta
                        </button>
                    </div>
                </div>
            )}

            <Routes>
                <Route path="/" element={<Landing abrirRegistro={abrirRegistro} />} />
                <Route path="/boveda" element={<RutaProtegida><Boveda /></RutaProtegida>} />
                <Route path="/admin" element={<RutaProtegida ocupasAdmin={true}><Admin /></RutaProtegida>} />
                <Route path="/auth/google/callback" element={<GoogleCallback />} />
            </Routes>
        </div>
    );
};
