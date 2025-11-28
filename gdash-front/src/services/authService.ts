import { apiClient } from "@/lib/axios";
import { User } from "@/types/insight";

export interface RegisterCredentials {
    email: string;
    password: string;
    confirmPassword: string;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface AuthResponse {
    user: User;
    tokens: AuthTokens;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export class AuthService {
    private static readonly BASE_PATH = '/auth';

    constructor() { }

    private static readonly TOKEN_KEY = 'access_token';
    private static readonly REFRESH_TOKEN_KEY = 'refresh_token';
    private static readonly USER_KEY = 'user_data';

    static async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await apiClient.post(`${this.BASE_PATH}/login`, credentials);
        this.setTokens(response.data.tokens);
        this.setUser(response.data.user);
        return response.data;
    }

    static async register(credentials: RegisterCredentials): Promise<AuthResponse> {
        try {
            const response = await apiClient.post<AuthResponse>(
                `${this.BASE_PATH}/register`,
                credentials
            );

            this.setTokens(response.data.tokens);
            this.setUser(response.data.user);

            return response.data;
        } catch (error) {
            console.error('Erro ao registrar:', error);
            throw error;
        }
    }

    static isAuthenticated(): boolean {
        return !!this.getAccessToken();
    }

    static async logout(): Promise<void> {
        try {
            const response = await apiClient.post(`${this.BASE_PATH}/register`);
            if (response) {
                this.clearAuth();
            }
        } catch (error) {
            console.error('Erro ao registrar:', error);
            throw error;
        }
    }

    static clearAuth(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.REFRESH_TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
    }

    static setTokens(tokens: { accessToken: string; refreshToken: string }): void {
        localStorage.setItem(this.TOKEN_KEY, tokens.accessToken);
        localStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refreshToken);
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
            const refreshToken = this.getRefreshToken();

            if (!refreshToken) {
                throw new Error('Refresh token não encontrado');
            }

            const response = await apiClient.post<{ accessToken: string }>(
                `${this.BASE_PATH}/refresh`,
                { refreshToken }
            );

            this.setAccessToken(response.data.accessToken);
            return response.data.accessToken;
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