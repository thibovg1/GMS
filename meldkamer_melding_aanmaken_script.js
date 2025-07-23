document.addEventListener('DOMContentLoaded', () => {
    const newMeldingForm = document.getElementById('newMeldingForm');
    const meldingTypeSelect = document.getElementById('meldingType');
    const meldingPrioriteitSelect = document.getElementById('meldingPrioriteit');
    const meldingLocatieInput = document.getElementById('meldingLocatie');
    const meldingOmschrijvingTextarea = document.getElementById('meldingOmschrijving');
    const meldingMessage = document.getElementById('meldingMessage');
    const backToDashboardButton = document.getElementById('backToDashboardButton');

    // De ingelogde gebruiker (die de afdeling 'Meldkamer' heeft gekozen)
    let loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));

    // --- Toegangscontrole voor de meldkamer ---
    function checkMeldkamerAccess() {
        if (!loggedInUser || loggedInUser.department !== 'Meldkamer') {
            alert('Geen toegang: U bent niet geautoriseerd om meldingen aan te maken. Selecteer eerst de afdeling Meldkamer.');
            window.location.href = 'index.html'; // Stuur terug naar login
            return false;
        }
        return true;
    }

    if (!checkMeldkamerAccess()) {
        return; // Stop uitvoering als geen toegang
    }

    // --- Meldingen Beheer Functies (Consistent met dashboard) ---
    function getAllMeldingen() {
        return JSON.parse(localStorage.getItem('gms_meldingen')) || [];
    }

    function saveAllMeldingen(meldingen) {
        localStorage.setItem('gms_meldingen', JSON.stringify(meldingen));
    }

    // Genereer een unieke ID voor meldingen
    function generateMeldingId() {
        const allMeldingen = getAllMeldingen();
        let maxId = 0;
        if (allMeldingen.length > 0) {
            maxId = Math.max(...allMeldingen.map(m => m.id));
        }
        return maxId + 1;
    }

    function displayMessage(message, type) {
        meldingMessage.textContent = message;
        meldingMessage.className = `message ${type}`;
        meldingMessage.style.display = 'block';
    }

    function hideMessage() {
        meldingMessage.style.display = 'none';
        meldingMessage.classList.remove('success', 'error');
    }

    newMeldingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        hideMessage();

        const meldingType = meldingTypeSelect.value;
        const meldingPrioriteit = meldingPrioriteitSelect.value;
        const meldingLocatie = meldingLocatieInput.value.trim();
        const meldingOmschrijving = meldingOmschrijvingTextarea.value.trim();

        if (!meldingType || !meldingPrioriteit || !meldingLocatie || !meldingOmschrijving) {
            displayMessage('Vul alstublieft alle velden in.', 'error');
            return;
        }

        const newMelding = {
            id: generateMeldingId(),
            type: meldingType,
            prioriteit: meldingPrioriteit,
            locatie: meldingLocatie,
            omschrijving: meldingOmschrijving,
            timestamp: new Date().toLocaleString('nl-BE'),
            status: 'Nieuw', // Initiële status van een melding
            assignedUnits: [] // Meldingen beginnen zonder toegewezen eenheden
        };

        const allMeldingen = getAllMeldingen();
        allMeldingen.push(newMelding);
        saveAllMeldingen(allMeldingen); // Opslaan in localStorage

        // Melding toevoegen aan de sessie van geschikte eenheden (simulatie)
        // Dit is een simpele simulatie. In een echte app zou dit via een server gaan.
        let allSessions = JSON.parse(sessionStorage.getItem('gms_logged_in_sessions')) || [];
        const relevantDepartments = getRelevantDepartmentsForMelding(meldingType);

        allSessions.forEach(session => {
            // Voeg melding toe aan sessies van hulpdiensten die relevant zijn en ingelogd zijn
            if (relevantDepartments.includes(session.department) && session.role === 'user') {
                if (!session.currentMeldingen) {
                    session.currentMeldingen = [];
                }
                // Voorkom dubbele meldingen in de lijst van de eenheid
                if (!session.currentMeldingen.some(m => m.id === newMelding.id)) {
                    session.currentMeldingen.push({ ...newMelding, status: 'Open' }); // Kopie met status voor eenheid
                }
            }
        });
        sessionStorage.setItem('gms_logged_in_sessions', JSON.stringify(allSessions));


        displayMessage(`Melding #${newMelding.id} succesvol aangemaakt!`, 'success');
        newMeldingForm.reset(); // Formulier resetten

        // Terug naar dashboard na een korte vertraging
        setTimeout(() => {
            window.location.href = 'meldkamer_dashboard.html';
        }, 1500);
    });

    // Helper functie om te bepalen welke afdelingen relevant zijn voor een meldingstype
    function getRelevantDepartmentsForMelding(type) {
        switch(type) {
            case 'Brand': return ['Brandweer', 'Politie', 'Ambulance']; // Politie kan assisteren bij brand
            case 'Ongeval': return ['Politie', 'Ambulance', 'Brandweer']; // Alle 3 vaak nodig bij ongeval
            case 'Medisch': return ['Ambulance', 'Politie']; // Politie voor verkeersregeling/assistentie
            case 'Overval': return ['Politie'];
            case 'Vermissing': return ['Politie'];
            case 'Gevaarlijke Stoffen': return ['Brandweer', 'Ambulance', 'Politie'];
            case 'Wateroverlast': return ['Brandweer', 'Prorail'];
            case 'Openbare Orde': return ['Politie'];
            case 'Varia': return ['Politie', 'Brandweer', 'Ambulance', 'Prorail']; // Voor algemene zaken
            default: return [];
        }
    }

    backToDashboardButton.addEventListener('click', () => {
        window.location.href = 'meldkamer_dashboard.html';
    });
});