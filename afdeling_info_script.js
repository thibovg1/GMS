document.addEventListener('DOMContentLoaded', () => {
    const infoDepartmentName = document.getElementById('infoDepartmentName');
    const infoUsername = document.getElementById('infoUsername');
    const infoSpecialization = document.getElementById('infoSpecialization');
    const infoCallsign = document.getElementById('infoCallsign');
    const departmentSpecificContent = document.getElementById('departmentSpecificContent');
    const incomingMeldingenList = document.getElementById('incomingMeldingenList');
    const backToSelectionButton = document.getElementById('backToSelection');

    // NIEUWE ELEMENTEN
    const statusKeypad = document.querySelector('.status-keypad');
    const displayUnitStatus = document.getElementById('displayUnitStatus');
    const statusMessage = document.getElementById('statusMessage');

    let loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));

    if (!loggedInUser || !loggedInUser.department) {
        window.location.href = 'afdeling.html';
        return;
    }

    infoDepartmentName.textContent = loggedInUser.department;
    infoUsername.textContent = loggedInUser.username;
    infoSpecialization.textContent = loggedInUser.specialization;
    infoCallsign.textContent = loggedInUser.callsign || 'N.v.t.';

    // Initialiseer de status als deze nog niet bestaat
    if (!loggedInUser.unitStatus) {
        loggedInUser.unitStatus = 'Onbekend';
        sessionStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
        updateSessionStatus(loggedInUser.id, 'Onbekend');
    }
    displayUnitStatus.textContent = loggedInUser.unitStatus;


    function loadDepartmentContent(department) {
        let content = '';
        switch (department) {
            case "Brandweer":
                content = `
                    <h3>Taken als Brandweer</h3>
                    <ul>
                        <li>Bestrijden van branden.</li>
                        <li>Redden van mensen en dieren uit gevaarlijke situaties.</li>
                        <li>Verlenen van technische hulp, zoals bij verkeersongevallen.</li>
                        <li>Optreden bij waterongevallen en incidenten met gevaarlijke stoffen.</li>
                        <li>Preventie en voorlichting.</li>
                    </ul>
                    <p>Houd altijd uw PBM (Persoonlijke Beschermingsmiddelen) in orde en volg de bevelvoering op.</p>
                `;
                break;
            case "Politie":
                content = `
                    <h3>Taken als Politieagent</h3>
                    <ul>
                        <li>Handhaven van openbare orde en veiligheid.</li>
                        <li>Opsporen van strafbare feiten.</li>
                        <li>Verlenen van hulp aan hen die dat nodig hebben.</li>
                        <li>Verkeershandhaving en -regulering.</li>
                        <li>Crisismanagement bij grote incidenten.</li>
                    </ul>
                    <p>Wees alert, handel adequaat en blijf communiceren met de meldkamer.</p>
                `;
                break;
            case "Ambulance":
                content = `
                    <h3>Taken als Ambulancepersoneel</h3>
                    <ul>
                        <li>Verlenen van spoedeisende medische hulp ter plaatse.</li>
                        <li>Vervoeren van patiënten naar ziekenhuizen of andere medische faciliteiten.</li>
                        <li>Stabiliseren van de patiënt tijdens transport.</li>
                        <li>Assisteren bij medische noodsituaties en evenementen.</li>
                    </ul>
                    <p>Zorg voor snelle en accurate medische zorg. Elke seconde telt!</p>
                `;
                break;
            case "Prorail":
                content = `
                    <h3>Taken als Prorail Medewerker</h3>
                    <ul>
                        <li>Veiligstellen van spoorlijnen bij incidenten.</li>
                        <li>Herstellen van storingen aan spoorinfrastructuur (rails, wissels, seinen).</li>
                        <li>Inspecteren en onderhouden van het spoornetwerk.</li>
                        <li>Coördineren van verkeer bij verstoringen.</li>
                        <li>Samenwerken met hulpdiensten bij incidenten op of nabij het spoor.</li>
                    </ul>
                    <p>Veiligheid op en rond het spoor is van het grootste belang. Volg alle protocollen nauwkeurig.</p>
                `;
                break;
            default:
                content = `<p>Geen specifieke informatie beschikbaar voor deze afdeling.</p>`;
                break;
        }
        departmentSpecificContent.innerHTML = content;
    }

    loadDepartmentContent(loggedInUser.department);

    // Functie om de binnenkomende meldingen te renderen
    function renderIncomingMeldingen() {
        const allSessions = JSON.parse(sessionStorage.getItem('gms_logged_in_sessions')) || [];
        const currentSession = allSessions.find(session => session.id === loggedInUser.id);

        if (currentSession && currentSession.currentMeldingen && currentSession.currentMeldingen.length > 0) {
            incomingMeldingenList.innerHTML = ''; // Leeg de lijst
            currentSession.currentMeldingen.forEach(melding => {
                const meldingDiv = document.createElement('div');
                meldingDiv.className = 'melding-item';
                // Voorkom dat geaccepteerde/afgewezen meldingen knoppen hebben of verander hun weergave
                const buttonsHtml = (melding.status === 'Geaccepteerd' || melding.status === 'Afgewezen' || melding.status === 'Afgehandeld')
                    ? `<p class="melding-status-detail">Actie: ${melding.status}</p>`
                    : `<button class="button acknowledge-button" data-melding-id="${melding.id}">Accepteren</button>
                       <button class="button reject-button" data-melding-id="${melding.id}">Afwijzen</button>`;

                meldingDiv.innerHTML = `
                    <h3>Melding #${melding.id} - ${melding.type} (${melding.prioriteit})</h3>
                    <p><strong>Locatie:</strong> ${melding.locatie}</p>
                    <p><strong>Omschrijving:</strong> ${melding.omschrijving}</p>
                    <p class="melding-status">Huidige Status: ${melding.status}</p>
                    <p class="melding-timestamp">Ontvangen: ${melding.timestamp}</p>
                    ${buttonsHtml}
                `;
                incomingMeldingenList.appendChild(meldingDiv);
            });
        } else {
            incomingMeldingenList.innerHTML = '<p>Geen openstaande meldingen voor uw eenheid.</p>';
        }
    }

    // Event listener voor accepteren/afwijzen van meldingen
    incomingMeldingenList.addEventListener('click', (e) => {
        const meldingId = parseInt(e.target.dataset.meldingId);
        if (e.target.classList.contains('acknowledge-button')) {
            updateMeldingStatusForUnit(meldingId, 'Geaccepteerd', loggedInUser.id);
            alert(`Melding ${meldingId} geaccepteerd! De meldkamer is hiervan op de hoogte gebracht.`);
            // Hier kun je verder logica toevoegen, zoals navigatie naar een detailpagina of een routeplanner
        } else if (e.target.classList.contains('reject-button')) {
            updateMeldingStatusForUnit(meldingId, 'Afgewezen', loggedInUser.id);
            alert(`Melding ${meldingId} afgewezen. De meldkamer is hiervan op de hoogte gebracht.`);
        }
    });

    function updateMeldingStatusForUnit(meldingId, newStatus, unitId) {
        let allMeldingen = JSON.parse(localStorage.getItem('gms_meldingen')) || [];
        const meldingIndex = allMeldingen.findIndex(m => m.id === meldingId);

        if (meldingIndex !== -1) {
            // Update status in de hoofdmeldingenlijst (voor meldkameroverzicht)
            allMeldingen[meldingIndex].status = newStatus; 
            localStorage.setItem('gms_meldingen', JSON.stringify(allMeldingen));

            // Update status in de sessionStorage van de actieve eenheid (zodat het van hun lijst verdwijnt/verandert)
            let allSessions = JSON.parse(sessionStorage.getItem('gms_logged_in_sessions')) || [];
            const targetSessionIndex = allSessions.findIndex(session => session.id === unitId);

            if (targetSessionIndex !== -1) {
                const meldingInSessionIndex = allSessions[targetSessionIndex].currentMeldingen.findIndex(m => m.id === meldingId);
                if (meldingInSessionIndex !== -1) {
                    allSessions[targetSessionIndex].currentMeldingen[meldingInSessionIndex].status = newStatus;
                    // Optioneel: verwijder melding als deze afgewezen/afgehandeld is,
                    // afhankelijk van hoe je wilt dat de geschiedenis wordt getoond.
                    // Voor nu laten we ze staan met de nieuwe status.
                }
                sessionStorage.setItem('gms_logged_in_sessions', JSON.stringify(allSessions));
            }
        }
        renderIncomingMeldingen(); // Ververs de lijst na de status update
    }


    backToSelectionButton.addEventListener('click', () => {
        // Maak de afdelingsselectie ongedaan in sessionStorage bij terugkeer
        // zodat de gebruiker opnieuw een afdeling kan kiezen.
        const userWithoutSelections = {
            id: loggedInUser.id,
            username: loggedInUser.username,
            role: loggedInUser.role 
            // Verwijder department, specialization, callsign
        };
        sessionStorage.setItem('loggedInUser', JSON.stringify(userWithoutSelections));

        // Verwijder de huidige meldingen voor deze specifieke sessie bij terugkeer naar selectiepagina
        // Dit voorkomt dat meldingen blijven staan als de gebruiker van afdeling wisselt.
        let allSessions = JSON.parse(sessionStorage.getItem('gms_logged_in_sessions')) || [];
        const currentSessionIndex = allSessions.findIndex(session => session.id === loggedInUser.id);
        if (currentSessionIndex !== -1) {
            allSessions[currentSessionIndex].department = undefined; // Wis department etc. in de actieve sessie
            allSessions[currentSessionIndex].specialization = undefined;
            allSessions[currentSessionIndex].callsign = undefined;
            allSessions[currentSessionIndex].currentMeldingen = []; // Leeg de meldingen voor deze sessie
            allSessions[currentSessionIndex].unitStatus = 'Onbekend'; // Reset ook de status
            sessionStorage.setItem('gms_logged_in_sessions', JSON.stringify(allSessions));
        }

        window.location.href = 'afdeling.html';
    });

    // --- NIEUWE STATUS KNOP FUNCTIONALITEIT ---
    const statusMap = {
        '1': 'Vrij',
        '2': 'Aanrijdend',
        '3': 'Ter Plaatse',
        '4': 'Bezet',
        '5': 'Uitmelden',
        '6': 'Spraak',
        '7': 'Urgent',
        '8': 'Melding',
        '9': 'Informatie',
        '*': 'Eindrapport',
        '0': 'Noodknop',
        'discord': 'Discord'
    };

    function displayStatusMessage(message, type) {
        statusMessage.textContent = message;
        statusMessage.className = `message ${type}`;
        statusMessage.style.display = 'block';
        setTimeout(() => {
            statusMessage.style.display = 'none';
        }, 3000); // Verberg bericht na 3 seconden
    }

    function updateUnitGlobalStatus(newStatus, unitId, username, callsign) {
        let allSessions = JSON.parse(sessionStorage.getItem('gms_logged_in_sessions')) || [];
        const targetSessionIndex = allSessions.findIndex(session => session.id === unitId);

        if (targetSessionIndex !== -1) {
            allSessions[targetSessionIndex].unitStatus = newStatus;
            sessionStorage.setItem('gms_logged_in_sessions', JSON.stringify(allSessions));
            console.log(`Status van ${username} (${callsign}) bijgewerkt naar: ${newStatus}`);

            // Update ook de 'loggedInUser' in de huidige sessie
            loggedInUser.unitStatus = newStatus;
            sessionStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
            displayUnitStatus.textContent = newStatus;
            displayStatusMessage(`Status bijgewerkt naar: ${newStatus}`, 'success');

        } else {
            console.error(`Sessie voor eenheid ID ${unitId} niet gevonden.`);
            displayStatusMessage('Fout: Kon status niet bijwerken in sessie.', 'error');
        }
    }

    statusKeypad.addEventListener('click', (e) => {
        const button = e.target.closest('.status-button');
        if (button) {
            const statusCode = button.dataset.statusCode;
            const statusDescription = statusMap[statusCode] || 'Onbekend';

            if (statusCode === '0') { // Noodknop
                const confirmEmergency = confirm(`WEET U ZEKER DAT U DE NOODKNOP WILT INDIENEN? Dit stuurt een alarm naar de meldkamer!`);
                if (confirmEmergency) {
                    updateUnitGlobalStatus('NOOD', loggedInUser.id, loggedInUser.username, loggedInUser.callsign);
                    alert('Noodsignaal verstuurd naar meldkamer!');
                    // Hier kun je extra logica toevoegen, bijv. naar een noodscherm navigeren of een API call doen
                } else {
                    displayStatusMessage('Noodknop geannuleerd.', 'info');
                }
            } else if (statusCode === 'discord') {
                // Hier kun je een link openen of een specifieke Discord-functie triggeren
                alert('Discord functionaliteit (nog) niet geïmplementeerd.');
                // window.open('https://discord.com/jouw-server-link', '_blank'); // Voorbeeld om Discord te openen
                displayStatusMessage('Verbinden met Discord...', 'info');
            } else if (statusCode === '*') {
                 // Eindrapport functionaliteit
                alert('Eindrapport functionaliteit (nog) niet geïmplementeerd.');
                displayStatusMessage('Eindrapport wordt voorbereid...', 'info');
            }
            else {
                updateUnitGlobalStatus(statusDescription, loggedInUser.id, loggedInUser.username, loggedInUser.callsign);
            }
        }
    });
    // --- EINDE NIEUWE STATUS KNOP FUNCTIONALITEIT ---


    // Render de meldingen direct bij het laden van de pagina
    renderIncomingMeldingen();

    // Ververs meldingen en status periodiek (bijv. elke 5 seconden)
    // Dit is belangrijk voor de eenheid om updates te ontvangen van de meldkamer
    setInterval(() => {
        // Herlaad loggedInUser om de meest recente status uit sessionStorage te krijgen
        loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
        displayUnitStatus.textContent = loggedInUser.unitStatus || 'Onbekend'; // Update de weergegeven status
        renderIncomingMeldingen();
    }, 5000); 
});