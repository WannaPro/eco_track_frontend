import {
    createContext,
    ReactNode,
    useEffect,
    useState
} from 'react';

import { destroyCookie, setCookie, parseCookies } from 'nookies';
//import { api } from "../services/apiClient";
import { ErrorResponse } from "../App";
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { API } from '../services/apiClient';
//import { toast } from 'react-hot-toast';

export type AuthContextData = {

    user: UserProps | null;
    isAuthenticated: boolean;
    signIn: (credentials: SignInProps) => Promise<void>;
    signOut: () => void;
    //signUp: (credentials: SignUpProps) => Promise<void>;
}

export type UserProps = {
    id: string,
    name: string,
    email: string,
    password: string,
    points: number,
    token: string | null,
}

export type SignInProps = {
    email: string;
    password: string;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);



export type AuthProviderProps = {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const navigate = useNavigate(); // Hook para redirecionar o usuário

    const [user, setUser] = useState<UserProps | null>(null);

    const isAuthenticated = !!user;

    useEffect(() => {

        const { '@eco_track.token': token } = parseCookies();

        if (token) {

            API.get('/auth/detail/me').then(response => {

                const {
                    id,
                    name,
                    email,
                    password,
                    points
                } = response.data;

                const user = {
                    id,
                    name,
                    email,
                    password,
                    points,
                    token
                };

                setUser(user);

            }).catch((error) => {
                const err = error as ErrorResponse;

                if (err?.response?.data) {
                    toast(err.response.data.message);
                } else {
                    toast("Falha na conexão de rede.");
                }
            });
        }
    }, []);

    const signOut = () => {
        try {
            // Remove o cookie
            destroyCookie(undefined, '@eco_track.token', {
                path: '/', // Certifique-se de usar o mesmo path do cookie
            });

            setUser(null);

            // Após remover o cookie, redireciona para a página de login
            navigate('/');

            // Exibe uma notificação de sucesso
            toast.success('Sessão terminada com sucesso!');
        } catch (err) {
            console.error('Erro ao deslogar:', err);
            // Exibe uma notificação de erro
            toast.error('Erro ao tentar deslogar!');
        }
    };

    const signIn = async ({ email, password }: SignInProps): Promise<void> => {
        try {

            const response = await API.post('/auth', {
                email,
                password
            });

            const { user, access_token } = response.data;

            const userData = {
                id: user.id,
                name: user.name,
                email: user.email,
                password: user.password,
                points: user.points,
                token: access_token
            };

            setUser(userData);

            setCookie(undefined, '@eco_track.token', access_token, {
                maxAge: 60 * 60 * 24, // Expires in 1 day
                path: '/' // Path accessed by cookie
            });

            API.defaults.headers['Authorization'] = `Bearer ${access_token}`;

            toast.success('Logado com sucesso!');

        } catch (error) {
            const err = error as ErrorResponse;

            if (err?.response?.data) {
                toast.error(err.response.data.message);
            }
            else {
                toast.error("Falha na conexão de rede.");
            }
        }
    }

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            signIn,
            signOut
        }}>
            {children}
        </AuthContext.Provider>

    );
}