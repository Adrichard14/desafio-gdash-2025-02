import React, { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthService } from '../services/authService'; // ← Importe direto o service

const RegisterPage: React.FC = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: ''
    });
    const [error, setError] = useState('');
    const [localLoading, setLocalLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }, []);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            setError('Todos os campos são obrigatórios');
            return;
        }
        
        if (formData.password !== formData.confirmPassword) {
            setError('As senhas não coincidem');
            return;
        }
        
        setError('');
        setLocalLoading(true);

        try {
            // ← Chame direto o AuthService, sem passar pelo Context
            await AuthService.register(formData);
            navigate('/dashboard');
        } catch (err: any) {
            let errorMessage = 'Erro ao registrar. Tente novamente.';
            if (err?.response?.data?.message) {
                if (Array.isArray(err.response.data.message)) {
                    errorMessage = err.response.data.message.join('; ');
                } else {
                    errorMessage = err.response.data.message;
                }
            } else if (err?.response?.data?.error) {
                if (Array.isArray(err.response.data.error)) {
                    errorMessage = err.response.data.error.join('; ');
                } else {
                    errorMessage = err.response.data.error;
                }
            } else if (err?.message) {
                errorMessage = err.message;
            }
            
            setError(errorMessage);
        } finally {
            setLocalLoading(false);
        }
    }, [formData, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                    Registrar
                </h1>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nome
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                            disabled={localLoading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                            disabled={localLoading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Senha
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                            disabled={localLoading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirmar senha
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                            disabled={localLoading}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={localLoading}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {localLoading ? 'Registrando...' : 'Registrar'}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600 mt-4">
                    Já tem uma conta?{' '}
                    <Link to="/login" className="text-blue-600 hover:underline">
                        Fazer login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;