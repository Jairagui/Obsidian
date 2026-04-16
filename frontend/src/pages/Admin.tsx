import { Link } from 'react-router-dom';

// lisat de mientasr
const usuariosBD = [
    { id: 1, nombre: "Jair Ernesto", correo: "jair@iteso.mx", rol: "Coleccionista" },
    { id: 2, nombre: "Juan Pablo", correo: "jpablo@iteso.mx", rol: "Coleccionista" },
    { id: 3, nombre: "Profe Admin", correo: "admin@obsidian.com", rol: "Administrador" }
];

export const Admin = () => {
    return (
        <div style={{ padding: '50px', maxWidth: '900px', margin: '0 auto' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Panel de Control</h2>
                <Link to="/" className="btn-secundario" style={{ textDecoration: 'none' }}>Volver al Inicio</Link>
            </div>

            <p style={{ color: '#888', marginBottom: '30px' }}>Usuarios registrados en la plataforma.</p>

            <table className="tabla-admin">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>Rol</th>
                </tr>
                </thead>
                <tbody>
                {usuariosBD.map((user) => (
                    <tr key={user.id}>
                        <td>#{user.id}</td>
                        <td>{user.nombre}</td>
                        <td>{user.correo}</td>
                        <td>
                <span style={{ backgroundColor: '#222', padding: '5px 10px', borderRadius: '5px', fontSize: '12px' }}>
                  {user.rol}
                </span>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};