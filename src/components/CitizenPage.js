// src/components/CitizenPage.js
import React, { useState, useEffect, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Modal from './Modal'; // Import Modal component
import { AppContext } from '../App'; // Import AppContext
import { PhoneCallIcon, InfoIcon, ListIcon, MapPinIcon } from '../icons'; // Assuming icons are in a separate file or directly imported as SVG

const CitizenPage = () => {
    const { userId, appData, setAppData } = useContext(AppContext);
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

export default CitizenPage;
