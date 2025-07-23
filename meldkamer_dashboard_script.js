document.addEventListener('DOMContentLoaded', () => {
    const currentDateTimeSpan = document.getElementById('currentDateTime');
    const logoutButton = document.getElementById('logoutButton');
    const addMeldingButton = document.getElementById('addMeldingButton');
    const openMeldingenList = document.getElementById('openMeldingenList');
    const completedMeldingenList = document.getElementById('completedMeldingenList');
    const selectedMeldingDetails = document.getElementById('selectedMeldingDetails');
    const unitStatusDisplay = document.getElementById('unitStatusDisplay'); // Dit is de container
    const activeUnitsList = document.getElementById('activeUnitsList'); // Dit is de lijst in de container

    // De ingelogde gebruiker (die de afdeling 'Meldkamer' heeft gekozen)
    let loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));

    // --- Toegangscontrole voor de meldkamer ---
    function checkMeldkamerAccess() {
        if (!loggedInUser || loggedInUser.department !== 'Meldkamer') {
            alert('Geen toegang: U bent niet geautoriseerd om de meldkamer te openen. Selecteer eerst de afdeling Meldkamer.');
            window.location.href = 'index.html';
            return false;
        }
        return true;
    }

    if (!checkMeldkamerAccess()) {
        return; // Stop uitvoering als geen toegang
    }

    // --- Datum en Tijd Update ---
    function updateDateTime() {
        const now = new Date();
        const options = { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
        currentDateTimeSpan.textContent = now.toLocaleDateString('nl-BE', options).replace(',', '') + ' (' + now.toLocaleTimeString('nl-BE', { hour: '2-digit', minute: '2-digit' }) + ')';
    }
    setInterval(updateDateTime, 1000); // Elke seconde updaten
    updateDateTime(); // Direct bij laden

    // --- Meldingen Beheer Functies ---

    // Initialiseer meldingen in localStorage indien leeg
    function initializeMeldingen() {
        if (!localStorage.getItem('gms_meldingen')) {
            localStorage.setItem('gms_meldingen', JSON.stringify([]));
        }
    }

    // Haal alle meldingen op
    function getAllMeldingen() {
        return JSON.parse(localStorage.getItem('gms_meldingen')) || [];
    }

    // Sla alle meldingen op
    function saveAllMeldingen(meldingen) {
        localStorage.setItem('gms_meldingen', JSON.stringify(meldingen));
    }

    // Functie om de meldingenlijsten te renderen
    function renderMeldingen() {
        const allMeldingen = getAllMeldingen();
        openMeldingenList.innerHTML = '';
        completedMeldingenList.innerHTML = '';
        
        // Houd de geselecteerde melding bij om te voorkomen dat details verdwijnen na refresh
        let currentSelectedMeldingId = selectedMeldingDetails.dataset.selectedMeldingId ? parseInt(selectedMeldingDetails.dataset.selectedMeldingId) : null;

        const openMeldingen = allMeldingen.filter(m => m.status !== 'Afgehandeld' && m.status !== 'Gearchiveerd');
        const completedMeldingen = allMeldingen.filter(m => m.status === 'Afgehandeld' || m.status === 'Gearchiveerd');

        if (openMeldingen.length === 0) {
            openMeldingenList.innerHTML = '<p class="no-meldingen-message">Geen openstaande meldingen</p>';
        } else {
            openMeldingen.forEach(melding => {
                const meldingItem = document.createElement('div');
                meldingItem.className = 'melding-item';
                if (melding.id === currentSelectedMeldingId) {
                    meldingItem.classList.add('selected');
                }
                meldingItem.dataset.meldingId = melding.id;
                meldingItem.innerHTML = `
                    <h4>Melding #${melding.id} - ${melding.type}</h4>
                    <p>Locatie: ${melding.locatie}</p>
                    <p>Status: <span class="priority">${melding.status}</span></p>
                `;
                meldingItem.addEventListener('click', () => selectMelding(melding));
                openMeldingenList.appendChild(meldingItem);
            });
        }

        if (completedMeldingen.length === 0) {
            completedMeldingenList.innerHTML = '<p class="no-meldingen-message">Geen uitgevoerde meldingen</p>';
        } else {
            completedMeldingen.forEach(melding => {
                const meldingItem = document.createElement('div');
                meldingItem.className = 'melding-item';
                if (melding.id === currentSelectedMeldingId) {
                    meldingItem.classList.add('selected');
                }
                meldingItem.dataset.meldingId = melding.id;
                meldingItem.innerHTML = `
                    <h4>Melding #${melding.id} - ${melding.type}</h4>
                    <p>Locatie: ${melding.locatie}</p>
                    <p>Status: <span class="priority">${melding.status}</span></p>
                `;
                meldingItem.addEventListener('click', () => selectMelding(melding));
                completedMeldingenList.appendChild(meldingItem);
            });
        }

        // Als er een melding geselecteerd was, zorg dat de details opnieuw worden geladen
        if (currentSelectedMeldingId) {
            const selectedMelding = allMeldingen.find(m => m.id === currentSelectedMeldingId);
            if (selectedMelding) {
                selectMelding(selectedMelding);
            } else {
                selectedMeldingDetails.innerHTML = '<p>Geen melding geselecteerd.</p>';
                selectedMeldingDetails.dataset.selectedMeldingId = '';
            }
        } else {
            selectedMeldingDetails.innerHTML = '<p>Geen melding geselecteerd.</p>';
            selectedMeldingDetails.dataset.selectedMeldingId = '';
        }
    }

    function selectMelding(melding) {
        // Verwijder 'selected' klasse van alle meldingen
        document.querySelectorAll('.melding-item').forEach(item => {
            item.classList.remove('selected');
        });
        // Voeg 'selected' klasse toe aan de geklikte melding
        const selectedItem = document.querySelector(`.melding-item[data-melding-id="${melding.id}"]`);
        if (selectedItem) {
            selectedItem.classList.add('selected');
        }

        selectedMeldingDetails.dataset.selectedMeldingId = melding.id; // Sla de geselecteerde ID op
        selectedMeldingDetails.innerHTML = `
            <p><strong>ID:</strong> ${melding.id}</p>
            <p><strong>Type:</strong> ${melding.type}</p>
            <p><strong>Prioriteit:</strong> <span class="priority">${melding.prioriteit}</span></p>
            <p><strong>Locatie:</strong> ${melding.locatie}</p>
            <p><strong>Omschrijving:</strong> ${melding.omschrijving}</p>
            <p><strong>Status:</strong> ${melding.status}</p>
            <p><strong>Datum/Tijd:</strong> ${melding.timestamp}</p>
            ${melding.assignedUnits && melding.assignedUnits.length > 0 ? 
                `<p><strong>Toegewezen Eenheden:</strong> ${melding.assignedUnits.map(unit => `${unit.department} ${unit.callsign || unit.username}`).join(', ')}</p>` 
                : '<p><strong>Toegewezen Eenheden:</strong> Geen</p>'
            }
            
            <div class="details-buttons">
                <button id="assignUnitsButton" data-melding-id="${melding.id}">Eenheden Toewijzen</button>
                <button id="closeMeldingButton" data-melding-id="${melding.id}">Melding Afhandelen</button>
            </div>
        `;

        // Event listeners voor detailknoppen
        const assignUnitsButton = document.getElementById('assignUnitsButton');
        const closeMeldingButton = document.getElementById('closeMeldingButton');

        if (assignUnitsButton) {
            assignUnitsButton.addEventListener('click', (e) => {
                const meldingId = parseInt(e.target.dataset.meldingId);
                alert(`Eenheden toewijzen aan melding ${meldingId}. Functionaliteit nog te implementeren.`);
                // Hier zou je een pop-up kunnen openen met een lijst van beschikbare eenheden
                // en de mogelijkheid om ze aan deze melding te koppelen.
                // Dit zou dan de 'assignedUnits' array in de melding moeten bijwerken.
            });
        }

        if (closeMeldingButton) {
            closeMeldingButton.addEventListener('click', (e) => {
                const meldingId = parseInt(e.target.dataset.meldingId);
                if (confirm(`Weet u zeker dat u melding #${meldingId} wilt afhandelen?`)) {
                    updateMeldingStatus(meldingId, 'Afgehandeld');
                    renderMeldingen(); // Ververs de lijst
                    alert(`Melding #${meldingId} afgehandeld.`);
                }
            });
        }
    }

    function updateMeldingStatus(meldingId, newStatus) {
        const allMeldingen = getAllMeldingen();
        const meldingIndex = allMeldingen.findIndex(m => m.id === meldingId);
        if (meldingIndex !== -1) {
            allMeldingen[meldingIndex].status = newStatus;
            saveAllMeldingen(allMeldingen);
            
            // Ook de status in de unit's sessionStorage bijwerken als deze melding geaccepteerd was
            // OF als deze melding betrekking heeft op een specifieke eenheid
            let allSessions = JSON.parse(sessionStorage.getItem('gms_logged_in_sessions')) || [];
            allSessions.forEach(session => {
                if (session.currentMeldingen) {
                    const meldingInSessionIndex = session.currentMeldingen.findIndex(m => m.id === meldingId);
                    if (meldingInSessionIndex !== -1) {
                        session.currentMeldingen[meldingInSessionIndex].status = newStatus;
                    }
                }
            });
            sessionStorage.setItem('gms_logged_in_sessions', JSON.stringify(allSessions));
        }
    }
    
    // --- Actieve Eenheden Beheer Functies ---
    function renderActiveUnits() {
        const allSessions = JSON.parse(sessionStorage.getItem('gms_logged_in_sessions')) || [];
        activeUnitsList.innerHTML = '';

        // Filter sessies die daadwerkelijk een hulpdienst zijn en een status hebben
        const activeUnits = allSessions.filter(session => 
            session.department && 
            session.unitStatus &&
            session.department !== 'Meldkamer' && // Meldkamer is geen 'eenheid' in deze context
            session.department !== 'Burger' // Burger is geen 'eenheid'
        );

        if (activeUnits.length === 0) {
            activeUnitsList.innerHTML = '<p>Geen actieve eenheden.</p>';
        } else {
            activeUnits.forEach(unit => {
                const unitItem = document.createElement('div');
                unitItem.className = 'unit-status-item';
                // Gebruik een class voor de statuskleur
                const statusClass = `status-${unit.unitStatus.replace(/\s|\*/g, '')}`; // Verwijder spaties en * voor classnaam
                unitItem.innerHTML = `
                    <strong>${unit.callsign || unit.username}</strong>
                    (${unit.department}, ${unit.specialization || 'N/A'}): 
                    <span class="status ${statusClass}">${unit.unitStatus}</span>
                `;
                activeUnitsList.appendChild(unitItem);
            });
        }
    }

    // --- Event Listeners ---
    logoutButton.addEventListener('click', () => {
        // Verwijder de huidige meldkamer sessie uit de lijst van actieve sessies
        let allSessions = JSON.parse(sessionStorage.getItem('gms_logged_in_sessions')) || [];
        allSessions = allSessions.filter(session => session.id !== loggedInUser.id);
        sessionStorage.setItem('gms_logged_in_sessions', JSON.stringify(allSessions));

        sessionStorage.removeItem('loggedInUser'); // Verwijder meldkamer sessie
        alert('U bent succesvol uitgelogd.');
        window.location.href = 'index.html'; // Terug naar loginpagina
    });

    addMeldingButton.addEventListener('click', () => {
        window.location.href = 'meldkamer_melding_aanmaken.html';
    });

    // --- Initiële Laad & Periodieke Updates ---
    initializeMeldingen(); // Zorg dat de meldingenlijst bestaat
    renderMeldingen(); // Render meldingen bij het laden
    renderActiveUnits(); // Render actieve eenheden bij het laden

    // Update de meldingen en actieve eenheden periodiek
    setInterval(() => {
        renderMeldingen();
        renderActiveUnits();
    }, 5000); // Elke 5 seconden
});