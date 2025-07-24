// src/components/EmergencyServicePage.js
import React, { useState, useEffect, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Modal from './Modal'; // Import Modal component
import { AppContext } from '../App'; // Import AppContext
import { ranksByDepartment, specializationsByRank } from '../data'; // Import data
import { EditIcon } from '../icons'; // Assuming icons are in a separate file or directly imported as SVG

const EmergencyServicePage = () => {
    const { userId, appData, setAppData } = useContext(AppContext);
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

export default EmergencyServicePage;
