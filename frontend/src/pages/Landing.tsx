import { Link } from 'react-router-dom';
import { haySesionActiva } from '../helpers/authHelper';

// recibimos la funcion para abrir el registro desde AppRouter
export const Landing = ({ abrirRegistro }: { abrirRegistro?: () => void }) => {
    const haySesion = haySesionActiva();

    const revisarAcceso = (e: React.MouseEvent) => {
        if (!haySesion) {
            e.preventDefault();
            if (abrirRegistro) {
                abrirRegistro();
            }
        }
    };

    return (
        <div>
            <div className="hero-container">
                <h1>Tu Colección. <br/> <span>Digitalizada.</span></h1>
                <p>
                    Gestiona tu inventario de manera privada y segura.
                    Todo en un solo lugar, accesible desde cualquier dispositivo.
                </p>

                <Link
                    to="/boveda"
                    className="btn-primario"
                    onClick={revisarAcceso}
                    style={{ padding: '14px 40px', fontSize: '16px', display: 'inline-block' }}
                >
                    Ver mi Bóveda
                </Link>
            </div>

            <div className="info-cards">
                <div className="card">
                    <h3 style={{ color: '#2563eb' }}>Organización</h3>
                    <p>Lleva un control exacto de tus artículos por marca, categoría y condición.</p>
                </div>

                <div className="card">
                    <h3 style={{ color: '#22c55e' }}>Tiempo Real</h3>
                    <p>Los cambios se reflejan al instante . Sin recargar.</p>
                </div>

                <div className="card">
                    <h3 style={{ color: '#a855f7' }}>Privacidad</h3>
                    <p>Tu colección es tuya. Sin módulos de venta, sin acceso de terceros.</p>
                </div>
            </div>

            <div className="footer">
                <span>Obsidian</span> — Bóveda Digital para Coleccionistas  {new Date().getFullYear()}
            </div>
        </div>
    );
};
