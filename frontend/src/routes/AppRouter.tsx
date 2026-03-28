import { Routes, Route, Link } from 'react-router-dom';
import { Boveda } from '../pages/Boveda';

const Login = () => <h2>Login - Próximamente</h2>;
const Registro = () => <h2>Registro - Próximamente</h2>;

export const AppRouter = () => {
    return (
        <div>
            <nav className="menu">
                <Link to="/">Login</Link>
                <Link to="/registro">Registro</Link>
                <Link to="/boveda">Mi Bóveda</Link>
            </nav>

            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/registro" element={<Registro />} />
                <Route path="/boveda" element={<Boveda />} />
            </Routes>
        </div>
    );
};