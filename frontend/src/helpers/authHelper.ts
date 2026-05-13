// helper para todo lo de autenticacion
// aqui guardamos y leemos el token y el usuario del localStorage
const TOKEN_KEY = 'obsidian_token';
const USER_KEY = 'obsidian_usuario';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const guardarSesion = (token: string, usuario: any) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(usuario));
};

export const obtenerToken = (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
};

export const obtenerUsuario = (): any | null => {
    const data = localStorage.getItem(USER_KEY);
    if (!data) return null;
    try { return JSON.parse(data); }
    catch { return null; }
};

export const cerrarSesionHelper = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
};

export const haySesionActiva = (): boolean => {
    return obtenerToken() !== null;
};

export const obtenerRol = (): string | null => {
    const usuario = obtenerUsuario();
    return usuario ? usuario.role : null;
};

export const headersConToken = () => {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${obtenerToken()}`
    };
};