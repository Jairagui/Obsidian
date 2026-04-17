import { useState } from 'react';
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import { Landing } from '../pages/Landing';
import { Boveda } from '../pages/Boveda';
import { Admin } from '../pages/Admin';

//Componente para proteger las rutas
const RutaProtegida = ({ children, ocupasAdmin = false }: { children: React.ReactNode, ocupasAdmin?: boolean }) => {
    const rol = localStorage.getItem('rol_guardado');

    if (!rol) {
        return <Navigate to="/" />;
    }

    if (ocupasAdmin === true && rol !== 'admin') {
        return <Navigate to="/boveda" />;
    }

    return children;
};

export const AppRouter = () => {
    const navegar = useNavigate();
    const rolActual = localStorage.getItem('rol_guardado');

    const [verLogin, setVerLogin] = useState(false);
    const [verRegistro, setVerRegistro] = useState(false);

    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [confirmarPass, setConfirmarPass] = useState('');
    const [errorValidacion, setErrorValidacion] = useState('');

    const iniciarSesion = (e: React.FormEvent) => {
        e.preventDefault();

        if (correo === '' || password === '') {
            setErrorValidacion('Por favor llena todos los campos');
            return;
        }

        if (correo === 'admin@obsidian.com') {
            localStorage.setItem('rol_guardado', 'admin');
            navegar('/admin');
        } else {
            localStorage.setItem('rol_guardado', 'usuario');
            navegar('/boveda');
        }

        setVerLogin(false);
        setErrorValidacion('');
    };

    const crearCuenta = (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmarPass) {
            setErrorValidacion('Las contraseñas no coinciden');
            return;
        }

        if (password.length < 4) {
            setErrorValidacion('Usa una contraseña mas segura');
            return;
        }

        alert('Cuenta creada exitosamente.');
        setVerRegistro(false);
        setErrorValidacion('');
        setVerLogin(true);
    };

    const cerrarSesion = () => {
        localStorage.removeItem('rol_guardado');
        navegar('/');
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
                    ) : (
                        <Link to="/boveda">Bóveda</Link>
                    )}

                    {rolActual ? (
                        <button onClick={cerrarSesion} className="btn-secundario">Salir</button>
                    ) : (
                        <>
                            <button onClick={() => {setVerLogin(true); setErrorValidacion('');}} className="btn-secundario">Login</button>
                            <button onClick={() => {setVerRegistro(true); setErrorValidacion('');}} className="btn-primario">Sign Up</button>
                        </>
                    )}
                </div>
            </nav>

            {/*  MODAL LOGIN  */}
            {verLogin && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="btn-cerrar" onClick={() => setVerLogin(false)}>X</button>
                        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Acceso</h2>

                        {errorValidacion && <p className="mensaje-error">{errorValidacion}</p>}

                        <form onSubmit={iniciarSesion}>
                            <div className="form-group">
                                <label>Correo Electrónico</label>
                                <input type="email" placeholder="admin@obsidian.com  para el admin" onChange={(e) => setCorreo(e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label>Contraseña</label>
                                <input type="password" onChange={(e) => setPassword(e.target.value)} required />
                            </div>
                            <button type="submit" className="btn-primario" style={{ width: '100%', marginTop: '10px' }}>Entrar</button>
                        </form>
                    </div>
                </div>
            )}

            {/*  MODAL REGISTRO */}
            {verRegistro && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="btn-cerrar" onClick={() => setVerRegistro(false)}>X</button>
                        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Crear Cuenta</h2>

                        {errorValidacion && <p className="mensaje-error">{errorValidacion}</p>}

                        <form onSubmit={crearCuenta}>
                            <div className="form-group">
                                <label>Correo Electrónico</label>
                                <input type="email" required />
                            </div>
                            <div className="form-group">
                                <label>Contraseña</label>
                                <input type="password" onChange={(e) => setPassword(e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label>Confirmar Contraseña</label>
                                {/* Aqui estaba el error. Ya dice setConfirmarPass */}
                                <input type="password" onChange={(e) => setConfirmarPass(e.target.value)} required />
                            </div>
                            <button type="submit" className="btn-primario" style={{ width: '100%', marginTop: '10px' }}>Registrarse</button>
                        </form>
                    </div>
                </div>
            )}

            {/* RUTAS DEL PROYECTO */}
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/boveda" element={<RutaProtegida><Boveda /></RutaProtegida>} />
                <Route path="/admin" element={<RutaProtegida ocupasAdmin={true}><Admin /></RutaProtegida>} />
            </Routes>
        </div>
    );
};