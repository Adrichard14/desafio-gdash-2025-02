/* eslint-disable react-refresh/only-export-components */
import { AuthService, LoginCredentials, RegisterCredentials } from "@/services/authService";
import { User } from "../types/user";
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextData {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (credentials: RegisterCredentials) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            try {
                if (AuthService.isAuthenticated()) {
                    const userData = AuthService.getUser();

                    if (userData) {
                        setUser(userData);
                    } else {
                        const currentUser = await AuthService.getCurrentUser();
                        setUser(currentUser);
                    }
                }
            } catch (error) {
                console.error('Erro ao carregar usuário:', error);
                AuthService.clearAuth();
            } finally {
                setIsLoading(false);
            }
        };

        loadUser();
    }, []);

    const login = async (credentials: LoginCredentials) => {
        setIsLoading(true);
        try {
            const response = await AuthService.login(credentials);
            setUser(response.user);
        } catch (error) {
            console.error('Erro no login:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };
    const register = async (credentials: RegisterCredentials) => {
        setIsLoading(true);
        try {
            const response = await AuthService.register(credentials);
            setUser(response.user);
        } catch (error) {
            console.error('Erro no registro:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };
    const logout = async () => {
        try {
            setIsLoading(true);
            await AuthService.logout();
            setUser(null);
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateUser = (updatedUser: User) => {
        setUser(updatedUser);
        AuthService.setUser(updatedUser);
    };

    const value: AuthContextData = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextData => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};