document.addEventListener('DOMContentLoaded', () => {
    const afdelingForm = document.getElementById('afdelingForm');
    const departmentSelect = document.getElementById('department');
    const specializationGroup = document.getElementById('specializationGroup');
    const specializationSelect = document.getElementById('specialization');
    const callsignGroup = document.getElementById('callsignGroup');
    const callsignInput = document.getElementById('callsign');
    const afdelingMessage = document.getElementById('afdelingMessage');
    const unitStatusGroup = document.getElementById('unitStatusGroup');
    const unitStatusSelect = document.getElementById('unitStatus');

    let loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));

    // Als er geen ingelogde gebruiker is, stuur terug naar de loginpagina
    if (!loggedInUser) {
        window.location.href = 'index.html';
        return;
    }

    // Array van afdelingen die specialisaties en eenhedenstatus vereisen
    const helpdeskDepartments = ['Brandweer', 'Politie', 'Ambulance', 'Prorail'];

    // Update de zichtbaarheid van specialisatie en callsign op basis van afdeling
    departmentSelect.addEventListener('change', () => {
        const selectedDepartment = departmentSelect.value;
        if (helpdeskDepartments.includes(selectedDepartment)) {
            specializationGroup.style.display = 'block';
            callsignGroup.style.display = 'block';
            unitStatusGroup.style.display = 'block';
            populateSpecializations(selectedDepartment);
        } else {
            specializationGroup.style.display = 'none';
            callsignGroup.style.display = 'none';
            unitStatusGroup.style.display = 'none';
        }
    });

    function populateSpecializations(department) {
        specializationSelect.innerHTML = '<option value="">-- Selecteer Specialisatie --</option>';
        let specializations = [];

        switch (department) {
            case 'Brandweer':
                specializations = ['Algemeen', 'Verkenning', 'Redding', 'TS', 'HW', 'WO'];
                break;
            case 'Politie':
                specializations = ['Algemeen', 'Verkeer', 'Hondenbrigade', 'Arrestatieteam', 'ME'];
                break;
            case 'Ambulance':
                specializations = ['Algemeen', 'Rapid Responder', 'MMT'];
                break;
            case 'Prorail':
                specializations = ['Algemeen', 'Spooronderhoud', 'Calamiteiten'];
                break;
            default:
                break;
        }

        specializations.forEach(spec => {
            const option = document.createElement('option');
            option.value = spec;
            option.textContent = spec;
            specializationSelect.appendChild(option);
        });
    }

    function displayMessage(message, type) {
        afdelingMessage.textContent = message;
        afdelingMessage.className = `message ${type}`;
        afdelingMessage.style.display = 'block';
    }

    function hideMessage() {
        afdelingMessage.style.display = 'none';
        afdelingMessage.classList.remove('success', 'error');
    }

    afdelingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        hideMessage();

        const selectedDepartment = departmentSelect.value;
        const selectedSpecialization = specializationSelect.value;
        const callsign = callsignInput.value.trim();
        const unitStatus = unitStatusSelect.value;

        if (!selectedDepartment) {
            displayMessage('Selecteer alstublieft een afdeling.', 'error');
            return;
        }

        if (helpdeskDepartments.includes(selectedDepartment)) {
            if (!selectedSpecialization) {
                displayMessage('Selecteer alstublieft een specialisatie.', 'error');
                return;
            }
            if (!callsign) {
                displayMessage('Voer alstublieft een roepnaam in.', 'error');
                return;
            }
            if (!unitStatus) {
                displayMessage('Selecteer alstublieft een eenheid status.', 'error');
                return;
            }
        }

        // Update de loggedInUser in sessionStorage met de gekozen afdeling en specialisatie/roepnaam
        loggedInUser.department = selectedDepartment;
        loggedInUser.specialization = helpdeskDepartments.includes(selectedDepartment) ? selectedSpecialization : null;
        loggedInUser.callsign = helpdeskDepartments.includes(selectedDepartment) ? callsign : null;
        loggedInUser.unitStatus = helpdeskDepartments.includes(selectedDepartment) ? unitStatus : null;

        sessionStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));

        // Beheer van actieve sessies (simulatie van ingelogde eenheden)
        let allSessions = JSON.parse(sessionStorage.getItem('gms_logged_in_sessions')) || [];
        // Verwijder de oude sessie van deze gebruiker indien aanwezig
        allSessions = allSessions.filter(session => session.id !== loggedInUser.id);
        // Voeg de bijgewerkte sessie toe
        allSessions.push({ 
            id: loggedInUser.id, 
            username: loggedInUser.username,
            department: loggedInUser.department, 
            specialization: loggedInUser.specialization,
            callsign: loggedInUser.callsign,
            unitStatus: loggedInUser.unitStatus,
            role: loggedInUser.role, // Voeg de rol toe voor context
            currentMeldingen: [] // Eenheden ontvangen hier meldingen
        });
        sessionStorage.setItem('gms_logged_in_sessions', JSON.stringify(allSessions));

        displayMessage('Afdeling succesvol geselecteerd! U wordt doorgestuurd...', 'success');

        // Navigeer naar de juiste pagina
        setTimeout(() => {
            if (selectedDepartment === 'Meldkamer') {
                window.location.href = 'meldkamer_dashboard.html';
            } else if (helpdeskDepartments.includes(selectedDepartment)) {
                window.location.href = 'afdeling_info.html'; // Dit kan de algemene pagina voor hulpdiensten zijn
            } else if (selectedDepartment === 'Burger') {
                alert(`Welkom als Burger: ${loggedInUser.username}`);
                // Optioneel: doorsturen naar een burger-specifieke pagina indien gemaakt
                window.location.href = 'index.html'; // Of een burger-dashboard
            } else {
                alert(`Welkom bij Afdeling: ${selectedDepartment}`);
                window.location.href = 'index.html'; // Of een algemeen dashboard
            }
        }, 1500);
    });

    // Initialiseer de dropdowns indien nodig
    departmentSelect.dispatchEvent(new Event('change'));
});