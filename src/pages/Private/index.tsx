import { useContext, useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import Loading from '../../components/Loading';
import '../Guest/Login/Login.css'; // Importando o CSS

function Private() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user === undefined) return; // Se ainda está carregando, não faz nada

        if (!user || !user.token) {
            navigate('/');
            return;
        }

        setLoading(false);
    }, [user, navigate]);

    if (loading || !user) {
        return (
            <div className="login-container">
                <Loading size={2} />
            </div>
        );
    }

    // Renderiza o conteúdo para usuários autenticados
    return (
        <div className="bg-gray-50 h-[100vh] w-full">
            <div className="flex justify-start text-sm w-full">
                <Outlet />
            </div>
        </div>
    );
}

export default Private;
