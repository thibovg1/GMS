import React, { useState, useEffect, createContext, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Lucide React Icons (assumed to be available in the environment)
const PhoneCallIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-phone-call"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/><path d="M14.05 2a10.29 10.29 0 0 1 8 7.94"/><path d="M18.99 6.85a14.29 14.29 0 0 0-14 14.05"/></svg>;
const BellRingIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucude-bell-ring"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/><path d="M2.2 12A10 10 0 0 1 18 2.2"/><path d="M21.8 12a10 10 0 0 0-18 0"/></svg>;
const PlusCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus-circle"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>;
const ListIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>;
const XCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x-circle"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>;
const MapPinIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin"><path d="M12 18.35A6.5 6.5 0 1 1 6.5 6.5a6.5 6.5 0 0 1 11 0c0 4.6-5.5 11.85-5.5 11.85z"/><circle cx="12" cy="10" r="3"/></svg>;
const InfoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-info"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>;
const MessageSquareIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-square"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
const CircleDotIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-dot"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="1"/></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const SirenIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-siren"><path d="M7 10a5 5 0 0 1 10 0"/><path d="M12 15V7"/><path d="M10 10H8"/><path d="M16 10h-2"/><path d="M22 10H2"/><path d="M12 19V7"/><path d="M12 7H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-7"/></svg>;
const LogInIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-in"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/></svg>;
const UserPlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-plus"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-2 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.78 1.28a2 2 0 0 0 .73 2.73l.04.02a2 2 0 0 1 .97 1.95v.44a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.78 1.28a2 2 0 0 0 .73 2.73l.04.02a2 2 0 0 1 .97 1.95v.44a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.78-1.28a2 2 0 0 0-.73-2.73l-.04-.02a2 2 0 0 1-.97-1.95V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>;
const LogOutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="17 17 22 12 17 7"/><line x1="22" x2="10" y1="12" y2="12"/></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-edit"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const UserCogIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-cog"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="10" r="3"/><path d="M17.2 14c-.06 0-.12.01-.18.02a4 4 0 0 0-3.3 0c-.06-.01-.12-.02-.18-.02"/><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.78 1.28a2 2 0 0 0 .73 2.73l.04.02a2 2 0 0 1 .97 1.95v.44a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.78 1.28a2 2 0 0 0 .73 2.73l.04.02a2 2 0 0 1 .97 1.95v.44a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.78-1.28a2 2 0 0 0-.73-2.73l-.04-.02a2 2 0 0 1-.97-1.95V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>;


// Context for app state
const AppContext = createContext(null);

// Data for departments, ranks, and specializations
const departmentsList = ['Politie', 'Kmar', 'Brandweer', 'Ambulance', 'Prorail', 'Meldkamer', 'Burger'];

const ranksByDepartment = {
    'Politie': ["Aspirant", "Surveillant", "Agent", "Hoofdagent", "Brigadier", "Inspecteur", "Hoofdinspecteur", "Commissaris", "Hoofdcommissaris", "Eerste hoofdcommissaris",],
    'Kmar': ["Marechaussee der 4e klasse", "Marechaussee der 3e klasse", "Marechaussee der 2e klasse", "Marechaussee der 1e klasse", "Wachtmeester", "Wachtmeester der 1e klasse", "Opperwachtmeester", "Adjudant-onderofficier", "Tweede luitenant", "Eerste luitenant", "Kapitein", "Majoor", "Luitenant-kolonel", "Kolonel", "Brigadegeneraal", "Generaal-majoor", "Luitenant-generaal",],
    'Brandweer': ["Aspirant", "Brandwacht", "Hoofdbrandwacht", "Brandmeester", "Hoofdbrandmeester", "Commandeur", "Adjunct-hoofdcommandeur", "Hoofdcommandeur",],
    'Ambulance': ["Ondersteunend personeel", "Ambulance in opleiding", "Ambulancechauffeur", "Ambulancebroeder", "Assistent-verpleegkundige", "Ambulanceverpleegkundige", "Ambulance­specialist", "Ambulancearts", "Ambulancechirurg", "Assistent-geneeskundige", "Geneeskundige", "Hoofd-geneeskundige", "Ambulanceleiding", "Hoofdtrainer", "Teamleider", "Ambulancebaas"],
    'Prorail': ["Treinverkeersleider", "Procesleider", "Projectmanager", "Technisch specialist", "Inspecteur spoorinfra", "Adviseur veiligheid", "Planner", "Assetmanager", "Regisseur spoorbeheer", "Data-analist", "Omgevingsmanager", "Communicatiemanager", "Directeur operatie", "Directeur projecten", "CEO ProRail"],
    'Meldkamer': ["Centralist intake", "Centralist uitgifte", "Multidisciplinair centralist", "Senior centralist", "Teamleider meldkamer", "Operationeel coördinator", "Calamiteitencoördinator (CaCo)", "Hoofd meldkamer", "Functioneel beheerder", "Technisch beheerder", "Piketfunctionaris LMS", "Procescoördinator", "Regiocoördinator meldkamer", "Trainer meldkamer", "Kwaliteitsadviseur meldkamer",],
    'Burger': ['Geen'] // Placeholder for consistency, but will be hidden
};


// Custom Modal Component (instead of alert/confirm)
const Modal = ({ show, title, message, onClose, onConfirm, type = 'info', children }) => {
    if (!show) return null;

    const bgColor = type === 'error' ? 'bg-red-800' : type === 'success' ? 'bg-green-800' : 'bg-blue-800';
    const textColor = 'text-white';
    const borderColor = type === 'error' ? 'border-red-600' : type === 'success' ? 'border-green-600' : 'border-blue-600';

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className={`bg-gray-800 rounded-lg shadow-xl border ${borderColor} w-full max-w-sm mx-auto p-6`}>
                <h3 className={`text-lg font-semibold mb-4 ${textColor}`}>{title}</h3>
                <p className="text-gray-200 mb-6">{message}</p>
                {children} {/* Render children inside the modal content */}
                <div className="flex justify-end space-x-3 mt-4">
                    {onConfirm && (
                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
                        >
                            Bevestigen
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
                    >
                        Sluiten
                    </button>
                </div>
            </div>
        </div>
    );
};

// Login Component
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

// Register Component
const Register = ({ onRegisterSuccess, onNavigateToLogin, appData, setAppData }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [department, setDepartment] = useState('');
    const [rank, setRank] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [callSign, setCallSign] = useState('');

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

        setMessage('Registratie succesvol! U bent nu ingelogd.');
        setEmail('');
        setPassword('');
        setDepartment('');
        setRank('');
        setSpecialization('');
        setCallSign('');
        // Directly log in the user after successful automatic approval
        onRegisterSuccess(newUser.id, newUser.role, newUser.status, newUser.department, newUser.specialization, newUser.rank, newUser.callSign);
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
        </div>
    );
};

// Main Application Component
export default function App() {
    const [currentPage, setCurrentPage] = useState('login');
    const [userId, setUserId] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [userStatus, setUserStatus] = useState(null);
    const [userDepartment, setUserDepartment] = useState(null);
    const [userRank, setUserRank] = useState(null);
    const [userSpecialization, setUserSpecialization] = useState(null);
    const [userCallSign, setUserCallSign] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false); // Set to true after initial data load

    // Function to load data from localStorage
    const loadDataFromLocalStorage = () => {
        try {
            const serializedData = localStorage.getItem('gmsSystemData');
            if (serializedData === null) {
                // Initial data if localStorage is empty
                return {
                    users: [
                        { id: 'superadmin-uid-123', email: 'superadmin@regio18.nl', role: 'superadmin', status: 'approved', password: 'adminpassword', department: 'Meldkamer', specialization: 'Algemeen', rank: 'Hoofdcentralist', callSign: 'MK-ADMIN' },
                    ],
                    units: [],
                    calls: [],
                    incidents: []
                };
            }
            return JSON.parse(serializedData);
        } catch (error) {
            console.error("Error loading data from localStorage:", error);
            // Fallback to initial data on error
            return {
                users: [
                    { id: 'superadmin-uid-123', email: 'superadmin@regio18.nl', role: 'superadmin', status: 'approved', password: 'adminpassword', department: 'Meldkamer', specialization: 'Algemeen', rank: 'Hoofdcentralist', callSign: 'MK-ADMIN' },
                ],
                units: [],
                calls: [],
                incidents: []
            };
        }
    };

    // State for all application data, initialized from localStorage
    const [appData, setAppData] = useState(loadDataFromLocalStorage);

    // Effect to save data to localStorage whenever appData changes
    useEffect(() => {
        try {
            const serializedData = JSON.stringify(appData);
            localStorage.setItem('gmsSystemData', serializedData);
        } catch (error) {
            console.error("Error saving data to localStorage:", error);
        }
    }, [appData]);

    // Simulate initial authentication check
    useEffect(() => {
        // For localStorage, we don't have a real auth state change listener.
        // We assume the app is "ready" once initial data is loaded.
        setIsAuthReady(true);
        // If a user was previously logged in (e.g., via a simple flag in localStorage or a default user),
        // you would set their state here. For now, we start at login.
    }, []);


    const handleLoginSuccess = (id, role, status, department, specialization, rank, callSign) => {
        setUserId(id);
        setUserRole(role);
        setUserStatus(status);
        setUserDepartment(department);
        setUserRank(rank);
        setUserSpecialization(specialization);
        setUserCallSign(callSign);
        setCurrentPage('home');
    };

    const handleLogout = () => {
        setUserId(null);
        setUserRole(null);
        setUserStatus(null);
        setUserDepartment(null);
        setUserRank(null);
        setUserSpecialization(null);
        setUserCallSign(null);
        setCurrentPage('login');
    };

    if (!isAuthReady) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900">
                <div className="text-lg font-semibold text-gray-200">Laden van applicatie...</div>
            </div>
        );
    }

    // Pass appData and setAppData down to components
    const contextValue = { userId, userRole, userStatus, userDepartment, userRank, userSpecialization, userCallSign, appData, setAppData };

    const renderPage = () => {
        if (currentPage === 'login') {
            return <Login onLoginSuccess={handleLoginSuccess} onNavigateToRegister={() => setCurrentPage('register')} appData={appData} />;
        } else if (currentPage === 'register') {
            return <Register onRegisterSuccess={handleLoginSuccess} onNavigateToLogin={() => setCurrentPage('login')} appData={appData} setAppData={setAppData} />;
        } else if (userStatus === 'approved') {
            switch (currentPage) {
                case 'citizen':
                    return <CitizenPage appData={appData} setAppData={setAppData} />;
                case 'emergency':
                    return <EmergencyServicePage appData={appData} setAppData={setAppData} />;
                case 'controlroom':
                    if (userRole === 'admin' || userRole === 'superadmin') {
                        return <ControlRoomPage appData={appData} setAppData={setAppData} />;
                    } else {
                        return (
                            <div className="flex items-center justify-center min-h-screen bg-gray-900 text-red-400 text-xl text-center p-4">
                                Geen toegang. Deze pagina is alleen voor meldkamerpersoneel.
                                <button onClick={handleLogout} className="ml-4 px-4 py-2 bg-gray-600 text-white rounded-md">Uitloggen</button>
                            </div>
                        );
                    }
                case 'admin':
                    if (userRole === 'admin' || userRole === 'superadmin' || userRole === 'mod') {
                        return <AdminPage appData={appData} setAppData={setAppData} />;
                    } else {
                        return (
                            <div className="flex items-center justify-center min-h-screen bg-gray-900 text-red-400 text-xl text-center p-4">
                                Geen toegang. Deze pagina is alleen voor beheerders.
                                <button onClick={handleLogout} className="ml-4 px-4 py-2 bg-gray-600 text-white rounded-md">Uitloggen</button>
                            </div>
                        );
                    }
                default:
                    return (
                        <HomePage onNavigate={setCurrentPage} />
                    );
            }
        } else {
            return (
                <div className="flex items-center justify-center min-h-screen bg-gray-900 text-yellow-400 text-xl text-center p-4">
                    Uw account is nog niet goedgekeurd. Wacht op goedkeuring door een beheerder.
                    <button onClick={handleLogout} className="ml-4 px-4 py-2 bg-gray-600 text-white rounded-md">Uitloggen</button>
                </div>
            );
        }
    };

    return (
        <AppContext.Provider value={contextValue}>
            <div className="min-h-screen bg-gray-900 font-sans text-gray-100">
                {currentPage !== 'login' && currentPage !== 'register' && (
                    <header className="bg-gray-800 shadow-lg p-4 flex flex-col sm:flex-row justify-between items-center rounded-b-xl border-b border-gray-700">
                        <h1 className="text-3xl font-extrabold text-blue-400 mb-3 sm:mb-0">Geïntegreerd Meldkamer Systeem</h1>
                        <nav className="flex flex-wrap justify-center gap-3 sm:gap-4">
                            <button
                                onClick={() => setCurrentPage('home')}
                                className="px-5 py-2 rounded-full text-blue-300 bg-gray-700 hover:bg-gray-600 transition duration-150 ease-in-out font-medium shadow-sm"
                            >
                                Home
                            </button>
                            <button
                                onClick={() => setCurrentPage('citizen')}
                                className="px-5 py-2 rounded-full text-blue-300 bg-gray-700 hover:bg-gray-600 transition duration-150 ease-in-out font-medium shadow-sm"
                            >
                                Burger
                            </button>
                            <button
                                onClick={() => setCurrentPage('emergency')}
                                className="px-5 py-2 rounded-full text-blue-300 bg-gray-700 hover:bg-gray-600 transition duration-150 ease-in-out font-medium shadow-sm"
                            >
                                Hulpdienst
                            </button>
                            <button
                                onClick={() => setCurrentPage('controlroom')}
                                className="px-5 py-2 rounded-full text-blue-300 bg-gray-700 hover:bg-gray-600 transition duration-150 ease-in-out font-medium shadow-sm"
                            >
                                Meldkamer
                            </button>
                            {(userRole === 'admin' || userRole === 'superadmin' || userRole === 'mod') && (
                                <button
                                    onClick={() => setCurrentPage('admin')}
                                    className="px-5 py-2 rounded-full text-purple-300 bg-gray-700 hover:bg-gray-600 transition duration-150 ease-in-out font-medium shadow-sm"
                                >
                                    <UserCogIcon className="inline-block mr-2" /> Admin
                                </button>
                            )}
                            <button
                                onClick={handleLogout}
                                className="px-5 py-2 rounded-full text-red-300 bg-gray-700 hover:bg-gray-600 transition duration-150 ease-in-out font-medium shadow-sm"
                            >
                                <LogOutIcon className="inline-block mr-2" /> Uitloggen
                            </button>
                        </nav>
                    </header>
                )}
                <main className="p-6">
                    {renderPage()}
                </main>
            </div>
        </AppContext.Provider>
    );
}

// Home Page Component
const HomePage = ({ onNavigate }) => (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-800 rounded-2xl shadow-2xl max-w-4xl mx-auto mt-12 border border-gray-700">
        <h2 className="text-4xl font-extrabold text-blue-400 mb-8 text-center leading-tight">Welkom bij het GMS Systeem</h2>
        <p className="text-xl text-gray-300 text-center mb-10 max-w-2xl">
            Dit is een geavanceerd geïntegreerd meldkamer systeem voor surveillance servers, ontworpen om naadloze communicatie tussen burgers, hulpdiensten en de meldkamer te faciliteren.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            <button
                onClick={() => onNavigate('citizen')}
                className="flex flex-col items-center p-8 bg-green-700 text-white rounded-xl shadow-lg hover:bg-green-800 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 border-b-4 border-green-900"
            >
                <PhoneCallIcon className="w-14 h-14 mb-4" />
                <span className="text-2xl font-bold">Burger Portaal</span>
                <span className="text-base mt-2 opacity-90">Meld een incident of noodsituatie</span>
            </button>
            <button
                onClick={() => onNavigate('emergency')}
                className="flex flex-col items-center p-8 bg-blue-700 text-white rounded-xl shadow-lg hover:bg-blue-800 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 border-b-4 border-blue-900"
            >
                <UsersIcon className="w-14 h-14 mb-4" />
                <span className="text-2xl font-bold">Hulpdienst Portaal</span>
                <span className="text-base mt-2 opacity-90">Beheer uw status en toegewezen incidenten</span>
            </button>
            <button
                onClick={() => onNavigate('controlroom')}
                className="flex flex-col items-center p-8 bg-orange-700 text-white rounded-xl shadow-lg hover:bg-orange-800 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 border-b-4 border-orange-900"
            >
                <BellRingIcon className="w-14 h-14 mb-4" />
                <span className="text-2xl font-bold">Meldkamer Portaal</span>
                <span className="text-base mt-2 opacity-90">Centraal overzicht en beheer van alle operaties</span>
            </button>
        </div>
    </div>
);

// Citizen Page Component
const CitizenPage = ({ appData, setAppData }) => {
    const { userId } = useContext(AppContext);
    const [modal, setModal] = useState({ show: false, title: '', message: '', type: 'info' });
    const [citizenIncidents, setCitizenIncidents] = useState([]);

    useEffect(() => {
        // Filter incidents created by the current user
        const filteredIncidents = appData.incidents.filter(inc => inc.createdBy === userId);
        setCitizenIncidents(filteredIncidents.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    }, [appData.incidents, userId]);


    const handleCall = (type) => {
        if (!userId) {
            setModal({ show: true, title: 'Fout', message: 'Gebruikers-ID niet beschikbaar. Probeer opnieuw.', type: 'error', onClose: () => setModal({ ...modal, show: false }) });
            return;
        }
        const newCall = {
            id: uuidv4(),
            type: type,
            timestamp: new Date().toISOString(),
            status: 'nieuw',
            callerId: userId,
            description: `Noodoproep type ${type} van burger ${userId.substring(0, 8)}`,
            priority: type === '112' ? 'Zeer Hoog' : 'Normaal'
        };

        setAppData(prevData => ({
            ...prevData,
            calls: [...prevData.calls, newCall]
        }));
        setModal({ show: true, title: 'Oproep Verzonden', message: `Uw ${type}-oproep is succesvol verzonden naar de meldkamer. Wacht op contact.`, type: 'success', onClose: () => setModal({ ...modal, show: false }) });
    };

    return (
        <div className="p-8 bg-gray-800 rounded-2xl shadow-2xl max-w-4xl mx-auto mt-12 border border-green-700">
            <h2 className="text-4xl font-bold text-green-400 mb-8 text-center">Burger Portaal</h2>
            <p className="text-lg text-gray-300 text-center mb-10">
                In geval van een noodsituatie, bel direct 112. Voor niet-spoedeisende zaken kunt u 0900 bellen.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                {/* Notepad / Notification Display for Citizen */}
                <div className="bg-gray-900 text-gray-100 rounded-xl shadow-inner border border-gray-700 font-mono text-sm overflow-auto h-[300px] flex flex-col">
                    <div className="bg-gray-800 p-4 rounded-t-xl border-b border-gray-700">
                        <h3 className="text-xl font-bold text-green-400">Uw Meldingen / Updates</h3>
                    </div>
                    <div className="p-4 flex-grow whitespace-pre-wrap text-base leading-relaxed">
                        {citizenIncidents.length > 0 ? (
                            citizenIncidents.map(incident => (
                                <div key={incident.id} className="mb-4 p-3 bg-gray-700 rounded-md border border-gray-600">
                                    <p className="font-bold text-gray-100 flex items-center"><InfoIcon className="w-4 h-4 mr-2" /> ID: {incident.id.substring(0, 8)}</p>
                                    <p className="text-sm text-gray-200 flex items-center"><ListIcon className="w-4 h-4 mr-2" /> Onderwerp: {incident.description}</p>
                                    <p className="text-sm text-gray-200 flex items-center"><MapPinIcon className="w-4 h-4 mr-2" /> Locatie: {incident.location}</p>
                                    <p className="text-xs text-gray-400 mt-1">Status: {incident.status.replace('_', ' ').toUpperCase()}</p>
                                    <p className="text-xs text-gray-400">Tijd: {new Date(incident.createdAt).toLocaleString()}</p>
                                </div>
                            ))
                        ) : (
                            'Hier verschijnen updates over uw meldingen of algemene informatie van de meldkamer. Momenteel geen updates.'
                        )}
                    </div>
                </div>

                {/* Call Buttons */}
                <div className="flex flex-col space-y-6 justify-center items-center">
                    <button
                        onClick={() => handleCall('112')}
                        className="flex flex-col items-center justify-center w-48 h-48 bg-red-700 text-white rounded-full shadow-xl hover:bg-red-800 transition duration-300 ease-in-out transform hover:scale-105 text-3xl font-extrabold border-4 border-red-900"
                    >
                        <PhoneCallIcon className="w-14 h-14 mb-3" />
                        112
                    </button>
                    <button
                        onClick={() => handleCall('0900')}
                        className="flex flex-col items-center justify-center w-48 h-48 bg-orange-600 text-white rounded-full shadow-xl hover:bg-orange-700 transition duration-300 ease-in-out transform hover:scale-105 text-3xl font-extrabold border-4 border-orange-800"
                    >
                        <PhoneCallIcon className="w-14 h-14 mb-3" />
                        0900
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

// Emergency Service Page Component
const EmergencyServicePage = ({ appData, setAppData }) => {
    const { userId } = useContext(AppContext);
    const [currentUnitData, setCurrentUnitData] = useState(null);
    const [unitStatus, setUnitStatus] = useState('Niet Beschikbaar');
    const [currentIncidentDisplay, setCurrentIncidentDisplay] = useState(null);
    const [eindrapportText, setEindrapportText] = useState('');
    const [showEindrapportModal, setShowEindrapportModal] = useState(false);
    const [modal, setModal] = useState({ show: false, title: '', message: '', type: 'info', onConfirm: null, children: null });

    const [tempDepartment, setTempDepartment] = useState('');
    const [tempRank, setTempRank] = useState('');
    const [tempSpecialization, setTempSpecialization] = useState('');
    const [tempCallSign, setTempCallSign] = useState('');
    const [showJoinForm, setShowJoinForm] = useState(true);

    const departmentsForSelection = ['Politie', 'Kmar', 'Brandweer', 'Ambulance', 'Prorail'];

    const buttonConfig = [
        { label: '1 Vrij', status: 'Beschikbaar', color: 'bg-slate-800', hover: 'hover:bg-slate-700', border: 'border-slate-900' },
        { label: '2 Aanrijdend', status: 'Onderweg', color: 'bg-slate-800', hover: 'hover:bg-slate-700', border: 'border-slate-900' },
        { label: '3 Ter Plaatse', status: 'Ter Plaatse', color: 'bg-slate-800', hover: 'hover:bg-slate-700', border: 'border-slate-900' },
        { label: '4 Bezet', status: 'Bezet', color: 'bg-slate-800', hover: 'hover:bg-slate-700', border: 'border-slate-900' },
        { label: '5 Uitmelden', action: 'uitmelden', color: 'bg-slate-800', hover: 'hover:bg-slate-700', border: 'border-slate-900' },
        { label: '6 Spraak', action: 'spraak', color: 'bg-slate-800', hover: 'hover:bg-slate-700', border: 'border-slate-900' },
        { label: '7 Urgent', action: 'urgent', color: 'bg-slate-800', hover: 'hover:bg-slate-700', border: 'border-slate-900' },
        { label: '8 Melding', action: 'melding', color: 'bg-slate-800', hover: 'hover:bg-slate-700', border: 'border-slate-900' },
        { label: '9 Informatie', action: 'informatie', color: 'bg-slate-800', hover: 'hover:bg-slate-700', border: 'border-slate-900' },
        { label: '* Eindrapport', action: 'eindrapport', color: 'bg-slate-800', hover: 'hover:bg-slate-700', border: 'border-slate-900' },
        { label: '0 Noodknop', action: 'noodknop', color: 'bg-red-700', hover: 'hover:bg-red-800', border: 'border-red-900' },
        { label: 'Discord', action: 'discord', color: 'bg-indigo-600', hover: 'hover:bg-indigo-700', border: 'border-indigo-800' },
    ];

    useEffect(() => {
        const foundUnit = appData.units.find(u => u.id === userId);
        if (foundUnit) {
            setCurrentUnitData(foundUnit);
            setUnitStatus(foundUnit.status);
            setShowJoinForm(false);
        } else {
            // If unit not found, check if the user is registered as an emergency service
            const registeredUser = appData.users.find(u => u.id === userId && departmentsForSelection.includes(u.department));
            if (registeredUser) {
                // User is registered as emergency service, but unit doc is missing. Create it.
                const newUnitData = {
                    id: userId,
                    name: registeredUser.callSign || `Unit-${userId.substring(0, 8)}`,
                    status: 'Niet Beschikbaar',
                    department: registeredUser.department,
                    rank: registeredUser.rank,
                    specialization: registeredUser.specialization,
                    lastUpdated: new Date().toISOString(),
                };
                setAppData(prevData => ({
                    ...prevData,
                    units: [...prevData.units, newUnitData]
                }));
                setCurrentUnitData(newUnitData);
                setUnitStatus(newUnitData.status);
                setShowJoinForm(false);
            } else {
                setShowJoinForm(true); // Not an emergency service, show join form
            }
        }

        // Filter assigned incidents for the current user
        const assigned = appData.incidents.filter(inc =>
            inc.assignedUnits && inc.assignedUnits.includes(userId) &&
            inc.status !== 'closed' && inc.status !== 'resolved'
        );
        assigned.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setCurrentIncidentDisplay(assigned.length > 0 ? assigned[0] : null);

    }, [appData.units, appData.incidents, appData.users, userId]);


    const handleJoinAsEmergencyService = (e) => {
        e.preventDefault();
        if (!userId) {
            setModal({ show: true, title: 'Fout', message: 'Gebruikers-ID niet beschikbaar. Probeer opnieuw.', type: 'error', onClose: () => setModal({ ...modal, show: false }) });
            return;
        }

        if (!tempDepartment || !tempRank || !tempSpecialization || !tempCallSign.trim()) {
            setModal({ show: true, title: 'Waarschuwing', message: 'Vul alle velden in om u aan te melden als hulpdienst.', type: 'info', onClose: () => setModal({ ...modal, show: false }) });
            return;
        }

        // Check if callSign already exists for another active unit (simple check)
        if (appData.units.some(u => u.name === tempCallSign.trim() && u.id !== userId && u.status !== 'Niet Beschikbaar')) {
             setModal({ show: true, title: 'Fout', message: 'Dit roepnummer is al in gebruik door een andere actieve eenheid.', type: 'error', onClose: () => setModal({ ...modal, show: false }) });
             return;
        }

        const newUnitData = {
            id: userId,
            name: tempCallSign.trim(),
            status: 'Niet Beschikbaar', // Start with not available
            department: tempDepartment,
            rank: tempRank,
            specialization: tempSpecialization,
            lastUpdated: new Date().toISOString(),
        };

        setAppData(prevData => {
            const unitIndex = prevData.units.findIndex(u => u.id === userId);
            let updatedUnits;
            if (unitIndex !== -1) {
                // Update existing unit
                updatedUnits = prevData.units.map(unit => unit.id === userId ? newUnitData : unit);
            } else {
                // Add new unit
                updatedUnits = [...prevData.units, newUnitData];
            }

            // Also update the user's profile with this information
            const updatedUsers = prevData.users.map(user =>
                user.id === userId
                    ? { ...user, department: tempDepartment, rank: tempRank, specialization: tempSpecialization, callSign: tempCallSign.trim() }
                    : user
            );

            return {
                ...prevData,
                units: updatedUnits,
                users: updatedUsers,
            };
        });

        setCurrentUnitData(newUnitData);
        setUnitStatus('Niet Beschikbaar');
        setShowJoinForm(false);
        setModal({ show: true, title: 'Aanmelding Succesvol', message: `U bent aangemeld als ${tempCallSign} (${tempSpecialization}). U kunt nu uw status wijzigen.`, type: 'success', onClose: () => setModal({ ...modal, show: false }) });
    };

    const handleStatusChange = (newStatus) => {
        if (!userId || !currentUnitData) {
            setModal({ show: true, title: 'Fout', message: 'Geen actieve eenheid gevonden. Meld u eerst aan.', type: 'error', onClose: () => setModal({ ...modal, show: false }) });
            return;
        }
        setAppData(prevData => {
            const updatedUnits = prevData.units.map(unit =>
                unit.id === userId
                    ? { ...unit, status: newStatus, lastUpdated: new Date().toISOString() }
                    : unit
            );
            return { ...prevData, units: updatedUnits };
        });
        setUnitStatus(newStatus);
        setModal({ show: true, title: 'Status Bijgewerkt', message: `Uw status is nu: ${newStatus}`, type: 'success', onClose: () => setModal({ ...modal, show: false }) });
    };

    const handleSendEindrapport = () => {
        if (!eindrapportText.trim()) {
            setModal({ show: true, title: 'Waarschuwing', message: 'Voer een eindrapport in.', type: 'info', onClose: () => setModal({ ...modal, show: false }) });
            return;
        }
        if (!userId || !currentUnitData) {
            setModal({ show: true, title: 'Fout', message: 'Gebruikers-ID niet beschikbaar of geen actieve eenheid.', type: 'error', onClose: () => setModal({ ...modal, show: false }) });
            return;
        }
        const unitDetails = `${currentUnitData.name} (${currentUnitData.rank} - ${currentUnitData.specialization})`;
        const newCall = {
            id: uuidv4(),
            type: 'FINAL_REPORT_SUBMITTED',
            timestamp: new Date().toISOString(),
            status: 'nieuw',
            callerId: userId,
            description: `Eindrapport ingediend door eenheid ${unitDetails}`,
            fullDescription: eindrapportText,
            priority: 'Laag'
        };
        setAppData(prevData => ({
            ...prevData,
            calls: [...prevData.calls, newCall]
        }));
        setEindrapportText('');
        setShowEindrapportModal(false);
        setModal({ show: true, title: 'Eindrapport Verzonden', message: 'Uw eindrapport is succesvol verzonden naar de meldkamer.', type: 'success', onClose: () => setModal({ ...modal, show: false }) });
    };


    const handleNoodknop = () => {
        if (!userId || !currentUnitData) {
            setModal({ show: true, title: 'Fout', message: 'Gebruikers-ID niet beschikbaar of geen actieve eenheid.', type: 'error', onClose: () => setModal({ ...modal, show: false }) });
            return;
        }
        const newCall = {
            id: uuidv4(),
            type: 'NOODKNOP (112)',
            timestamp: new Date().toISOString(),
            status: 'nieuw',
            callerId: userId,
            description: `NOODKNOP geactiveerd door eenheid ${currentUnitData.name}`,
            priority: 'Zeer Hoog'
        };
        setAppData(prevData => ({
            ...prevData,
            calls: [...prevData.calls, newCall]
        }));
        setModal({ show: true, title: 'Noodoproep Verzonden', message: 'Noodknop geactiveerd. Meldkamer is gewaarschuwd.', type: 'error', onClose: () => setModal({ ...modal, show: false }) });
    };


    const handleActionButton = (action) => {
        if (!userId || !currentUnitData) {
            setModal({ show: true, title: 'Fout', message: 'Geen actieve eenheid gevonden. Meld u eerst aan.', type: 'error', onClose: () => setModal({ ...modal, show: false }) });
            return;
        }

        const unitDetails = `${currentUnitData.name} (${currentUnitData.rank} - ${currentUnitData.specialization})`;
        let newCall = null;

        switch (action) {
            case 'uitmelden':
                handleStatusChange('Niet Beschikbaar');
                break;
            case 'spraak':
                newCall = {
                    id: uuidv4(),
                    type: 'VOICE_REQUEST',
                    timestamp: new Date().toISOString(),
                    status: 'nieuw',
                    callerId: userId,
                    description: `SPRAAKVERZOEK van eenheid ${unitDetails}`,
                    priority: 'Normaal'
                };
                setModal({ show: true, title: 'Spraakverzoek Verzonden', message: 'Uw spraakverzoek is verzonden naar de meldkamer.', type: 'success', onClose: () => setModal({ ...modal, show: false }) });
                break;
            case 'noodknop':
                handleNoodknop();
                break;
            case 'urgent':
                newCall = {
                    id: uuidv4(),
                    type: 'URGENT_REQUEST',
                    timestamp: new Date().toISOString(),
                    status: 'nieuw',
                    callerId: userId,
                    description: `URGENT VERZOEK van eenheid ${unitDetails}`,
                    priority: 'Zeer Hoog'
                };
                setModal({ show: true, title: 'Urgent Verzoek Verzonden', message: `Uw urgent verzoek is verzonden naar de meldkamer.`, type: 'error', onClose: () => setModal({ ...modal, show: false }) });
                break;
            case 'melding':
                newCall = {
                    id: uuidv4(),
                    type: 'NEW_REPORT',
                    timestamp: new Date().toISOString(),
                    status: 'nieuw',
                    callerId: userId,
                    description: `NIEUWE MELDING van eenheid ${unitDetails}`,
                    priority: 'Normaal'
                };
                setModal({ show: true, title: 'Melding Verzonden', message: `Uw melding is verzonden naar de meldkamer.`, type: 'success', onClose: () => setModal({ ...modal, show: false }) });
                break;
            case 'informatie':
                newCall = {
                    id: uuidv4(),
                    type: 'INFO_REQUEST',
                    timestamp: new Date().toISOString(),
                    status: 'nieuw',
                    callerId: userId,
                    description: `INFORMATIE AANVRAAG van eenheid ${unitDetails}`,
                    priority: 'Laag'
                };
                setModal({ show: true, title: 'Informatie Aanvraag Verzonden', message: `Uw informatieaanvraag is verzonden naar de meldkamer.`, type: 'success', onClose: () => setModal({ ...modal, show: false }) });
                break;
            case 'eindrapport':
                setShowEindrapportModal(true);
                break;
            case 'discord':
                setModal({
                    show: true,
                    title: 'Discord Functie',
                    message: 'Deze functie voor Discord-integratie komt binnenkort!',
                    type: 'info',
                    onClose: () => setModal({ ...modal, show: false })
                });
                break;
            default:
                break;
        }

        if (newCall) {
            setAppData(prevData => ({
                ...prevData,
                calls: [...prevData.calls, newCall]
            }));
        }
    };

    const roepnummerDisplay = currentUnitData ? `${currentUnitData.name} (${currentUnitData.rank} - ${currentUnitData.specialization})` : 'Niet Geregistreerd / Aanmelden Vereist';

    return (
        <div className="p-8 bg-gray-900 rounded-2xl shadow-2xl max-w-6xl mx-auto mt-12 border border-blue-700">
            <h2 className="text-4xl font-bold text-blue-400 mb-8 text-center">Hulpdienst Portaal</h2>
            <p className="text-lg text-gray-300 mb-6 text-center">Uw Roepnummer: <span className="font-mono bg-gray-800 p-2 rounded-md text-gray-100 font-semibold">{roepnummerDisplay}</span></p>

            {showJoinForm ? (
                <div className="bg-gray-800 p-8 rounded-xl shadow-inner border border-gray-700 mt-8">
                    <h3 className="text-2xl font-semibold text-blue-400 mb-6 text-center">Meld u aan als Hulpdienst</h3>
                    <form onSubmit={handleJoinAsEmergencyService} className="space-y-5">
                        <div>
                            <label htmlFor="tempDepartment" className="block text-gray-300 text-sm font-medium mb-2">Afdeling</label>
                            <select
                                id="tempDepartment"
                                value={tempDepartment}
                                onChange={(e) => {
                                    setTempDepartment(e.target.value);
                                    setTempRank('');
                                    setTempSpecialization('');
                                }}
                                className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                required
                            >
                                <option value="">Kies een afdeling</option>
                                {departmentsForSelection.map(dept => (
                                    <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </select>
                        </div>
                        {tempDepartment && (
                            <div>
                                <label htmlFor="tempRank" className="block text-gray-300 text-sm font-medium mb-2">Rang</label>
                                <select
                                    id="tempRank"
                                    value={tempRank}
                                    onChange={(e) => {
                                        setTempRank(e.target.value);
                                        setTempSpecialization('');
                                    }}
                                    className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    required
                                >
                                    <option value="">Kies een rang</option>
                                    {ranksByDepartment[tempDepartment] && ranksByDepartment[tempDepartment].map(r => (
                                        <option key={r} value={r}>{r}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                        {tempDepartment && tempRank && specializationsByRank[tempDepartment] && specializationsByRank[tempDepartment][tempRank] && (
                            <div>
                                <label htmlFor="tempSpecialization" className="block text-gray-300 text-sm font-medium mb-2">Specialisatie</label>
                                <select
                                    id="tempSpecialization"
                                    value={tempSpecialization}
                                    onChange={(e) => setTempSpecialization(e.target.value)}
                                    className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    required
                                >
                                    <option value="">Kies een specialisatie</option>
                                    {specializationsByRank[tempDepartment][tempRank].map(spec => (
                                        <option key={spec} value={spec}>{spec}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                        {tempDepartment && tempRank && tempSpecialization && (
                            <div>
                                <label htmlFor="tempCallSign" className="block text-gray-300 text-sm font-medium mb-2">Roepnummer</label>
                                <input
                                    type="text"
                                    id="tempCallSign"
                                    value={tempCallSign}
                                    onChange={(e) => setTempCallSign(e.target.value)}
                                    className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    placeholder="Bijv. AMB-01, POL-123"
                                    required
                                />
                            </div>
                        )}
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white p-3 rounded-md font-semibold hover:bg-blue-700 transition duration-200 ease-in-out shadow-lg"
                        >
                            Aanmelden als Hulpdienst
                        </button>
                    </form>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                    {/* Notepad / Notification Display */}
                    <div className="bg-gray-900 text-gray-100 rounded-xl shadow-inner border border-gray-700 font-mono text-sm overflow-auto h-[400px] flex flex-col">
                        <div className="bg-gray-800 p-4 rounded-t-xl border-b border-gray-700">
                            <h3 className="text-xl font-bold text-blue-400">
                                {currentIncidentDisplay ? `MELDING ONDERWERP: ${currentIncidentDisplay.description}` : 'KLADBLOK (LEEG)'}
                            </h3>
                        </div>
                        <div className="p-4 flex-grow whitespace-pre-wrap text-base leading-relaxed">
                            {currentIncidentDisplay ?
                                currentIncidentDisplay.fullDescription || currentIncidentDisplay.description :
                                'Hier verschijnt de tekst van de melding die door de meldkamer is aangemaakt. Zodra u een incident toegewezen krijgt, ziet u hier de details.'
                            }
                        </div>
                    </div>

                    {/* Status Buttons Grid */}
                    <div className="p-6 bg-gray-800 rounded-xl shadow-inner border border-gray-700">
                        <h3 className="text-2xl font-semibold text-blue-400 mb-5 text-center">Operationele Functies</h3>
                        <div className="grid grid-cols-3 gap-4">
                            {buttonConfig.map((button, index) => (
                                <button
                                    key={index}
                                    onClick={() => button.status ? handleStatusChange(button.status) : handleActionButton(button.action)}
                                    className={`flex flex-col items-center justify-center p-4 h-28 rounded-lg shadow-md text-white font-bold text-lg transition duration-200 ease-in-out transform hover:-translate-y-0.5
                                        ${button.color} ${button.hover} border-b-4 ${button.border}
                                        ${button.status && unitStatus === button.status ? 'ring-4 ring-offset-2 ring-blue-400' : ''}
                                    `}
                                >
                                    {button.label.split(' ')[0]}
                                    <span className="text-sm font-normal mt-1">{button.label.split(' ').slice(1).join(' ')}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <Modal
                show={showEindrapportModal}
                title="Eindrapport Verzenden"
                message="Voer uw eindrapport in voor de meldkamer:"
                onClose={() => { setShowEindrapportModal(false); setEindrapportText(''); }}
                onConfirm={handleSendEindrapport}
                type="info"
            >
                <textarea
                    value={eindrapportText}
                    onChange={(e) => setEindrapportText(e.target.value)}
                    placeholder="Uw eindrapport..."
                    className="w-full p-3 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-base resize-y min-h-[80px] bg-gray-700 text-gray-100"
                    rows="5"
                ></textarea>
            </Modal>

            <Modal
                show={modal.show}
                title={modal.title}
                message={modal.message}
                type={modal.type}
                onClose={() => setModal({ ...modal, show: false })}
                onConfirm={modal.onConfirm}
            >
                {modal.children}
            </Modal>
        </div>
    );
};

// Control Room Page Component
const ControlRoomPage = ({ appData, setAppData }) => {
    const { userId } = useContext(AppContext);
    const [calls, setCalls] = useState([]);
    const [units, setUnits] = useState([]);
    const [incidents, setIncidents] = useState([]);
    const [newIncident, setNewIncident] = useState({ description: '', location: '', priority: 'Normaal', assignedUnits: [], fullDescription: '' });
    const [modal, setModal] = useState({ show: false, title: '', message: '', type: 'info' });

    const [editingIncident, setEditingIncident] = useState(null);
    const [showEditIncidentModal, setShowEditIncidentModal] = useState(false);

    // Simulate onSnapshot behavior by updating state when appData changes
    useEffect(() => {
        setCalls([...appData.calls].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
    }, [appData.calls]);

    useEffect(() => {
        setUnits([...appData.units].sort((a, b) => (a.name || '').localeCompare(b.name || '')));
    }, [appData.units]);

    useEffect(() => {
        setIncidents([...appData.incidents].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    }, [appData.incidents]);


    const handleCallAction = (callId, action) => {
        setAppData(prevData => {
            const callIndex = prevData.calls.findIndex(c => c.id === callId);
            if (callIndex !== -1) {
                if (action === 'acknowledge') {
                    const updatedCalls = prevData.calls.map(call =>
                        call.id === callId ? { ...call, status: 'bevestigd' } : call
                    );
                    setModal({ show: true, title: 'Oproep Bevestigd', message: `Oproep ${callId.substring(0, 8)} is bevestigd.`, type: 'success', onClose: () => setModal({ ...modal, show: false }) });
                    return { ...prevData, calls: updatedCalls };
                } else if (action === 'close') {
                    const updatedCalls = prevData.calls.filter(call => call.id !== callId);
                    setModal({ show: true, title: 'Oproep Gesloten', message: `Oproep ${callId.substring(0, 8)} is gesloten.`, type: 'success', onClose: () => setModal({ ...modal, show: false }) });
                    return { ...prevData, calls: updatedCalls };
                }
            }
            return prevData;
        });
    };

    const handleCreateIncident = (e) => {
        e.preventDefault();
        if (!newIncident.description || !newIncident.location) {
            setModal({ show: true, title: 'Waarschuwing', message: 'Beschrijving en locatie zijn verplicht.', type: 'info', onClose: () => setModal({ ...modal, show: false }) });
            return;
        }
        if (!userId) {
            setModal({ show: true, title: 'Fout', message: 'Gebruikers-ID niet beschikbaar.', type: 'error', onClose: () => setModal({ ...modal, show: false }) });
            return;
        }
        const incidentId = uuidv4();
        const createdIncident = {
            id: incidentId,
            ...newIncident,
            createdAt: new Date().toISOString(),
            createdBy: userId,
            status: 'nieuw',
        };
        setAppData(prevData => ({
            ...prevData,
            incidents: [...prevData.incidents, createdIncident]
        }));
        setNewIncident({ description: '', location: '', priority: 'Normaal', assignedUnits: [], fullDescription: '' });
        setModal({ show: true, title: 'Incident Aangemaakt', message: 'Nieuw incident succesvol aangemaakt.', type: 'success', onClose: () => setModal({ ...modal, show: false }) });
    };

    const handleIncidentStatusUpdate = (incidentId, newStatus) => {
        setAppData(prevData => {
            const updatedIncidents = prevData.incidents.map(incident =>
                incident.id === incidentId ? { ...incident, status: newStatus } : incident
            );
            setModal({ show: true, title: 'Incident Status', message: `Status van incident ${incidentId.substring(0, 8)} bijgewerkt naar ${newStatus}.`, type: 'success', onClose: () => setModal({ ...modal, show: false }) });
            return { ...prevData, incidents: updatedIncidents };
        });
    };

    const handleKickUnit = (unitIdToKick) => {
        setAppData(prevData => {
            const updatedUnits = prevData.units.map(unit =>
                unit.id === unitIdToKick ? { ...unit, status: 'Niet Beschikbaar' } : unit
            );

            // Remove unit from all assigned incidents
            const updatedIncidents = prevData.incidents.map(incident => {
                if (incident.assignedUnits && incident.assignedUnits.includes(unitIdToKick)) {
                    return {
                        ...incident,
                        assignedUnits: incident.assignedUnits.filter(id => id !== unitIdToKick)
                    };
                }
                return incident;
            });

            const unitName = prevData.units.find(u => u.id === unitIdToKick)?.name || unitIdToKick.substring(0, 8);
            setModal({ show: true, title: 'Eenheid Gekickt', message: `Eenheid ${unitName} is uit het systeem gekickt.`, type: 'success', onClose: () => setModal({ ...modal, show: false }) });

            return { ...prevData, units: updatedUnits, incidents: updatedIncidents };
        });
    };

    const handleEditIncident = (incidentToEdit) => {
        setEditingIncident({ ...incidentToEdit });
        setShowEditIncidentModal(true);
    };

    const handleUpdateIncident = () => {
        if (!editingIncident.description || !editingIncident.location) {
            setModal({ show: true, title: 'Waarschuwing', message: 'Beschrijving en locatie zijn verplicht.', type: 'info', onClose: () => setModal({ ...modal, show: false }) });
            return;
        }

        setAppData(prevData => {
            const updatedIncidents = prevData.incidents.map(incident =>
                incident.id === editingIncident.id ? { ...editingIncident } : incident
            );
            setShowEditIncidentModal(false);
            setEditingIncident(null);
            setModal({ show: true, title: 'Incident Bijgewerkt', message: `Incident ${editingIncident.id.substring(0, 8)} is succesvol bijgewerkt.`, type: 'success', onClose: () => setModal({ ...modal, show: false }) });
            return { ...prevData, incidents: updatedIncidents };
        });
    };


    return (
        <div className="p-8 bg-gray-900 rounded-2xl shadow-2xl max-w-7xl mx-auto mt-12 border border-orange-700">
            <h2 className="text-4xl font-bold text-orange-400 mb-8 text-center">Meldkamer Portaal</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
                {/* Incoming Calls */}
                <div className="bg-gray-800 p-6 rounded-xl shadow-inner border border-gray-700">
                    <h3 className="text-2xl font-semibold text-red-400 mb-5 flex items-center"><BellRingIcon className="w-7 h-7 mr-3 text-red-400" /> Inkomende Oproepen</h3>
                    {calls.length === 0 ? (
                        <p className="text-gray-400 italic">Geen nieuwe oproepen.</p>
                    ) : (
                        <div className="space-y-4">
                            {calls.map(call => (
                                <div key={call.id} className="bg-gray-700 p-4 rounded-lg shadow-md border border-gray-600">
                                    <p className="text-lg font-bold text-gray-100">Type: <span className={`font-extrabold ${call.type === '112' || call.type.includes('NOODKNOP') ? 'text-red-500' : 'text-orange-400'}`}>{call.type}</span></p>
                                    <p className="text-sm text-gray-200 mt-1">Van: <span className="font-medium">{call.callerId.substring(0, 8)}</span></p>
                                    {call.description && <p className="text-sm text-gray-200 mt-1">Onderwerp: <span className="font-medium">{call.description}</span></p>}
                                    {call.fullDescription && <p className="text-sm text-gray-200 mt-1">Bericht: <span className="font-medium">{call.fullDescription}</span></p>}
                                    <p className="text-xs text-gray-400 mt-1">{new Date(call.timestamp).toLocaleString()}</p>
                                    <div className="mt-4 flex gap-3">
                                        {call.status === 'nieuw' && (
                                            <button
                                                onClick={() => handleCallAction(call.id, 'acknowledge')}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition shadow-sm"
                                            >
                                                Bevestig
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleCallAction(call.id, 'close')}
                                            className="px-4 py-2 bg-gray-500 text-white rounded-md text-sm hover:bg-gray-600 transition shadow-sm"
                                        >
                                            Sluit
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Online Units */}
                <div className="bg-gray-800 p-6 rounded-xl shadow-inner border border-gray-700">
                    <h3 className="text-2xl font-semibold text-blue-400 mb-5 flex items-center"><UsersIcon className="w-7 h-7 mr-3 text-blue-400" /> Online Eenheden</h3>
                    {units.length === 0 ? (
                        <p className="text-gray-400 italic">Geen eenheden online.</p>
                    ) : (
                        <div className="space-y-4">
                            {units.map(unit => (
                                <div key={unit.id} className="bg-gray-700 p-4 rounded-lg shadow-md border border-gray-600 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                                    <div>
                                        <p className="text-lg font-bold text-gray-100">{unit.name} <span className="text-sm font-normal text-gray-300">({unit.rank} - {unit.specialization})</span></p>
                                        <p className="text-sm text-gray-200">ID: <span className="font-medium">{unit.id.substring(0, 8)}</span></p>
                                        <p className="text-xs text-gray-400">Afdeling: {unit.department}</p>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                                        <span className={`px-3 py-1.5 rounded-full text-sm font-semibold
                                            ${unit.status === 'Beschikbaar' ? 'bg-green-600 text-white border border-green-700' :
                                            unit.status === 'Onderweg' || unit.status === 'Ter Plaatse' ? 'bg-blue-600 text-white border border-blue-700' :
                                            unit.status === 'Bezet' ? 'bg-yellow-600 text-white border border-yellow-700' : 'bg-red-600 text-white border border-red-700'}
                                        `}>
                                            {unit.status}
                                        </span>
                                        {unit.status !== 'Niet Beschikbaar' && (
                                            <button
                                                onClick={() => handleKickUnit(unit.id)}
                                                className="px-3 py-1.5 bg-red-700 text-white rounded-md text-sm hover:bg-red-800 transition shadow-sm"
                                            >
                                                Kick
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Voice Requests - Now integrated into calls */}
                <div className="bg-gray-800 p-6 rounded-xl shadow-inner border border-gray-700">
                    <h3 className="text-2xl font-semibold text-orange-400 mb-5 flex items-center"><MessageSquareIcon className="w-7 h-7 mr-3 text-orange-400" /> Spraakverzoeken</h3>
                    {calls.filter(call => call.type === 'VOICE_REQUEST').length === 0 ? (
                        <p className="text-gray-400 italic">Geen nieuwe spraakverzoeken.</p>
                    ) : (
                        <div className="space-y-4">
                            {calls.filter(call => call.type === 'VOICE_REQUEST').map(request => (
                                <div key={request.id} className="bg-gray-700 p-4 rounded-lg shadow-md border border-gray-600">
                                    <p className="text-lg font-bold text-gray-100">Van Eenheid: <span className="font-medium">{request.callerId.substring(0, 8)}</span></p>
                                    <p className="text-base text-gray-200 mt-1">Verzoek: "<span className="italic">{request.description}</span>"</p>
                                    <p className="text-xs text-gray-400 mt-1">{new Date(request.timestamp).toLocaleString()}</p>
                                    <div className="mt-4 flex gap-3">
                                        {request.status === 'nieuw' && (
                                            <button
                                                onClick={() => handleCallAction(request.id, 'acknowledge')}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition shadow-sm"
                                            >
                                                Bevestig
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleCallAction(request.id, 'close')} // 'close' action will remove it from calls
                                            className="px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition shadow-sm"
                                            >
                                            Afgerond
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Create New Incident */}
            <div className="mb-10 p-8 bg-gray-800 rounded-2xl shadow-inner border border-gray-700">
                <h3 className="text-2xl font-semibold text-orange-400 mb-6 flex items-center"><PlusCircleIcon className="w-7 h-7 mr-3 text-orange-400" /> Nieuw Incident Aanmaken</h3>
                <form onSubmit={handleCreateIncident} className="space-y-6">
                    <div>
                        <label htmlFor="description" className="block text-base font-medium text-gray-300 mb-2">Onderwerp (Korte beschrijving)</label>
                        <input
                            type="text"
                            id="description"
                            value={newIncident.description}
                            onChange={(e) => setNewIncident({ ...newIncident, description: e.target.value })}
                            className="w-full p-4 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg bg-gray-700 text-gray-100"
                            placeholder="Korte samenvatting van het incident..."
                        />
                    </div>
                    <div>
                        <label htmlFor="fullDescription" className="block text-base font-medium text-gray-300 mb-2">Volledige Meldingstekst</label>
                        <textarea
                            id="fullDescription"
                            value={newIncident.fullDescription}
                            onChange={(e) => setNewIncident({ ...newIncident, fullDescription: e.target.value })}
                            className="w-full p-4 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg resize-y min-h-[100px] bg-gray-700 text-gray-100"
                            rows="4"
                            placeholder="Gedetailleerde beschrijving van het incident voor de hulpdiensten..."
                        ></textarea>
                    </div>
                    <div>
                        <label htmlFor="location" className="block text-base font-medium text-gray-300 mb-2">Locatie</label>
                        <input
                            type="text"
                            id="location"
                            value={newIncident.location}
                            onChange={(e) => setNewIncident({ ...newIncident, location: e.target.value })}
                            className="w-full p-4 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg bg-gray-700 text-gray-100"
                            placeholder="Bijv. Straatnaam 123, Plaatsnaam"
                        />
                    </div>
                    <div>
                        <label htmlFor="priority" className="block text-base font-medium text-gray-300 mb-2">Prioriteit</label>
                        <select
                            id="priority"
                            value={newIncident.priority}
                            onChange={(e) => setNewIncident({ ...newIncident, priority: e.target.value })}
                            className="w-full p-4 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg bg-gray-700 text-gray-100"
                        >
                            <option>Laag</option>
                            <option>Normaal</option>
                            <option>Hoog</option>
                            <option>Zeer Hoog</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-base font-medium text-gray-300 mb-3">Eenheden Toewijzen</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {units.map(unit => (
                                <label key={unit.id} className="flex items-center space-x-3 bg-gray-700 p-3 rounded-lg shadow-sm border border-gray-600 cursor-pointer hover:bg-gray-600 transition">
                                    <input
                                        type="checkbox"
                                        checked={newIncident.assignedUnits.includes(unit.id)}
                                        onChange={(e) => {
                                            const updatedUnits = e.target.checked
                                                ? [...newIncident.assignedUnits, unit.id]
                                                : newIncident.assignedUnits.filter(id => id !== unit.id);
                                            setNewIncident({ ...newIncident, assignedUnits: updatedUnits });
                                        }}
                                        className="form-checkbox h-5 w-5 text-blue-400 rounded"
                                    />
                                    <span className="text-gray-100 text-base">{unit.name} ({unit.rank} - {unit.specialization}) (<span className={`font-medium ${unit.status === 'Beschikbaar' ? 'text-green-400' : 'text-red-400'}`}>{unit.status}</span>)</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full px-6 py-3 bg-orange-600 text-white rounded-lg shadow-lg hover:bg-orange-700 transition duration-200 ease-in-out flex items-center justify-center font-bold text-lg transform hover:-translate-y-0.5 border-b-4 border-orange-800"
                    >
                        <PlusCircleIcon className="w-6 h-6 mr-3" />
                        Incident Aanmaken
                    </button>
                </form>
            </div>

            {/* Active Incidents */}
            <div className="p-8 bg-gray-800 rounded-2xl shadow-inner border border-gray-700">
                <h3 className="text-2xl font-semibold text-orange-400 mb-6 flex items-center"><ListIcon className="w-7 h-7 mr-3 text-orange-400" /> Actieve Incidenten</h3>
                {incidents.length === 0 ? (
                    <p className="text-gray-400 italic">Geen actieve incidenten.</p>
                ) : (
                    <div className="space-y-6">
                        {incidents.map(incident => (
                            <div key={incident.id} className="bg-gray-700 p-5 rounded-lg shadow-md border border-gray-600">
                                <p className="text-xl font-bold text-gray-100 flex items-center mb-2"><InfoIcon className="w-6 h-6 mr-3 text-orange-400" /> Incident ID: {incident.id.substring(0, 8)}</p>
                                <p className="text-lg text-gray-200 flex items-center mt-1"><MapPinIcon className="w-5 h-5 mr-3 text-gray-400" /> Locatie: <span className="font-medium">{incident.location}</span></p>
                                <p className="text-lg text-gray-200 flex items-center mt-1"><ListIcon className="w-5 h-5 mr-3 text-gray-400" /> Beschrijving: <span className="font-medium">{incident.description}</span></p>
                                {incident.fullDescription && <p className="text-lg text-gray-200 flex items-center mt-1"><ListIcon className="w-5 h-5 mr-3 text-gray-400" /> Volledige Melding: <span className="font-medium">{incident.fullDescription.substring(0, 100)}...</span></p>}
                                <p className="text-lg text-gray-200 flex items-center mt-1"><CircleDotIcon className="w-5 h-5 mr-3 text-gray-400" /> Status: <span className={`font-extrabold ${incident.status === 'resolved' || incident.status === 'closed' ? 'text-green-400' : 'text-red-400'}`}>{incident.status.replace('_', ' ').toUpperCase()}</span></p>
                                <p className="text-lg text-gray-200 flex items-center mt-1"><UsersIcon className="w-5 h-5 mr-3 text-gray-400" /> Toegewezen aan: <span className="font-medium">{incident.assignedUnits && incident.assignedUnits.length > 0 ? incident.assignedUnits.map(uid => units.find(u => u.id === uid)?.name || uid.substring(0, 8)).join(', ') : 'Geen'}</span></p>
                                <div className="mt-5 flex flex-wrap gap-3">
                                    <button
                                        onClick={() => handleIncidentStatusUpdate(incident.id, 'assigned')}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition shadow-sm"
                                    >
                                        Toegewezen
                                    </button>
                                    <button
                                        onClick={() => handleIncidentStatusUpdate(incident.id, 'en_route')}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition shadow-sm"
                                    >
                                        Onderweg
                                    </button>
                                    <button
                                        onClick={() => handleIncidentStatusUpdate(incident.id, 'on_scene')}
                                        className="px-4 py-2 bg-yellow-600 text-white rounded-md text-sm hover:bg-yellow-700 transition shadow-sm"
                                    >
                                        Ter Plaatse
                                    </button>
                                    <button
                                        onClick={() => handleIncidentStatusUpdate(incident.id, 'resolved')}
                                        className="px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition shadow-sm"
                                    >
                                        Opgelost
                                    </button>
                                    <button
                                        onClick={() => handleIncidentStatusUpdate(incident.id, 'closed')}
                                        className="px-4 py-2 bg-gray-500 text-white rounded-md text-sm hover:bg-gray-600 transition shadow-sm"
                                    >
                                        Sluit
                                    </button>
                                    <button
                                        onClick={() => handleEditIncident(incident)}
                                        className="px-4 py-2 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700 transition shadow-sm"
                                    >
                                        <EditIcon className="w-4 h-4 inline-block mr-1" /> Bewerk
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Modal
                show={modal.show}
                title={modal.title}
                message={modal.message}
                type={modal.type}
                onClose={() => setModal({ ...modal, show: false })}
            >
                {modal.children}
            </Modal>

            {/* Edit Incident Modal */}
            {editingIncident && (
                <Modal
                    show={showEditIncidentModal}
                    title="Incident Bewerken"
                    message=""
                    onClose={() => { setShowEditIncidentModal(false); setEditingIncident(null); }}
                    onConfirm={handleUpdateIncident}
                    type="info"
                >
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="edit-description" className="block text-base font-medium text-gray-300 mb-2">Onderwerp (Korte beschrijving)</label>
                            <input
                                type="text"
                                id="edit-description"
                                value={editingIncident.description}
                                onChange={(e) => setEditingIncident({ ...editingIncident, description: e.target.value })}
                                className="w-full p-3 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-base bg-gray-700 text-gray-100"
                                placeholder="Korte samenvatting van het incident..."
                            />
                        </div>
                        <div>
                            <label htmlFor="edit-fullDescription" className="block text-base font-medium text-gray-300 mb-2">Volledige Meldingstekst</label>
                            <textarea
                                id="edit-fullDescription"
                                value={editingIncident.fullDescription}
                                onChange={(e) => setEditingIncident({ ...editingIncident, fullDescription: e.target.value })}
                                className="w-full p-3 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-base resize-y min-h-[80px] bg-gray-700 text-gray-100"
                                rows="4"
                                placeholder="Gedetailleerde beschrijving van het incident voor de hulpdiensten..."
                            ></textarea>
                        </div>
                        <div>
                            <label htmlFor="edit-location" className="block text-base font-medium text-gray-300 mb-2">Locatie</label>
                            <input
                                type="text"
                                id="edit-location"
                                value={editingIncident.location}
                                onChange={(e) => setEditingIncident({ ...editingIncident, location: e.target.value })}
                                className="w-full p-3 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-base bg-gray-700 text-gray-100"
                                placeholder="Bijv. Straatnaam 123, Plaatsnaam"
                            />
                        </div>
                        <div>
                            <label htmlFor="edit-priority" className="block text-base font-medium text-gray-300 mb-2">Prioriteit</label>
                            <select
                                id="edit-priority"
                                value={editingIncident.priority}
                                onChange={(e) => setEditingIncident({ ...editingIncident, priority: e.target.value })}
                                className="w-full p-3 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-base bg-gray-700 text-gray-100"
                            >
                                <option>Laag</option>
                                <option>Normaal</option>
                                <option>Hoog</option>
                                <option>Zeer Hoog</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-base font-medium text-gray-300 mb-3">Eenheden Toewijzen</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {units.map(unit => (
                                    <label key={unit.id} className="flex items-center space-x-3 bg-gray-700 p-3 rounded-lg shadow-sm border border-gray-600 cursor-pointer hover:bg-gray-600 transition">
                                        <input
                                            type="checkbox"
                                            checked={editingIncident.assignedUnits.includes(unit.id)}
                                            onChange={(e) => {
                                                const updatedUnits = e.target.checked
                                                    ? [...editingIncident.assignedUnits, unit.id]
                                                    : editingIncident.assignedUnits.filter(id => id !== unit.id);
                                                setEditingIncident({ ...editingIncident, assignedUnits: updatedUnits });
                                            }}
                                            className="form-checkbox h-5 w-5 text-blue-400 rounded"
                                        />
                                        <span className="text-gray-100 text-base">{unit.name} ({unit.rank} - {unit.specialization}) (<span className={`font-medium ${unit.status === 'Beschikbaar' ? 'text-green-400' : 'text-red-400'}`}>{unit.status}</span>)</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

// Admin Page Component
const AdminPage = ({ appData, setAppData }) => {
    const { userRole: loggedInUserRole } = useContext(AppContext);
    const [users, setUsers] = useState([]);
    const [modal, setModal] = useState({ show: false, title: '', message: '', type: 'info', onConfirm: null });

    useEffect(() => {
        setUsers([...appData.users]);
    }, [appData.users]);

    const updateUserStatus = (userIdToUpdate, newStatus) => {
        if (loggedInUserRole !== 'admin' && loggedInUserRole !== 'superadmin') {
            setModal({ show: true, title: 'Toegang Geweigerd', message: 'U heeft geen permissies om de gebruikersstatus te wijzigen.', type: 'error', onClose: () => setModal({ ...modal, show: false }) });
            return;
        }

        setAppData(prevData => {
            const updatedUsers = prevData.users.map(user =>
                user.id === userIdToUpdate ? { ...user, status: newStatus } : user
            );
            const userEmail = prevData.users.find(u => u.id === userIdToUpdate)?.email || userIdToUpdate.substring(0, 8);
            setModal({ show: true, title: 'Gebruiker Status', message: `Status van gebruiker ${userEmail} bijgewerkt naar ${newStatus}.`, type: 'success', onClose: () => setModal({ ...modal, show: false }) });
            return { ...prevData, users: updatedUsers };
        });
    };

    const updateUserRole = (userIdToUpdate, newRole) => {
        const userToUpdate = users.find(u => u.id === userIdToUpdate);

        if (userToUpdate && userToUpdate.email === 'superadmin@regio18.nl') {
            setModal({ show: true, title: 'Rol Wijzigen Geweigerd', message: 'De rol van het hoofd superadmin account kan niet worden gewijzigd.', type: 'error', onClose: () => setModal({ ...modal, show: false }) });
            return;
        }

        if (loggedInUserRole === 'superadmin') {
            // Superadmin can assign any role
        } else if (loggedInUserRole === 'admin') {
            // Admin can only assign 'user' or 'mod'
            if (newRole === 'admin' || newRole === 'superadmin') {
                setModal({ show: true, title: 'Rol Wijzigen Geweigerd', message: 'U heeft geen permissies om de rol naar admin of superadmin te wijzigen.', type: 'error', onClose: () => setModal({ ...modal, show: false }) });
                return;
            }
        } else {
            setModal({ show: true, title: 'Toegang Geweigerd', message: 'U heeft geen permissies om gebruikersrollen te wijzigen.', type: 'error', onClose: () => setModal({ ...modal, show: false }) });
            return;
        }

        setAppData(prevData => {
            const updatedUsers = prevData.users.map(user =>
                user.id === userIdToUpdate ? { ...user, role: newRole } : user
            );
            const userEmail = prevData.users.find(u => u.id === userIdToUpdate)?.email || userIdToUpdate.substring(0, 8);
            setModal({ show: true, title: 'Gebruiker Rol', message: `Rol van gebruiker ${userEmail} bijgewerkt naar ${newRole}.`, type: 'success', onClose: () => setModal({ ...modal, show: false }) });
            return { ...prevData, users: updatedUsers };
        });
    };

    const handleApprove = (userId) => {
        setModal({
            show: true,
            title: 'Gebruiker Goedkeuren',
            message: 'Weet u zeker dat u deze gebruiker wilt goedkeuren?',
            type: 'info',
            onClose: () => setModal({ ...modal, show: false }),
            onConfirm: () => {
                updateUserStatus(userId, 'approved');
                setModal({ ...modal, show: false });
            }
        });
    };

    const handleReject = (userId) => {
        setModal({
            show: true,
            title: 'Gebruiker Afwijzen',
            message: 'Weet u zeker dat u deze gebruiker wilt afwijzen? Dit kan niet ongedaan worden gemaakt.',
            type: 'error',
            onClose: () => setModal({ ...modal, show: false }),
            onConfirm: () => {
                updateUserStatus(userId, 'rejected');
                setModal({ ...modal, show: false });
            }
        });
    };

    const handleRevokeApproval = (userId) => {
        setModal({
            show: true,
            title: 'Goedkeuring Intrekken',
            message: 'Weet u zeker dat u de goedkeuring voor deze gebruiker wilt intrekken? De status wordt teruggezet naar "in afwachting".',
            type: 'error',
            onClose: () => setModal({ ...modal, show: false }),
            onConfirm: () => {
                updateUserStatus(userId, 'pending');
                setModal({ ...modal, show: false });
            }
        });
    };

    const approvedUsers = users.filter(user => user.status === 'approved');
    const pendingUsers = users.filter(user => user.status === 'pending');

    return (
        <div className="p-8 bg-gray-900 rounded-2xl shadow-2xl max-w-4xl mx-auto mt-12 border border-purple-700">
            <h2 className="text-4xl font-bold text-purple-400 mb-8 text-center flex items-center justify-center">
                <UserCogIcon className="w-9 h-9 mr-4" /> Admin Portaal
            </h2>

            {/* Approved Users */}
            <div className="mb-10 bg-gray-800 p-6 rounded-xl shadow-inner border border-gray-700">
                <h3 className="text-2xl font-semibold text-green-400 mb-5">Goedgekeurde Gebruikers</h3>
                {approvedUsers.length === 0 ? (
                    <p className="text-gray-400 italic">Geen goedgekeurde gebruikers.</p>
                ) : (
                    <div className="space-y-4">
                        {approvedUsers.map(user => (
                            <div key={user.id} className="bg-gray-700 p-4 rounded-lg shadow-md border border-gray-600 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                <div>
                                    <p className="text-lg font-bold text-gray-100">{user.email}</p>
                                    <p className="text-sm text-gray-200">Afdeling: {user.department} {user.rank ? `(${user.rank})` : ''} {user.callSign ? `(${user.callSign})` : ''}</p>
                                    <p className="text-xs text-gray-400">ID: {user.id.substring(0, 8)} | Rol: <span className="font-semibold text-purple-300">{user.role.toUpperCase()}</span></p>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                                    <span className="px-3 py-1.5 rounded-full text-sm font-semibold bg-green-600 text-white border border-gray-500">
                                        GOEDGEKEURD
                                    </span>
                                    {(loggedInUserRole === 'admin' || loggedInUserRole === 'superadmin') && user.email !== 'superadmin@regio18.nl' ? (
                                        <>
                                            <select
                                                value={user.role}
                                                onChange={(e) => updateUserRole(user.id, e.target.value)}
                                                className="px-3 py-1.5 rounded-md bg-gray-600 text-white text-sm border border-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
                                            >
                                                <option value="user">USER</option>
                                                <option value="mod">MOD</option>
                                                {(loggedInUserRole === 'superadmin') && <option value="admin">ADMIN</option>}
                                                {(loggedInUserRole === 'superadmin') && <option value="superadmin">SUPERADMIN</option>}
                                            </select>
                                            <button
                                                onClick={() => handleRevokeApproval(user.id)}
                                                className="px-3 py-1.5 bg-red-700 text-white rounded-md text-sm hover:bg-red-800 transition shadow-sm"
                                            >
                                                Goedkeuring Intrekken
                                            </button>
                                        </>
                                    ) : (
                                        <span className="px-3 py-1.5 rounded-full text-sm font-semibold bg-gray-600 text-white border border-gray-500">
                                            {user.role.toUpperCase()}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Pending Users */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-inner border border-gray-700">
                <h3 className="text-2xl font-semibold text-yellow-400 mb-5">Gebruikers in Afwachting</h3>
                {pendingUsers.length === 0 ? (
                    <p className="text-gray-400 italic">Geen gebruikers in afwachting van goedkeuring.</p>
                ) : (
                    <div className="space-y-4">
                        {pendingUsers.map(user => (
                            <div key={user.id} className="bg-gray-700 p-4 rounded-lg shadow-md border border-gray-600 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                <div>
                                    <p className="text-lg font-bold text-gray-100">{user.email}</p>
                                    <p className="text-sm text-gray-200">Afdeling: {user.department} {user.rank ? `(${user.rank})` : ''} {user.callSign ? `(${user.callSign})` : ''}</p>
                                    <p className="text-xs text-gray-400">ID: {user.id.substring(0, 8)} | Rol: <span className="font-semibold text-purple-300">{user.role.toUpperCase()}</span></p>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                                    <span className="px-3 py-1.5 rounded-full text-sm font-semibold bg-yellow-600 text-white border border-gray-500">
                                        IN AFWACHTING
                                    </span>
                                    {(loggedInUserRole === 'admin' || loggedInUserRole === 'superadmin') && (
                                        <>
                                            <button
                                                onClick={() => handleApprove(user.id)}
                                                className="px-3 py-1.5 bg-green-700 text-white rounded-md text-sm hover:bg-green-800 transition shadow-sm"
                                            >
                                                Goedkeuren
                                            </button>
                                            <button
                                                onClick={() => handleReject(user.id)}
                                                className="px-3 py-1.5 bg-red-700 text-white rounded-md text-sm hover:bg-red-800 transition shadow-sm"
                                            >
                                                Afwijzen
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Modal
                show={modal.show}
                title={modal.title}
                message={modal.message}
                type={modal.type}
                onClose={() => setModal({ ...modal, show: false })}
                onConfirm={modal.onConfirm}
            />
        </div>
    );
};
