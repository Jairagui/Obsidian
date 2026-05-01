// src/hooks/useBoveda.ts
import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import type { Articulo } from '../interfaces/Articulo';
import { API_URL, headersConToken, obtenerUsuario } from '../helpers/authHelper';

const SOCKET_URL = 'http://localhost:3000';

// manejos de estados
export const useBoveda = () => {
    const [articulos, setArticulos] = useState<Articulo[]>([]);
    const [busqueda, setBusqueda] = useState('');
    const [categoriaSelect, setCategoriaSelect] = useState('Todas');
    const [estaCargando, setEstaCargando] = useState(true);
    const [socket, setSocket] = useState<Socket | null>(null);

    const usuario = obtenerUsuario();

    // conectar socket y cargar articulos
    useEffect(() => {
        const nuevoSocket = io(SOCKET_URL);
        setSocket(nuevoSocket);

        if (usuario?.id) {
            nuevoSocket.on('connect', () => {
                nuevoSocket.emit('unirse_sala', usuario.id);
            });
        }

        // traer articulos del backend
        cargarArticulos();

        return () => { nuevoSocket.disconnect(); };
    }, []);

    // escuchar socket para tiempo real
    useEffect(() => {
        if (!socket) return;

        socket.on('articulo_agregado', (nuevo: Articulo) => {
            setArticulos(prev => {
                if (prev.find(a => a._id === nuevo._id)) return prev;
                return [...prev, nuevo];
            });
        });

        socket.on('articulo_borrado', (idBorrado: string) => {
            setArticulos(prev => prev.filter(a => a._id !== idBorrado));
        });

        return () => {
            socket.off('articulo_agregado');
            socket.off('articulo_borrado');
        };
    }, [socket]);

    const cargarArticulos = async () => {
        setEstaCargando(true);
        try {
            const resp = await fetch(`${API_URL}/articulos`, {
                headers: headersConToken()
            });
            if (resp.ok) {
                const datos = await resp.json();
                setArticulos(datos);
            }
        } catch (error) {
            console.error('Error cargando articulos:', error);
        } finally {
            setEstaCargando(false);
        }
    };

    // agregar articulo por la api
    const agregarArticulo = async (nuevo: Omit<Articulo, '_id'>) => {
    try {
        const resp = await fetch(`${API_URL}/articulos`, {
            method: 'POST',
            headers: headersConToken(),
            body: JSON.stringify(nuevo)
        });
        if (resp.ok) {
            await resp.json();
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error al agregar:', error);
        return false;
    }
};

    // Funcion para eliminar
    const borrarArticulo = async (id: string) => {
        try {
            const resp = await fetch(`${API_URL}/articulos/${id}`, {
                method: 'DELETE',
                headers: headersConToken()
            });
            if (resp.ok) {
                setArticulos(prev => prev.filter(item => item._id !== id));
            }
        } catch (error) {
            console.error('Error al borrar:', error);
        }
    };

    // Buscador y filtros combinados
    const articulosFiltrados = articulos.filter((item) => {
        const coincideNombre = item.nombre.toLowerCase().includes(busqueda.toLowerCase());
        const coincideCategoria = categoriaSelect === 'Todas' || item.categoria === categoriaSelect;
        return coincideNombre && coincideCategoria;
    });

    // Sumamos los precios
    const totalEstimado = articulosFiltrados.reduce((acumulado, item) => acumulado + item.precio, 0);

    return {
        articulos, setArticulos,
        busqueda, setBusqueda,
        categoriaSelect, setCategoriaSelect,
        estaCargando, articulosFiltrados,
        borrarArticulo, agregarArticulo, totalEstimado
    };
};
