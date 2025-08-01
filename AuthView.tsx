import React, { useState, FormEvent } from 'react';
import { User } from '../../types';
import Card from '../common/Card';

interface AuthViewProps {
    onLoginSuccess: (user: User, isNewUser: boolean) => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onLoginSuccess }) => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        setError(null);

        if (!email || !password) {
            setError('Por favor, completa todos los campos.');
            return;
        }

        try {
            const usersDB: User[] = JSON.parse(localStorage.getItem('usersDB') || '[]');

            if (isLoginView) {
                // Handle Login
                const foundUser = usersDB.find(
                    (u) => u.email === email && u.password === password
                );
                if (foundUser) {
                    onLoginSuccess(foundUser, false);
                } else {
                    setError('Correo electrónico o contraseña incorrectos.');
                }
            } else {
                // Handle Register
                const existingUser = usersDB.find((u) => u.email === email);
                if (existingUser) {
                    setError('Este correo electrónico ya está registrado.');
                } else {
                    const isAdmin = usersDB.length === 0;
                    const newUser: User = { 
                        email, 
                        password, 
                        role: isAdmin ? 'admin' : 'student',
                        examHistory: [] 
                    };
                    usersDB.push(newUser);
                    localStorage.setItem('usersDB', JSON.stringify(usersDB));
                    onLoginSuccess(newUser, true);
                }
            }
        } catch (e) {
            console.error("Error de autenticación:", e);
            setError("Ocurrió un error. Inténtalo de nuevo.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <Card className="w-full max-w-md">
                <div className="p-8">
                    <h2 className="text-3xl font-bold text-center text-gray-100 mb-2">
                        {isLoginView ? 'Iniciar Sesión' : 'Crear Cuenta'}
                    </h2>
                    <p className="text-center text-gray-400 mb-8">
                        {isLoginView ? 'Bienvenido de nuevo.' : 'Únete a nuestra plataforma de estudio.'}
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-300"
                            >
                                Correo Electrónico
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-brand-gray-dark border border-gray-600 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-brand-red focus:border-brand-red sm:text-sm text-white"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-300"
                            >
                                Contraseña
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-brand-gray-dark border border-gray-600 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-brand-red focus:border-brand-red sm:text-sm text-white"
                            />
                        </div>

                        {error && (
                            <p className="text-sm text-red-500 text-center">{error}</p>
                        )}

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-red hover:bg-brand-red-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-gray-dark focus:ring-brand-red"
                            >
                                {isLoginView ? 'Ingresar' : 'Registrarse'}
                            </button>
                        </div>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-400">
                        {isLoginView ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
                        <button
                            onClick={() => {
                                setIsLoginView(!isLoginView);
                                setError(null);
                            }}
                            className="font-medium text-brand-red hover:text-red-400 ml-1"
                        >
                            {isLoginView ? 'Regístrate' : 'Inicia Sesión'}
                        </button>
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default AuthView;