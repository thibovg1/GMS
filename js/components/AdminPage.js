// js/components/AdminPage.js
import React, { useState, useEffect, useContext } from 'react';
import Modal from './Modal.js'; // Import Modal component
import { AppContext } from '../App.js'; // Import AppContext
import { UserCogIcon } from '../icons.js'; // Import icons

const AdminPage = () => {
    const { userRole: loggedInUserRole, appData, setAppData } = useContext(AppContext);
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

export default AdminPage;
