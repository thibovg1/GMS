// src/components/Register.js
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { departmentsList, ranksByDepartment, specializationsByRank } from '../data'; // Import data
import { UserPlusIcon } from '../icons'; // Assuming icons are in a separate file or directly imported as SVG
import Modal from './Modal'; // Import Modal component

const Register = ({ onRegisterSuccess, onNavigateToLogin, appData, setAppData }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [department, setDepartment] = useState('');
    const [rank, setRank] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [callSign, setCallSign] = useState('');
    const [modal, setModal] = useState({ show: false, title: '', message: '', type: 'info' });

    const handleRegister = (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (appData.users.some(u => u.email === email)) {
            setError('Dit e-mailadres is al geregistreerd.');
            return;
        }

        if (!department || (department !== 'Burger' && (!rank || !specialization))) {
            setError('Kies alstublieft een afdeling, rang en specialisatie.');
            return;
        }

        if (department !== 'Burger' && department !== 'Meldkamer' && !callSign.trim()) {
            setError('Roepnummer is verplicht voor hulpdiensten.');
            return;
        }

        const newUserId = uuidv4();
        const newUser = {
            id: newUserId,
            email: email,
            password: password, // WARNING: Passwords should NEVER be stored in plaintext!
            role: 'user', // All new registrations start as 'user'
            status: 'approved', // AUTOMATIC APPROVAL HERE
            department: department,
            rank: rank,
            specialization: specialization,
            callSign: department !== 'Burger' && department !== 'Meldkamer' ? callSign.trim() : null,
            createdAt: new Date().toISOString(),
        };

        const updatedUsers = [...appData.users, newUser];
        let updatedUnits = [...appData.units];

        // If it's an emergency service, also create a unit document
        if (department !== 'Burger' && department !== 'Meldkamer') {
            const newUnit = {
                id: newUserId, // Use the same ID as the user for the unit
                name: newUser.callSign,
                status: 'Niet Beschikbaar',
                department: newUser.department,
                rank: newUser.rank,
                specialization: newUser.specialization,
                lastUpdated: new Date().toISOString(),
            };
            updatedUnits.push(newUnit);
        }

        setAppData(prevData => ({
            ...prevData,
            users: updatedUsers,
            units: updatedUnits,
        }));

        setModal({ show: true, title: 'Registratie Succesvol', message: 'Registratie succesvol! U bent nu ingelogd.', type: 'success', onClose: () => { setModal({ ...modal, show: false }); onRegisterSuccess(newUser.id, newUser.role, newUser.status, newUser.department, newUser.specialization, newUser.rank, newUser.callSign); } });
        setEmail('');
        setPassword('');
        setDepartment('');
        setRank('');
        setSpecialization('');
        setCallSign('');
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
            <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
                <h2 className="text-3xl font-bold text-blue-400 mb-6 text-center">Registreren</h2>
                <form onSubmit={handleRegister} className="space-y-5">
                    <div>
                        <label htmlFor="reg-email" className="block text-gray-300 text-sm font-medium mb-2">E-mailadres</label>
                        <input
                            type="email"
                            id="reg-email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="uw@email.com"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="reg-password" className="block text-gray-300 text-sm font-medium mb-2">Wachtwoord</label>
                        <input
                            type="password"
                            id="reg-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Wachtwoord"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="department" className="block text-gray-300 text-sm font-medium mb-2">Afdeling</label>
                        <select
                            id="department"
                            value={department}
                            onChange={(e) => {
                                setDepartment(e.target.value);
                                setRank(''); // Reset rank when department changes
                                setSpecialization(''); // Reset specialization when department changes
                                setCallSign(''); // Reset callSign when department changes
                            }}
                            className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        >
                            <option value="">Kies een afdeling</option>
                            {departmentsList.map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                    </div>
                    {department && department !== 'Burger' && (
                        <div>
                            <label htmlFor="rank" className="block text-gray-300 text-sm font-medium mb-2">Rang</label>
                            <select
                                id="rank"
                                value={rank}
                                onChange={(e) => {
                                    setRank(e.target.value);
                                    setSpecialization(''); // Reset specialization when rank changes
                                }}
                                className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                required
                            >
                                <option value="">Kies een rang</option>
                                {ranksByDepartment[department] && ranksByDepartment[department].map(r => (
                                    <option key={r} value={r}>{r}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    {department && rank && specializationsByRank[department] && specializationsByRank[department][rank] && (
                        <div>
                            <label htmlFor="specialization" className="block text-gray-300 text-sm font-medium mb-2">Specialisatie</label>
                            <select
                                id="specialization"
                                value={specialization}
                                onChange={(e) => setSpecialization(e.target.value)}
                                className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                required
                            >
                                <option value="">Kies een specialisatie</option>
                                {specializationsByRank[department][rank].map(spec => (
                                    <option key={spec} value={spec}>{spec}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    {department && department !== 'Burger' && department !== 'Meldkamer' && (
                        <div>
                            <label htmlFor="callSign" className="block text-gray-300 text-sm font-medium mb-2">Roepnummer</label>
                            <input
                                type="text"
                                id="callSign"
                                value={callSign}
                                onChange={(e) => setCallSign(e.target.value)}
                                className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="Bijv. AMB-01, POL-123"
                                required
                            />
                        </div>
                    )}

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    {message && <p className="text-green-500 text-sm text-center">{message}</p>}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white p-3 rounded-md font-semibold hover:bg-blue-700 transition duration-200 ease-in-out shadow-lg"
                    >
                        <UserPlusIcon className="inline-block mr-2" /> Registreren
                    </button>
                </form>
                <div className="mt-6 text-center">
                    <button
                        onClick={onNavigateToLogin}
                        className="text-blue-400 hover:underline text-sm"
                    >
                        Terug naar inloggen
                    </button>
                </div>
            </div>
            <Modal
                show={modal.show}
                title={modal.title}
                message={modal.message}
                type={modal.type}
                onClose={() => setModal({ ...modal, show: false })}
            />
        </div>
    );
};

export default Register;
