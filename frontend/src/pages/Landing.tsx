import { Link } from 'react-router-dom';

export const Landing = () => {
    // si esta en log
    const haySesion = localStorage.getItem('rol_guardado');

    const revisarAcceso = (e: React.MouseEvent) => {
        if (!haySesion) {
            e.preventDefault();
            alert("¡Inicia sesión en el menú de arriba para entrar a tu bóveda!");
        }
    };

    return (
        <div>
            <div className="hero-container">
                <h1>Tu Colección. <br/> Digitalizada.</h1>
                <p>
                    Obsidian es la plataforma diseñada para coleccionistas.
                    Gestiona tu inventario de manera privada y segura.
                </p>

                <Link
                    to="/boveda"
                    className="btn-primario"
                    onClick={revisarAcceso}
                    style={{ padding: '15px 40px', fontSize: '18px', display: 'inline-block' }}
                >
                    Ver mi Bóveda
                </Link>
            </div>

            <div className="info-cards">
                <div className="card">
                    <h3 style={{ color: '#2563eb' }}>Organización</h3>
                    <p>Lleva un control exacto de tus artículos por marca, año y condición.</p>
                </div>

                <div className="card">
                    <h3 style={{ color: '#2563eb' }}>Privacidad</h3>
                    <p>Un sistema hecho exclusivamente para ti, sin módulos de venta externos.</p>
                </div>
            </div>
        </div>
    );
};