import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const GoogleCallback = () => {
    const navegar = useNavigate();
    const [params] = useSearchParams();
    const { iniciarSesionCtx } = useAuth();

    useEffect(() => {
        const token = params.get('token');
        const name = params.get('name');
        const role = params.get('role');
        const id = params.get('id');

        if (token) {
            // usamos el context para que la UI se actualice sola
            iniciarSesionCtx(token, { id, name, role });

            if (role === 'admin') {
                navegar('/admin');
            } else {
                navegar('/boveda');
            }
        } else {
            navegar('/');
        }
    }, []);

    return (
        <div style={{ textAlign: 'center', padding: '100px', color: '#888' }}>
            <p>Procesando sesión con Google...</p>
        </div>
    );
};
