// src/components/ControlRoomPage.js
import React, { useState, useEffect, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Modal from './Modal'; // Import Modal component
import { AppContext } from '../App'; // Import AppContext
import { BellRingIcon, UsersIcon, MessageSquareIcon, PlusCircleIcon, ListIcon, InfoIcon, MapPinIcon, CircleDotIcon, EditIcon } from '../icons'; // Assuming icons are in a separate file or directly imported as SVG

const ControlRoomPage = () => {
    const { userId, appData, setAppData } = useContext(AppContext);
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

export default ControlRoomPage;
