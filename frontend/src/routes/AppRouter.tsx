import { useState } from 'react';
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import { Landing } from '../pages/Landing';
import { Boveda } from '../pages/Boveda';
import { Admin } from '../pages/Admin';
import { GoogleCallback } from '../pages/GoogleCallback';
import { ModalLogin, ModalRegistro } from '../components/Modales';
import {
    cerrarSesionHelper,
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
    };

    const cerrarSesion = () => {
        cerrarSesionHelper();
        navegar('/');
        window.location.reload();
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
                            <button onClick={cerrarSesion} className="btn-secundario">Salir</button>
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

            <Routes>
                <Route path="/" element={<Landing abrirRegistro={abrirRegistro} />} />
                <Route path="/boveda" element={<RutaProtegida><Boveda /></RutaProtegida>} />
                <Route path="/admin" element={<RutaProtegida ocupasAdmin={true}><Admin /></RutaProtegida>} />
                <Route path="/auth/google/callback" element={<GoogleCallback />} />
            </Routes>
        </div>
    );
};
