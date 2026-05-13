import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL, guardarSesion } from '../helpers/authHelper';

// el svg de google que usamos en los dos modales
const IconoGoogle = () => (
    <svg width="18" height="18" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
);

const loginConGoogle = () => {
    window.location.href = `${API_URL}/auth/google`;
};

// el modal de login
export const ModalLogin = ({ cerrar, abrirRegistro }: {
    cerrar: () => void,
    abrirRegistro: () => void
}) => {
    const navegar = useNavigate();
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [errorValidacion, setErrorValidacion] = useState('');
    const [camposTocados, setCamposTocados] = useState<string[]>([]);

    // lo mismo que teniamos en AppRouter pero aqui
    const marcarCampo = (campo: string, valor: string) => {
        if (valor.trim() === '' && !camposTocados.includes(campo)) {
            setCamposTocados([...camposTocados, campo]);
        }
        if (valor.trim() !== '') {
            setCamposTocados(camposTocados.filter(c => c !== campo));
        }
    };
    const campoVacio = (campo: string) => camposTocados.includes(campo);

    const iniciarSesion = async (e: React.FormEvent) => {
        e.preventDefault();
        if (correo === '' || password === '') {
            setErrorValidacion('Por favor llena todos los campos');
            return;
        }
        try {
            const resp = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: correo, password })
            });
            const datos = await resp.json();
            if (!resp.ok) {
                setErrorValidacion(datos.msg || 'Error al iniciar sesion');
                return;
            }
            guardarSesion(datos.token, datos.user);
            cerrar();
            if (datos.user.role === 'admin') {
                navegar('/admin');
            } else {
                navegar('/boveda');
            }
            window.location.reload();
        } catch (error) {
            setErrorValidacion('No se pudo conectar al servidor');
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="btn-cerrar" onClick={cerrar}>X</button>
                <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Acceso</h2>
                {errorValidacion && <p className="mensaje-error">{errorValidacion}</p>}
                <form onSubmit={iniciarSesion}>
                    <div className="form-group">
                        <label>Correo Electrónico</label>
                        <input type="email" placeholder="tu@correo.com"
                            className={campoVacio('login-correo') ? 'input-error' : ''}
                            onChange={(e) => setCorreo(e.target.value)}
                            onBlur={(e) => marcarCampo('login-correo', e.target.value)}
                            required />
                        {campoVacio('login-correo') && <span className="campo-requerido">Este campo es obligatorio</span>}
                    </div>
                    <div className="form-group">
                        <label>Contraseña</label>
                        <input type="password"
                            className={campoVacio('login-pass') ? 'input-error' : ''}
                            onChange={(e) => setPassword(e.target.value)}
                            onBlur={(e) => marcarCampo('login-pass', e.target.value)}
                            required />
                        {campoVacio('login-pass') && <span className="campo-requerido">Este campo es obligatorio</span>}
                    </div>
                    <button type="submit" className="btn-primario" style={{ width: '100%', marginTop: '10px' }}>Entrar</button>
                </form>
                <div style={{ textAlign: 'center', margin: '15px 0' }}>
                    <span style={{ color: '#666', fontSize: '14px' }}>— o —</span>
                </div>
                <button onClick={loginConGoogle} className="btn-secundario"
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <IconoGoogle /> Continuar con Google
                </button>
                <p style={{ textAlign: 'center', marginTop: '15px', color: '#666', fontSize: '13px' }}>
                    ¿No tienes cuenta? <span onClick={abrirRegistro} style={{ color: 'white', cursor: 'pointer', textDecoration: 'underline' }}>Regístrate</span>
                </p>
            </div>
        </div>
    );
};

// el modal de registro
export const ModalRegistro = ({ cerrar, abrirLogin }: {
    cerrar: () => void,
    abrirLogin: () => void
}) => {
    const navegar = useNavigate();
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [confirmarPass, setConfirmarPass] = useState('');
    const [errorValidacion, setErrorValidacion] = useState('');
    const [camposTocados, setCamposTocados] = useState<string[]>([]);

    const marcarCampo = (campo: string, valor: string) => {
        if (valor.trim() === '' && !camposTocados.includes(campo)) {
            setCamposTocados([...camposTocados, campo]);
        }
        if (valor.trim() !== '') {
            setCamposTocados(camposTocados.filter(c => c !== campo));
        }
    };
    const campoVacio = (campo: string) => camposTocados.includes(campo);

    const crearCuenta = async (e: React.FormEvent) => {
        e.preventDefault();
        if (nombre.trim() === '' || correo.trim() === '' || password === '') {
            setErrorValidacion('Llena todos los campos');
            return;
        }
        if (password !== confirmarPass) {
            setErrorValidacion('Las contraseñas no coinciden');
            return;
        }
        if (password.length < 6) {
            setErrorValidacion('La contraseña debe tener al menos 6 caracteres');
            return;
        }
        try {
            const resp = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: nombre, email: correo, password })
            });
            const datos = await resp.json();
            if (!resp.ok) {
                setErrorValidacion(datos.msg || 'Error al registrarse');
                return;
            }
            guardarSesion(datos.token, datos.user);
            cerrar();
            navegar('/boveda');
            window.location.reload();
        } catch (error) {
            setErrorValidacion('No se pudo conectar al servidor');
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="btn-cerrar" onClick={cerrar}>X</button>
                <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Crear Cuenta</h2>
                {errorValidacion && <p className="mensaje-error">{errorValidacion}</p>}
                <form onSubmit={crearCuenta}>
                    <div className="form-group">
                        <label>Nombre</label>
                        <input type="text"
                            className={campoVacio('reg-nombre') ? 'input-error' : ''}
                            onChange={(e) => setNombre(e.target.value)}
                            onBlur={(e) => marcarCampo('reg-nombre', e.target.value)}
                            required />
                        {campoVacio('reg-nombre') && <span className="campo-requerido">Este campo es obligatorio</span>}
                    </div>
                    <div className="form-group">
                        <label>Correo Electrónico</label>
                        <input type="email"
                            className={campoVacio('reg-correo') ? 'input-error' : ''}
                            onChange={(e) => setCorreo(e.target.value)}
                            onBlur={(e) => marcarCampo('reg-correo', e.target.value)}
                            required />
                        {campoVacio('reg-correo') && <span className="campo-requerido">Este campo es obligatorio</span>}
                    </div>
                    <div className="form-group">
                        <label>Contraseña</label>
                        <input type="password"
                            className={campoVacio('reg-pass') ? 'input-error' : ''}
                            onChange={(e) => setPassword(e.target.value)}
                            onBlur={(e) => marcarCampo('reg-pass', e.target.value)}
                            required />
                        {campoVacio('reg-pass') && <span className="campo-requerido">Este campo es obligatorio</span>}
                    </div>
                    <div className="form-group">
                        <label>Confirmar Contraseña</label>
                        <input type="password"
                            className={campoVacio('reg-confirm') ? 'input-error' : ''}
                            onChange={(e) => setConfirmarPass(e.target.value)}
                            onBlur={(e) => marcarCampo('reg-confirm', e.target.value)}
                            required />
                        {campoVacio('reg-confirm') && <span className="campo-requerido">Este campo es obligatorio</span>}
                    </div>
                    <button type="submit" className="btn-primario" style={{ width: '100%', marginTop: '10px' }}>Registrarse</button>
                </form>
                <div style={{ textAlign: 'center', margin: '15px 0' }}>
                    <span style={{ color: '#666', fontSize: '14px' }}>— o —</span>
                </div>
                <button onClick={loginConGoogle} className="btn-secundario"
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <IconoGoogle /> Registrarse con Google
                </button>
                <p style={{ textAlign: 'center', marginTop: '15px', color: '#666', fontSize: '13px' }}>
                    ¿Ya tienes cuenta? <span onClick={abrirLogin} style={{ color: 'white', cursor: 'pointer', textDecoration: 'underline' }}>Inicia sesión</span>
                </p>
            </div>
        </div>
    );
};
