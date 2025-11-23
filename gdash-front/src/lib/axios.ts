import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = 'http://localhost:3004/api';
const API_TIMEOUT = 10000; // 10 segundos

export const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT,
    headers: {
        'Content-Type': 'application/json'
    },
});

const isDev = true; // TODO: remover e usar env import.meta.env.DEV


apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('auth_token'); // TODO: adicionar token
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        if (isDev) {
            console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => {
        if (isDev) {
            console.log(`[API Response] ${response.config.url}`, response.data);
        }
        return response;
    },
    (error: AxiosError) => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    localStorage.removeItem('auth_token');
                    window.location.href = '/login';
                    break;
                case 403:
                    console.error('Acesso negado');
                    break;
                case 404:
                    console.error('Recurso não encontrado');
                    break;
                case 500:
                    console.error('Erro interno do servidor');
                    break;
            }
        } else if (error.request) {
            console.error('Sem resposta do servidor');
        } else {
            console.error('Erro na configuração da requisição');
        }

        return Promise.reject(error);
    }
);