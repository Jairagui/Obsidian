import { createContext, useContext, useState } from 'react';
import { guardarSesion, cerrarSesionHelper, obtenerUsuario, obtenerToken } from '../helpers/authHelper';

// los datos que comparte el context
interface AuthContexto {
    usuario: any;
    token: string | null;
    iniciarSesionCtx: (token: string, user: any) => void;
    cerrarSesionCtx: () => void;
    haySession: () => boolean;
}

const AuthContext = createContext<AuthContexto | null>(null);

// el provider que envuelve toda la app
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [usuario, setUsuario] = useState(obtenerUsuario());
    const [token, setToken] = useState(obtenerToken());

    // cuando hace login guardamos en localStorage Y en el state
    const iniciarSesionCtx = (nuevoToken: string, user: any) => {
        guardarSesion(nuevoToken, user);
        setToken(nuevoToken);
        setUsuario(user);
    };

    // cuando cierra sesion limpiamos todo
    const cerrarSesionCtx = () => {
        cerrarSesionHelper();
        setToken(null);
        setUsuario(null);
    };

    const haySession = () => token !== null;

    return (
        <AuthContext.Provider value={{ usuario, token, iniciarSesionCtx, cerrarSesionCtx, haySession }}>
            {children}
        </AuthContext.Provider>
    );
};

// hook para usar el context facil
export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth tiene que estar dentro de AuthProvider');
    return ctx;
};
