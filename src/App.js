// src/App.js
import React, { useState, useEffect, createContext } from 'react';
import { LogOutIcon, UserCogIcon } from './icons'; // Import icons
import Login from './components/Login';
import Register from './components/Register';
import HomePage from './components/HomePage';
import CitizenPage from './components/CitizenPage';
import EmergencyServicePage from './components/EmergencyServicePage';
import ControlRoomPage from './components/ControlRoomPage';
import AdminPage from './components/AdminPage';

// Context for app state
export const AppContext = createContext(null);

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
                    return <CitizenPage />;
                case 'emergency':
                    return <EmergencyServicePage />;
                case 'controlroom':
                    if (userRole === 'admin' || userRole === 'superadmin' || userDepartment === 'Meldkamer') {
                        return <ControlRoomPage />;
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
                        return <AdminPage />;
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
