import { apiClient } from "@/lib/axios";
import { User } from "@/types/insight";

export interface RegisterCredentials {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface AuthTokens {
    access_token: string;
    refresh_token: string;
}

export interface AuthResponse {
    user: User;
    access_token: string;
    refresh_token: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export class AuthService {
    private static readonly BASE_PATH = '/auth';
    private static readonly BASE_USER = '/user';

    private static readonly TOKEN_KEY = 'access_token';
    private static readonly REFRESH_TOKEN_KEY = 'refresh_token';
    private static readonly USER_KEY = 'user_data';

    static async login(credentials: LoginCredentials): Promise<AuthResponse> {
        try {
            const response = await apiClient.post<AuthResponse>(
                `${this.BASE_PATH}/login`, 
                credentials
            );
            
            this.setTokens({ 
                access_token: response.data.access_token, 
                refresh_token: response.data.refresh_token 
            });
            this.setUser(response.data.user);
            
            return response.data;
        } catch (error) {
            console.error('Erro no login:', error);
            throw error;
        }
    }

    static async register(credentials: RegisterCredentials): Promise<AuthResponse> {
        try {
            const response = await apiClient.post<AuthResponse>(
                `${this.BASE_USER}`,
                credentials
            );

            // ✅ CORRIGIDO: Extrair tokens corretamente
            this.setTokens({ 
                access_token: response.data.access_token, 
                refresh_token: response.data.refresh_token 
            });
            this.setUser(response.data.user);

            return response.data;
        } catch (error) {
            console.error('Erro no registro:', error);
            throw error;
        }
    }

    static isAuthenticated(): boolean {
        return !!this.getAccessToken();
    }

    static async logout(): Promise<void> {
        try {
            await apiClient.post(`${this.BASE_PATH}/logout`);
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        } finally {
            // ✅ Sempre limpa auth, mesmo com erro
            this.clearAuth();
        }
    }

    static clearAuth(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.REFRESH_TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
    }

    static setTokens(tokens: { access_token: string; refresh_token: string }): void {
        localStorage.setItem(this.TOKEN_KEY, tokens.access_token);
        localStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refresh_token);
    }

    static setAccessToken(token: string): void {
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    static getAccessToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    static getRefreshToken(): string | null {
        return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    }

    static setUser(user: User): void {
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }

    static getUser(): User | null {
        const userData = localStorage.getItem(this.USER_KEY);
        return userData ? JSON.parse(userData) : null;
    }

    static async refreshAccessToken(): Promise<string> {
        try {
            const refresh_token = this.getRefreshToken();

            if (!refresh_token) {
                throw new Error('Refresh token não encontrado');
            }

            const response = await apiClient.post<{ access_token: string }>(
                `${this.BASE_PATH}/refresh`,
                { refresh_token }
            );

            this.setAccessToken(response.data.access_token);
            return response.data.access_token;
        } catch (error) {
            console.error('Erro ao atualizar token:', error);
            this.clearAuth();
            throw error;
        }
    }

    static async getCurrentUser(): Promise<User> {
        try {
            const response = await apiClient.get<User>(`${this.BASE_PATH}/me`);
            this.setUser(response.data);
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            throw error;
        }
    }
}