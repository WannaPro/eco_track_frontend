import axios, { AxiosError } from 'axios';
import { parseCookies } from 'nookies'

export const setupAPIClient = (context = undefined) => {

    const cookies = parseCookies(context);

    const api = axios.create({

        baseURL: 'https://ecotrackbackend-production.up.railway.app',
        //withCredentials: true,
        headers: {
            Authorization: `Bearer ${cookies['@eco_track.token']}`
        }
    })

    api.interceptors.response.use((response) => {

        return response;

    }, (err: AxiosError) => {

        if (err.response?.status === 401) {

            if (typeof window !== 'undefined') {
                // SIGNOUT USER
                //signOut();
            } else {
                return Promise.reject();
            }
        }

        if (err.code === 'ECONNABORTED' && err.message.includes('timeout')) {
            
            // Lidar com o tempo limite da requisição
            console.error('A requisição excedeu o tempo limite');
            alert('A requisição excedeu o tempo limite');

        } else if (err.response && err.response?.status === 503) {
            
            // Lidar com o status 503 (Serviço Indisponível)
            console.error('A API está em manutenção. Tente novamente mais tarde.');
            alert('A API está em manutenção. Tente novamente mais tarde.');

            // Aqui você pode exibir uma mensagem para o usuário informando sobre a manutenção
        }

        return Promise.reject(err);
    })

    return api;
}
