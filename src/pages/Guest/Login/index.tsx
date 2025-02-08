import {

    FormEvent,
    useState,
    useContext,

} from 'react';
import { Link } from "react-router-dom";
import Loading from '../../../components/Loading';
import { AuthContext } from '../../../contexts/AuthContext';
import './Login.css'; // Importando o CSS
import toast from 'react-hot-toast';

export const Login = () => {
    const { signIn } = useContext(AuthContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();

        if (email === '' || password === '') {
            toast.error("Preencha todos os campos!");
            return;
        }

        setLoading(true);

        await signIn({ email, password });

        setLoading(false);
    }

    if (loading) {
        return (
            <div className="login-container">
                <Loading size={2} />
            </div>
        );
    }

    return (
        <div className="login-container">
            
            <div className="login-card">

                <h1 className='login-title'>Iniciar sessão</h1>

                <form onSubmit={handleLogin} className="login-form">
                    <div className="">
                        <input
                            type="email"
                            placeholder="Email"
                            className="login-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Palavra-passe"
                            className="login-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                    </div>

                    <button type="submit" className="login-button">
                        <p>Entrar</p>
                    </button>

                    <div className="login-signup">
                        <span>Não possui uma conta?</span>
                        <Link to='/register'>Criar conta.</Link>
                    </div>
                </form>
            </div>

            <div className="login-footer">
                <Link to={`/`}>Eco Track © {new Date().getFullYear()}</Link>
            </div>
        </div>
    )
}
