import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import type { Articulo } from '../interfaces/Articulo-front';
import { API_URL, headersConToken, obtenerToken, obtenerUsuario, cerrarSesionHelper } from '../helpers/authHelper';

const SOCKET_URL = 'http://localhost:3000';

export const useBoveda = () => {
    const [articulos, setArticulos] = useState<Articulo[]>([]);
    const [busqueda, setBusqueda] = useState('');
    const [categoriaSelect, setCategoriaSelect] = useState('Todas');
    const [estaCargando, setEstaCargando] = useState(true);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [mensaje, setMensaje] = useState('');
    const [tipoMsg, setTipoMsg] = useState<'ok' | 'error'>('ok'); // para saber si es verde o rojo

    const usuario = obtenerUsuario();

    // mostrar mensaje verde o rojo
    const mostrarMsg = (texto: string, tipo: 'ok' | 'error' = 'ok') => {
        setMensaje(texto);
        setTipoMsg(tipo);
        setTimeout(() => { setMensaje(''); }, 3000);
    };

    // si el token expiro cerramos sesion y mandamos al inicio
    const manejarTokenExpirado = () => {
        mostrarMsg('Tu sesion expiro, vuelve a iniciar sesion', 'error');
        setTimeout(() => {
            cerrarSesionHelper();
            window.location.href = '/';
        }, 2000);
    };

    useEffect(() => {
        const sock = io(SOCKET_URL);
        setSocket(sock);
        if (usuario?.id) {
            sock.on('connect', () => {
                sock.emit('unirse_sala', usuario.id);
            });
        }
        cargarArticulos();
        return () => { sock.disconnect(); };
    }, []);

    useEffect(() => {
        if (!socket) return;
        socket.on('articulo_agregado', (nuevo: Articulo) => {
            setArticulos(prev => {
                const yaEsta = prev.find(a => a._id === nuevo._id);
                if (yaEsta) return prev;
                return [...prev, nuevo];
            });
        });
        socket.on('articulo_borrado', (id: string) => {
            setArticulos(prev => prev.filter(a => a._id !== id));
        });
        socket.on('articulo_actualizado', (editado: Articulo) => {
            setArticulos(prev => prev.map(a => a._id === editado._id ? editado : a));
        });
        return () => {
            socket.off('articulo_agregado');
            socket.off('articulo_borrado');
            socket.off('articulo_actualizado');
        };
    }, [socket]);

    const cargarArticulos = async () => {
        setEstaCargando(true);
        try {
            const resp = await fetch(`${API_URL}/articulos`, { headers: headersConToken() });

            if (resp.status === 401) {
                manejarTokenExpirado();
                return;
            }

            if (resp.ok) {
                const data = await resp.json();
                setArticulos(data);
            } else {
                mostrarMsg('Error al cargar los articulos', 'error');
            }
        } catch (err) {
            console.log("no se pudieron cargar los articulos", err);
            mostrarMsg('No se pudo conectar al servidor', 'error');
        } finally {
            setEstaCargando(false);
        }
    };

    // agregar - usa FormData para la foto
    const agregarArticulo = async (datos: any, foto: File | null) => {
        // validar que no esten vacios
        if (!datos.nombre || datos.nombre.trim() === '') {
            mostrarMsg('El nombre no puede estar vacio', 'error');
            return false;
        }
        if (!datos.marca || datos.marca.trim() === '') {
            mostrarMsg('La marca no puede estar vacia', 'error');
            return false;
        }
        if (!datos.precio || datos.precio <= 0) {
            mostrarMsg('El precio tiene que ser mayor a 0', 'error');
            return false;
        }

        try {
            const form = new FormData();
            form.append('nombre', datos.nombre.trim());
            form.append('marca', datos.marca.trim());
            form.append('categoria', datos.categoria);
            form.append('anio', String(datos.anio));
            form.append('condicion', datos.condicion);
            form.append('precio', String(datos.precio));
            if (foto) form.append('imagen', foto);

            const resp = await fetch(`${API_URL}/articulos`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${obtenerToken()}` },
                body: form
            });

            if (resp.status === 401) {
                manejarTokenExpirado();
                return false;
            }

            if (resp.ok) {
                await resp.json();
                mostrarMsg('Articulo guardado!');
                return true;
            } else {
                const data = await resp.json();
                mostrarMsg(data.msg || 'No se pudo guardar', 'error');
                return false;
            }
        } catch (err) {
            console.log("error al agregar", err);
            mostrarMsg('No se pudo conectar al servidor', 'error');
            return false;
        }
    };

    const editarArticulo = (editado: Articulo) => {
        setArticulos(prev => prev.map(a => a._id === editado._id ? editado : a));
        mostrarMsg('Se guardo el cambio');
    };

    const borrarArticulo = async (id: string) => {
        try {
            const resp = await fetch(`${API_URL}/articulos/${id}`, {
                method: 'DELETE', headers: headersConToken()
            });

            if (resp.status === 401) {
                manejarTokenExpirado();
                return;
            }

            if (resp.ok) {
                setArticulos(prev => prev.filter(a => a._id !== id));
                mostrarMsg('Se elimino el articulo');
            } else {
                const data = await resp.json();
                mostrarMsg(data.msg || 'No se pudo borrar', 'error');
            }
        } catch (err) {
            console.log("error borrando", err)
            mostrarMsg('Error de conexion', 'error');
        }
    };

    const vaciarBoveda = async () => {
        try {
            const resp = await fetch(`${API_URL}/articulos/vaciar`, {
                method: 'DELETE', headers: headersConToken()
            });

            if (resp.status === 401) {
                manejarTokenExpirado();
                return;
            }

            if (resp.ok) {
                setArticulos([]);
                mostrarMsg('Se vacio la boveda');
            } else {
                mostrarMsg('No se pudo vaciar', 'error');
            }
        } catch (err) {
            console.log("error al vaciar", err)
            mostrarMsg('Error de conexion', 'error');
        }
    };

    // filtros
    const articulosFiltrados = articulos.filter((item) => {
        const coincideNombre = item.nombre.toLowerCase().includes(busqueda.toLowerCase());
        const coincideCategoria = categoriaSelect === 'Todas' || item.categoria === categoriaSelect;
        return coincideNombre && coincideCategoria;
    });

    const totalEstimado = articulosFiltrados.reduce((ac, item) => ac + item.precio, 0);
    const conteoSneakers = articulos.filter(a => a.categoria === 'Sneakers').length;
    const conteoRelojes = articulos.filter(a => a.categoria === 'Relojes').length;
    const conteoFiguras = articulos.filter(a => a.categoria === 'Figuras').length;

    return {
        articulos, setArticulos, busqueda, setBusqueda,
        categoriaSelect, setCategoriaSelect,
        estaCargando, articulosFiltrados,
        borrarArticulo, agregarArticulo, editarArticulo,
        vaciarBoveda, totalEstimado,
        conteoSneakers, conteoRelojes, conteoFiguras,
        mensaje, tipoMsg
    };
};
