
import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import type { Articulo } from '../interfaces/Articulo-front.ts';
import { API_URL, headersConToken, obtenerToken, obtenerUsuario } from '../helpers/authHelper';

const SOCKET_URL = 'http://localhost:3000';

export const useBoveda = () => {
    const [articulos, setArticulos] = useState<Articulo[]>([]);
    const [busqueda, setBusqueda] = useState('');
    const [categoriaSelect, setCategoriaSelect] = useState('Todas');
    const [estaCargando, setEstaCargando] = useState(true);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [mensaje, setMensaje] = useState(''); // para el toast

    const usuario = obtenerUsuario();

    // mostrar un mensaje arriba que se quita despues de unos segundos
    const mostrarMsg = (texto: string) => {
        setMensaje(texto);
        setTimeout(() => {
            setMensaje('');
        }, 3000);
    };

    // conexion del socket
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

    // eventos del socket para que se actualice solo
    useEffect(() => {
        if (!socket) return;

        socket.on('articulo_agregado', (nuevo: Articulo) => {
            setArticulos(prev => {
                // checamos que no se repita
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

    // traer los articulos de la api
    const cargarArticulos = async () => {
        setEstaCargando(true);
        try {
            const resp = await fetch(`${API_URL}/articulos`, { headers: headersConToken() });
            if (resp.ok) {
                const data = await resp.json();
                setArticulos(data);
            }
        } catch (err) {
            console.log("no se pudieron cargar los articulos", err);
        } finally {
            setEstaCargando(false);
        }
    };

    // agregar articulo - usamos FormData porque mandamos la foto tambien
    const agregarArticulo = async (datos: any, foto: File | null) => {
        try {
            // FormData es para poder mandar archivos junto con los datos
            const formData = new FormData();
            formData.append('nombre', datos.nombre);
            formData.append('marca', datos.marca);
            formData.append('categoria', datos.categoria);
            formData.append('anio', String(datos.anio));
            formData.append('condicion', datos.condicion);
            formData.append('precio', String(datos.precio));

            // si selecciono una foto la metemos al form
            if (foto) {
                formData.append('imagen', foto);
            }

            const resp = await fetch(`${API_URL}/articulos`, {
                method: 'POST',
                // ojo: no ponemos Content-Type porque FormData lo pone solo
                headers: { 'Authorization': `Bearer ${obtenerToken()}` },
                body: formData
            });

            if (resp.ok) {
                await resp.json();
                mostrarMsg('Articulo guardado!');
                return true;
            }
            return false;

        } catch (err) {
            console.log("error al agregar", err);
            return false;
        }
    };

    // cuando se edita desde la tarjeta
    const editarArticulo = (editado: Articulo) => {
        setArticulos(prev => prev.map(a => a._id === editado._id ? editado : a));
        mostrarMsg('Se guardo el cambio');
    };

    // borrar
    const borrarArticulo = async (id: string) => {
        try {
            const resp = await fetch(`${API_URL}/articulos/${id}`, {
                method: 'DELETE',
                headers: headersConToken()
            });
            if (resp.ok) {
                setArticulos(prev => prev.filter(a => a._id !== id));
                mostrarMsg('Se elimino el articulo');
            }
        } catch (err) {
            console.log("error borrando", err)
        }
    };

    // borrar todo
    const vaciarBoveda = async () => {
        try {
            const resp = await fetch(`${API_URL}/articulos/vaciar`, {
                method: 'DELETE',
                headers: headersConToken()
            });
            if (resp.ok) {
                setArticulos([]);
                mostrarMsg('Se vacio la boveda');
            }
        } catch (err) {
            console.log("error al vaciar", err)
        }
    };

    // filtros
    const articulosFiltrados = articulos.filter((item) => {
        const coincideNombre = item.nombre.toLowerCase().includes(busqueda.toLowerCase());
        const coincideCategoria = categoriaSelect === 'Todas' || item.categoria === categoriaSelect;
        return coincideNombre && coincideCategoria;
    });

    // total
    const totalEstimado = articulosFiltrados.reduce((ac, item) => ac + item.precio, 0);

    // conteos
    const conteoSneakers = articulos.filter(a => a.categoria === 'Sneakers').length;
    const conteoRelojes = articulos.filter(a => a.categoria === 'Relojes').length;
    const conteoFiguras = articulos.filter(a => a.categoria === 'Figuras').length;

    return {
        articulos, setArticulos, busqueda, setBusqueda,
        categoriaSelect, setCategoriaSelect,
        estaCargando, articulosFiltrados,
        borrarArticulo, agregarArticulo, editarArticulo,
        vaciarBoveda, totalEstimado,
        conteoSneakers, conteoRelojes, conteoFiguras, mensaje
    };
};
