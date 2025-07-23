document.addEventListener('DOMContentLoaded', () => {
    const loggedInMeldkamerUsername = document.getElementById('loggedInMeldkamerUsername');
    const loggedInMeldkamerSpecialization = document.getElementById('loggedInMeldkamerSpecialization');
    const createMeldingForm = document.getElementById('createMeldingForm');
    const meldingTypeSelect = document.getElementById('meldingType');
    const meldingPrioriteitSelect = document.getElementById('meldingPrioriteit');
    const meldingLocatieInput = document.getElementById('meldingLocatie');
    const meldingOmschrijvingTextarea = document.getElementById('meldingOmschrijving');
    const createMeldingMessage = document.getElementById('createMeldingMessage');
    const openMeldingenTableBody = document.querySelector('#openMeldingenTable tbody');

    const unitSelectionModal = document.getElementById('unitSelectionModal');
    const closeButton = document.querySelector('.modal .close-button');
    const modalMeldingId = document.getElementById('modalMeldingId');
    const modalMeldingType = document.getElementById('modalMeldingType');
    const modalMeldingLocatie = document.getElementById('modalMeldingLocatie');
    const availableUnitsList = document.getElementById('availableUnitsList');
    const confirmKoppelingButton = document.getElementById('confirmKoppelingButton');
    const koppelingMessage = document.getElementById('koppelingMessage');

    let currentMeldingToKoppel = null; // Houdt de melding bij die gekoppeld wordt

    // --- Gegevens opslag (simulatie van database) ---
    const getStoredMeldingen = () => {
        return JSON.parse(localStorage.getItem('gms_meldingen')) || [];
    };

    const saveMeldingen = (meldingen) => {
        localStorage.setItem('gms_meldingen', JSON.stringify(meldingen));
    };

    const getStoredAvailableUnits = () => {
        // Eenheden zijn de gebruikers die een afdeling en roepnummer hebben geselecteerd
        const allUsers = JSON.parse(localStorage.getItem('gms_all_users')) || [];
        const loggedInUserSessions = JSON.parse(sessionStorage.getItem('gms_logged_in_sessions')) || [];
        
        // Filter alleen de eenheden die ingelogd zijn en een roepnummer hebben
        const availableUnits = loggedInUserSessions.filter(session => 
            session.department && session.callsign && session.callsign !== "N.v.t."
        ).map(session => ({
            id: session.id,
            username: session.username,
            department: session.department,
            specialization: session.specialization,
            callsign: session.callsign
        }));

        return availableUnits;
    };

    // --- Initialisatie en Autorisatie ---
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    if (!loggedInUser || loggedInUser.department !== 'Meldkamer') {
        alert('U heeft geen toegang tot deze pagina. Log in als Meldkamer.');
        window.location.href = 'index.html';
        return;
    }

    loggedInMeldkamerUsername.textContent = loggedInUser.username;
    loggedInMeldkamerSpecialization.textContent = loggedInUser.specialization;

    // --- Meldingen beheer ---
    function displayMessage(message, type, element) {
        element.textContent = message;
        element.className = `message ${type}`;
        element.style.display = 'block';
    }

    function hideMessage(element) {
        element.style.display = 'none';
        element.classList.remove('success', 'error');
    }

    function renderOpenMeldingen() {
        const meldingen = getStoredMeldingen().filter(m => m.status === 'Open' || m.status === 'Actief');
        openMeldingenTableBody.innerHTML = '';

        if (meldingen.length === 0) {
            openMeldingenTableBody.innerHTML = '<tr><td colspan="7">Geen openstaande meldingen.</td></tr>';
            return;
        }

        meldingen.forEach(melding => {
            const row = openMeldingenTableBody.insertRow();
            row.dataset.meldingId = melding.id; // Voor gemakkelijk ophalen

            const gekoppeldeEenhedenTekst = melding.linkedUnits.length > 0
                ? melding.linkedUnits.map(unit => `${unit.callsign} (${unit.department})`).join(', ')
                : 'Geen';

            row.innerHTML = `
                <td>${melding.id}</td>
                <td>${melding.type}</td>
                <td>${melding.prioriteit}</td>
                <td>${melding.locatie}</td>
                <td>${melding.status}</td>
                <td>${gekoppeldeEenhedenTekst}</td>
                <td>
                    <button class="button koppel-button" data-melding-id="${melding.id}">Eenheid Koppelen</button>
                    </td>
            `;
        });
    }

    createMeldingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        hideMessage(createMeldingMessage);

        const newMelding = {
            id: Date.now(), // Unieke ID
            type: meldingTypeSelect.value,
            prioriteit: meldingPrioriteitSelect.value,
            locatie: meldingLocatieInput.value,
            omschrijving: meldingOmschrijvingTextarea.value,
            status: 'Open',
            linkedUnits: [], // Eenheden die gekoppeld zijn aan deze melding
            timestamp: new Date().toLocaleString()
        };

        const meldingen = getStoredMeldingen();
        meldingen.push(newMelding);
        saveMeldingen(meldingen);

        displayMessage('Melding succesvol aangemaakt!', 'success', createMeldingMessage);
        createMeldingForm.reset(); // Formulier resetten
        renderOpenMeldingen(); // Tabel bijwerken
    });

    // --- Eenheid Koppelen Modal Logica ---
    openMeldingenTableBody.addEventListener('click', (e) => {
        if (e.target.classList.contains('koppel-button')) {
            const meldingId = parseInt(e.target.dataset.meldingId);
            const meldingen = getStoredMeldingen();
            const melding = meldingen.find(m => m.id === meldingId);

            if (melding) {
                currentMeldingToKoppel = melding;
                modalMeldingId.textContent = melding.id;
                modalMeldingType.textContent = melding.type;
                modalMeldingLocatie.textContent = melding.locatie;
                
                populateAvailableUnits(melding);
                unitSelectionModal.style.display = 'flex'; // Zorg dat modal zichtbaar wordt
                hideMessage(koppelingMessage);
            }
        }
    });

    closeButton.addEventListener('click', () => {
        unitSelectionModal.style.display = 'none';
        currentMeldingToKoppel = null;
    });

    window.addEventListener('click', (e) => {
        if (e.target === unitSelectionModal) {
            unitSelectionModal.style.display = 'none';
            currentMeldingToKoppel = null;
        }
    });

    function populateAvailableUnits(melding) {
        availableUnitsList.innerHTML = '';
        const availableUnits = getStoredAvailableUnits();

        if (availableUnits.length === 0) {
            availableUnitsList.innerHTML = '<p>Geen beschikbare eenheden gevonden.</p>';
            return;
        }

        availableUnits.forEach(unit => {
            // Controleer of de eenheid al gekoppeld is aan deze melding
            const isAlreadyLinked = melding.linkedUnits.some(linkedUnit => linkedUnit.id === unit.id);

            const div = document.createElement('div');
            div.className = 'available-unit-item';
            div.innerHTML = `
                <input type="checkbox" id="unit-${unit.id}" value="${unit.id}" ${isAlreadyLinked ? 'checked disabled' : ''}>
                <label for="unit-${unit.id}">
                    ${unit.callsign} (${unit.department} - ${unit.specialization}) - ${unit.username}
                </label>
            `;
            availableUnitsList.appendChild(div);
        });
    }

    confirmKoppelingButton.addEventListener('click', () => {
        if (!currentMeldingToKoppel) return;

        const selectedUnitIds = Array.from(availableUnitsList.querySelectorAll('input[type="checkbox"]:checked:not(:disabled)'))
                                   .map(checkbox => parseInt(checkbox.value));

        if (selectedUnitIds.length === 0) {
            displayMessage('Selecteer ten minste één eenheid om te koppelen.', 'error', koppelingMessage);
            return;
        }

        const meldingen = getStoredMeldingen();
        const meldingIndex = meldingen.findIndex(m => m.id === currentMeldingToKoppel.id);

        if (meldingIndex !== -1) {
            const availableUnits = getStoredAvailableUnits();
            selectedUnitIds.forEach(unitId => {
                const unitToLink = availableUnits.find(unit => unit.id === unitId);
                if (unitToLink && !meldingen[meldingIndex].linkedUnits.some(lu => lu.id === unitToLink.id)) {
                    meldingen[meldingIndex].linkedUnits.push({
                        id: unitToLink.id,
                        username: unitToLink.username,
                        department: unitToLink.department,
                        specialization: unitToLink.specialization,
                        callsign: unitToLink.callsign
                    });
                    meldingen[meldingIndex].status = 'Actief'; // Status naar actief als eenheid gekoppeld is

                    // Optioneel: Stuur de melding ook naar de gekoppelde eenheid's sessionStorage
                    // Dit vereist dat we bijhouden welke sessies actief zijn
                    updateUnitSessionWithMelding(unitToLink.id, meldingen[meldingIndex]);
                }
            });
            saveMeldingen(meldingen);
            displayMessage('Eenheden succesvol gekoppeld!', 'success', koppelingMessage);
            renderOpenMeldingen(); // Tabel bijwerken
            
            // Sluit modal na een korte vertraging
            setTimeout(() => {
                unitSelectionModal.style.display = 'none';
                currentMeldingToKoppel = null;
            }, 1000);

        }
    });

    // Functie om de melding bij de sessie van de eenheid te updaten
    // Dit is een simpele simulatie. In een echte app zou dit via een server gaan (websockets bijv.)
    function updateUnitSessionWithMelding(unitId, melding) {
        const allSessions = JSON.parse(sessionStorage.getItem('gms_logged_in_sessions')) || [];
        const targetSessionIndex = allSessions.findIndex(session => session.id === unitId);

        if (targetSessionIndex !== -1) {
            if (!allSessions[targetSessionIndex].currentMeldingen) {
                allSessions[targetSessionIndex].currentMeldingen = [];
            }
            // Voeg de melding alleen toe als deze nog niet bestaat in de sessie
            if (!allSessions[targetSessionIndex].currentMeldingen.some(m => m.id === melding.id)) {
                allSessions[targetSessionIndex].currentMeldingen.push(melding);
            }
            sessionStorage.setItem('gms_logged_in_sessions', JSON.stringify(allSessions));
            console.log(`Melding ${melding.id} toegevoegd aan sessie van eenheid ${unitId}`);
        }
    }


    // --- Initial render ---
    renderOpenMeldingen();
});