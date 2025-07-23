document.addEventListener('DOMContentLoaded', () => {
    const infoDepartmentName = document.getElementById('infoDepartmentName');
    const infoUsername = document.getElementById('infoUsername');
    const infoSpecialization = document.getElementById('infoSpecialization');
    const infoCallsign = document.getElementById('infoCallsign');
    const departmentSpecificContent = document.getElementById('departmentSpecificContent');
    const incomingMeldingenList = document.getElementById('incomingMeldingenList');
    const backToSelectionButton = document.getElementById('backToSelection');

    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));

    if (!loggedInUser || !loggedInUser.department) {
        window.location.href = 'afdeling.html';
        return;
    }

    infoDepartmentName.textContent = loggedInUser.department;
    infoUsername.textContent = loggedInUser.username;
    infoSpecialization.textContent = loggedInUser.specialization;
    infoCallsign.textContent = loggedInUser.callsign || 'N.v.t.';

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
                meldingDiv.innerHTML = `
                    <h3>Melding #${melding.id} - ${melding.type} (${melding.prioriteit})</h3>
                    <p><strong>Locatie:</strong> ${melding.locatie}</p>
                    <p><strong>Omschrijving:</strong> ${melding.omschrijving}</p>
                    <p class="melding-status">Status: ${melding.status}</p>
                    <p class="melding-timestamp">Ontvangen: ${melding.timestamp}</p>
                    <button class="button acknowledge-button" data-melding-id="${melding.id}">Accepteren</button>
                    <button class="button reject-button" data-melding-id="${melding.id}">Afwijzen</button>
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
            alert(`Melding ${meldingId} geaccepteerd!`);
            // Hier kun je verder logica toevoegen, zoals navigatie naar een detailpagina
        } else if (e.target.classList.contains('reject-button')) {
            updateMeldingStatusForUnit(meldingId, 'Afgewezen', loggedInUser.id);
            alert(`Melding ${meldingId} afgewezen.`);
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
                    // Optioneel: verwijder melding als deze afgewezen/afgehandeld is
                    // allSessions[targetSessionIndex].currentMeldingen.splice(meldingInSessionIndex, 1);
                }
                sessionStorage.setItem('gms_logged_in_sessions', JSON.stringify(allSessions));
            }
        }
        renderIncomingMeldingen(); // Ververs de lijst
    }


    backToSelectionButton.addEventListener('click', () => {
        // Maak de afdelingsselectie ongedaan in sessionStorage bij terugkeer
        loggedInUser.department = undefined;
        loggedInUser.specialization = undefined;
        loggedInUser.callsign = undefined;
        sessionStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));

        // Verwijder de huidige meldingen voor deze sessie bij terugkeer naar selectiepagina
        let allSessions = JSON.parse(sessionStorage.getItem('gms_logged_in_sessions')) || [];
        const currentSessionIndex = allSessions.findIndex(session => session.id === loggedInUser.id);
        if (currentSessionIndex !== -1) {
            allSessions[currentSessionIndex].currentMeldingen = []; // Leeg de meldingen
            sessionStorage.setItem('gms_logged_in_sessions', JSON.stringify(allSessions));
        }

        window.location.href = 'afdeling.html';
    });

    // Render de meldingen direct bij het laden van de pagina
    renderIncomingMeldingen();

    // Optioneel: Ververs meldingen periodiek (bijv. elke 10 seconden)
    // Dit simuleert een 'live' update, in een echte app zou je WebSockets gebruiken.
    // setInterval(renderIncomingMeldingen, 10000); 
});