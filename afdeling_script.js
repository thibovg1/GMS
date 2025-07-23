// afdeling_script.js
document.addEventListener('DOMContentLoaded', () => {
    const loggedInUsernameSpan = document.getElementById('loggedInUsername');
    const selectionForm = document.getElementById('selectionForm');
    const departmentSelect = document.getElementById('departmentSelect');
    const specializationSelect = document.getElementById('specializationSelect');
    const callsignSelect = document.getElementById('callsignSelect');
    const selectionMessage = document.getElementById('selectionMessage');

    const departmentsData = {
        "Politie": {
            "Blussen": ["BRW-001", "BRW-002", "BRW-003"],
            "Redding": ["RD-001", "RD-002", "RD-003"]
        },
        "Brandweer": {
            "Patrouille": ["POL-A01", "POL-A02", "POL-A03"],
            "Recherche": ["POL-B01", "POL-B02"]
        },
        "Ambulance": {
            "Spoed": ["AMB-101", "AMB-102"],
            "Vervoer": ["AMB-201"]
        },

         "Veiligheidsregio": {
            "Blussen": ["BRW-001", "BRW-002", "BRW-003"],
            "Redding": ["RD-001", "RD-002", "RD-003"]
        },
        "Meldkamer": {
            "Centralist Intake": ["POL-A01", "POL-A02", "POL-A03"],
            "Centralist": ["POL-B01", "POL-B02"]
        },
        "Burger": {
            "Vuurwapen Bevoegd": ["AMB-101", "AMB-102"],
            "Niet Vuurwapen Bevoegd": ["AMB-201"]
        }
    };

    function displayMessage(message, type) {
        selectionMessage.textContent = message;
        selectionMessage.className = `message ${type}`;
        selectionMessage.style.display = 'block';
    }

    function hideMessage() {
        selectionMessage.style.display = 'none';
        selectionMessage.classList.remove('success', 'error');
    }

    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    if (!loggedInUser) {
        window.location.href = 'index.html'; // Verwijst nu naar de nieuwe index.html (welkomstpagina)
        return;
    }
    loggedInUsernameSpan.textContent = loggedInUser.username;

    function populateDepartments() {
        departmentSelect.innerHTML = '<option value="">-- Selecteer Afdeling --</option>';
        Object.keys(departmentsData).forEach(dept => {
            const option = document.createElement('option');
            option.value = dept;
            option.textContent = dept;
            departmentSelect.appendChild(option);
        });
    }

    function populateSpecializations(department) {
        specializationSelect.innerHTML = '<option value="">-- Selecteer Specialisatie --</option>';
        if (department && departmentsData[department]) {
            Object.keys(departmentsData[department]).forEach(spec => {
                const option = document.createElement('option');
                option.value = spec;
                option.textContent = spec;
                specializationSelect.appendChild(option);
            });
        }
    }

    function populateCallsigns(department, specialization) {
        callsignSelect.innerHTML = '<option value="">-- Selecteer Roepnummer --</option>';
        if (department && specialization && departmentsData[department] && departmentsData[department][specialization]) {
            departmentsData[department][specialization].forEach(callsign => {
                const option = document.createElement('option');
                option.value = callsign;
                option.textContent = callsign;
                callsignSelect.appendChild(option);
            });
        }
    }

    departmentSelect.addEventListener('change', () => {
        const selectedDepartment = departmentSelect.value;
        specializationSelect.value = "";
        callsignSelect.value = "";
        populateSpecializations(selectedDepartment);
        populateCallsigns("", "");
        hideMessage();
    });

    specializationSelect.addEventListener('change', () => {
        const selectedDepartment = departmentSelect.value;
        const selectedSpecialization = specializationSelect.value;
        callsignSelect.value = "";
        populateCallsigns(selectedDepartment, selectedSpecialization);
        hideMessage();
    });

    selectionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        hideMessage();

        const selectedDepartment = departmentSelect.value;
        const selectedSpecialization = specializationSelect.value;
        const selectedCallsign = callsignSelect.value;

        if (!selectedDepartment || !selectedSpecialization || !selectedCallsign) {
            displayMessage('Vul alstublieft alle selecties in.', 'error');
            return;
        }

        const userWithSelections = {
            ...loggedInUser,
            department: selectedDepartment,
            specialization: selectedSpecialization,
            callsign: selectedCallsign
        };
        sessionStorage.setItem('loggedInUser', JSON.stringify(userWithSelections));

        displayMessage('Sessie gestart! U wordt doorgestuurd...', 'success');
        window.location.href = 'admin_dashboard.html'; // Dit leidt nog steeds naar het dashboard
    });

    populateDepartments();

    // Update de uitloglink om naar de nieuwe index.html te verwijzen
    const logoutLink = document.querySelector('.logout-link a');
    if (logoutLink) {
        logoutLink.href = 'index.html'; 
    }
});