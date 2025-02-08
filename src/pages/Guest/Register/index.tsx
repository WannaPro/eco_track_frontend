import {

    FormEvent,
    useContext,
    useState,

} from 'react';
import { Link, useNavigate } from "react-router-dom";
import Loading from '../../../components/Loading';
import './Register.css'; // Importando o CSS
import toast from 'react-hot-toast';
import { API } from '../../../services/apiClient';
import { ErrorResponse } from '../../../App';
import { AuthContext } from '../../../contexts/AuthContext';

export const Register = () => {

    const { signIn } = useContext(AuthContext);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e: FormEvent) => {
        e.preventDefault();

        if (email === '' || password === '' || name === '') {
            toast.error("Preencha todos os campos!");
            return;
        }

        setLoading(true);

        try {

            await API.post('/users', {
                email, password, name
            });

            await signIn({ email, password });

            navigate('/');

            //toast.error("Conta criada com sucesso.");

        } catch (error) {
            const err = error as ErrorResponse;

            if (err?.response?.data) {
                toast.error(err.response.data.message);
            }
            else {
                toast.error("Falha na conexão de rede.");
            }
        } finally {
            setLoading(false);
        }
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

                <h1 className='login-title'>Criar conta</h1>

                <form onSubmit={handleRegister} className="login-form">
                    <div className="">
                        <input
                            type="text"
                            placeholder="Nome completo"
                            className="login-input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
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
                            <p>Cadastrar</p>
                        </button>

                    <div className="login-signup">
                        <span>Já possui uma conta?</span>
                        <Link to='/'>Entrar</Link>
                    </div>
                </form>
            </div>

            <div className="login-footer">
                <Link to={`/`}>Eco Track © {new Date().getFullYear()}</Link>
            </div>
        </div>
    )
}
