// src/components/Login.js
import React, { useState } from 'react';
import { LogInIcon, UserPlusIcon } from '../icons'; // Assuming icons are in a separate file or directly imported as SVG

const Login = ({ onLoginSuccess, onNavigateToRegister, appData }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');

        const user = appData.users.find(u => u.email === email && u.password === password);

        if (user) {
            if (user.status === 'approved') {
                onLoginSuccess(user.id, user.role, user.status, user.department, user.specialization, user.rank, user.callSign);
            } else {
                setError('Uw account is nog niet goedgekeurd of is geweigerd. Neem contact op met de beheerder.');
            }
        } else {
            setError('Fout bij inloggen. Controleer uw e-mail en wachtwoord.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
            <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
                <h2 className="text-3xl font-bold text-blue-400 mb-6 text-center">Inloggen</h2>
                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="block text-gray-300 text-sm font-medium mb-2">E-mailadres</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="uw@email.com"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-gray-300 text-sm font-medium mb-2">Wachtwoord</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Wachtwoord"
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white p-3 rounded-md font-semibold hover:bg-blue-700 transition duration-200 ease-in-out shadow-lg"
                    >
                        <LogInIcon className="inline-block mr-2" /> Inloggen
                    </button>
                </form>
                <div className="mt-6 text-center space-y-3">
                    <button
                        onClick={onNavigateToRegister}
                        className="text-blue-400 hover:underline text-sm block w-full"
                    >
                        <UserPlusIcon className="inline-block mr-1" /> Nog geen account? Registreren
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
