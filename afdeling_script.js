document.addEventListener('DOMContentLoaded', () => {
    const loggedInUsernameSpan = document.getElementById('loggedInUsername');
    const selectionForm = document.getElementById('selectionForm');
    const departmentSelect = document.getElementById('departmentSelect');
    const specializationSelect = document.getElementById('specializationSelect');
    const callsignSelect = document.getElementById('callsignSelect');
    const selectionMessage = document.getElementById('selectionMessage');

    const departmentsData = {
        "Brandweer": {
            "Blusgroep": ["18-1131", "18-1132", "18-1133", "18-1134", "18-1135"],
            "Tankautospuit": ["18-1130", "18-1140", "18-1150", "18-1160"],
            "Autoladder": ["18-1191", "18-1192"],
            "Waterongevallen": ["18-1171", "18-1172", "18-1173"],
            "Hulpverlening": ["18-1181", "18-1182"],
            "Duikteam": ["18-1175", "18-1176", "18-1177"],
            "Materieel en Logistiek": ["18-1100", "18-1101", "18-1102", "18-1103"],
            "Adembescherming": ["18-1110", "18-1111"],
            "Officiersploeg": ["18-1001", "18-1002", "18-1003", "18-1004", "18-1005"]
        },
        "Politie": {
            "Noodhulp": ["18-P-01", "18-P-02", "18-P-03", "18-P-04", "18-P-05", "18-P-06", "18-P-07", "18-P-08", "18-P-09", "18-P-10"],
            "Verkeerspolitie": ["18-V-01", "18-V-02", "18-V-03", "18-V-04"],
            "Hondenbrigade": ["18-H-01", "18-H-02", "18-H-03"],
            "Recherche": ["18-R-01", "18-R-02", "18-R-03", "18-R-04", "18-R-05", "18-R-06", "18-R-07", "18-R-08"],
            "Wijkagenten": ["18-WA-01", "18-WA-02", "18-WA-03", "18-WA-04", "18-WA-05"],
            "Surveillance": ["18-S-01", "18-S-02", "18-S-03", "18-S-04", "18-S-05", "18-S-06", "18-S-07"],
            "Mobiele Eenheid (ME)": ["18-ME-01", "18-ME-02", "18-ME-03", "18-ME-04"],
            "Brigadier": ["18-B-01", "18-B-02", "18-B-03"],
            "Hoofdagent": ["18-HA-01", "18-HA-02", "18-HA-03"],
            "Coördinator": ["18-CO-01", "18-CO-02"]
        },
        "Ambulance": {
            "Spoedrit (A1)": ["18-101", "18-102", "18-103", "18-104", "18-105", "18-106", "18-107", "18-108"],
            "Spoedrit (A2)": ["18-201", "18-202", "18-203", "18-204", "18-205"],
            "Besteld Vervoer (B)": ["18-301", "18-302", "18-303", "18-304"],
            "Middel Zorg": ["18-MZ-01", "18-MZ-02", "18-MZ-03"],
            "Officier van Dienst Geneeskundig (OvD-G)": ["18-OVDG-01", "18-OVDG-02"],
            "Verpleegkundig Specialist": ["18-VS-01", "18-VS-02"],
            "Rapid Responder": ["18-RR-01", "18-RR-02"],
            "Ambulance Motor": ["18-M-01", "18-M-02"]
        },
        "Prorail": {
            "Storingen & Incidenten": ["18-PR-01", "18-PR-02", "18-PR-03", "18-PR-04", "18-PR-05", "18-PR-06"],
            "Spoedreparaties": ["18-PR-R1", "18-PR-R2", "18-PR-R3"],
            "Inspectie": ["18-PR-I1", "18-PR-I2", "18-PR-I3"],
            "Veiligheidscoördinatie": ["18-PR-V1", "18-PR-V2"],
            "Calamiteiten Team": ["18-PR-CT1", "18-PR-CT2", "18-PR-CT3"],
            "Logistiek": ["18-PR-L1", "18-PR-L2"],
            "Communicatie": ["18-PR-C1", "18-PR-C2"]
        },
        "Meldkamer": {
            "Algemene Meldkamer": [], // Geen roepnummers voor Meldkamer
            "Centralist Noodhulp": [],
            "Centralist Brandweer": [],
            "Centralist Ambulance": [],
            "Centralist Prorail": [],
            "Hoofd Centralist": [],
            "Officier van Dienst (Meldkamer)": [],
            "Ondersteuning": [],
            "Communicatie Specialist": []
        },
        "Burger": {
            "Burger Inwoner": [], // Geen roepnummers voor Burger
            "Burger Hulpverlener": [],
            "Getuige": [],
            "Betrokkene": [],
            "Verkeersregelaar (Vrijwillig)": [],
            "Buurtwacht (Vrijwillig)": [],
            "EHBO (Vrijwillig)": [],
            "Omstander": [],
            "Slachtoffer": []
        }
    };

    // Afdelingen die geen roepnummer invulveld nodig hebben
    const noCallsignDepartments = ["Meldkamer", "Burger"];

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
        window.location.href = 'index.html';
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
        // Verberg/toon het roepnummer selectieveld afhankelijk van de afdeling
        if (noCallsignDepartments.includes(department)) {
            callsignSelect.style.display = 'none';
            callsignSelect.required = false; // Maak het niet verplicht
        } else {
            callsignSelect.style.display = 'block';
            callsignSelect.required = true; // Maak het wel verplicht
            if (department && specialization && departmentsData[department] && departmentsData[department][specialization]) {
                departmentsData[department][specialization].forEach(callsign => {
                    const option = document.createElement('option');
                    option.value = callsign;
                    option.textContent = callsign;
                    callsignSelect.appendChild(option);
                });
            }
        }
    }

    departmentSelect.addEventListener('change', () => {
        const selectedDepartment = departmentSelect.value;
        specializationSelect.value = "";
        callsignSelect.value = "";
        populateSpecializations(selectedDepartment);
        populateCallsigns(selectedDepartment, ""); // Roep aan met de geselecteerde afdeling
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
        let selectedCallsign = callsignSelect.value; // Kan leeg zijn voor Meldkamer/Burger

        if (!selectedDepartment || !selectedSpecialization) {
            displayMessage('Vul alstublieft de afdeling en specialisatie in.', 'error');
            return;
        }

        // Als de afdeling een roepnummer vereist, controleer dan of deze is ingevuld
        if (!noCallsignDepartments.includes(selectedDepartment) && !selectedCallsign) {
            displayMessage('Vul alstublieft ook uw roepnummer in.', 'error');
            return;
        }

        // Voor Meldkamer en Burger, stel roepnummer in op "N.v.t." of null
        if (noCallsignDepartments.includes(selectedDepartment)) {
            selectedCallsign = "N.v.t."; 
        }

        const userWithSelections = {
            ...loggedInUser,
            department: selectedDepartment,
            specialization: selectedSpecialization,
            callsign: selectedCallsign
        };
        sessionStorage.setItem('loggedInUser', JSON.stringify(userWithSelections));

        displayMessage(`Sessie gestart als ${loggedInUser.username} (${selectedDepartment} - ${selectedSpecialization}${selectedCallsign !== "N.v.t." ? " - " + selectedCallsign : ""})! U wordt doorgestuurd...`, 'success');
        
        // Simuleer een kleine vertraging voordat je doorstuurt
        setTimeout(() => {
            window.location.href = 'afdeling_info.html'; // Dit zou de pagina moeten zijn waar je de afdelingsinfo toont
        }, 1500);
    });

    populateDepartments();

    // Update de uitloglink om naar de nieuwe index.html te verwijzen
    const logoutLink = document.querySelector('.logout-link a');
    if (logoutLink) {
        logoutLink.href = 'index.html'; 
    }

    // Initial check to hide callsign select if "Meldkamer" or "Burger" is default/preselected
    // This is useful if you had a saved selection or if you want to set a default.
    // For now, it will apply when the department is changed.
});