document.addEventListener('DOMContentLoaded', () => {
    const loginSection = document.getElementById('login-section');
    const intranetSection = document.getElementById('intranet-section');
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    const logoutBtn = document.getElementById('logout-btn');
    const userDisplayName = document.getElementById('user-display-name');

    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const contentSections = document.querySelectorAll('.content-section');

    // GMS specifieke elementen
    const activeIncidentsCount = document.getElementById('active-incidents-count');
    const urgentIncidentsCount = document.getElementById('urgent-incidents-count');
    const availableUnitsCount = document.getElementById('available-units-count');
    const incidentsTableBody = document.getElementById('incidents-table-body');
    const chatInput = document.getElementById('chat-input');
    const sendMessageBtn = document.getElementById('send-message-btn');
    const chatMessages = document.getElementById('chat-messages');
    const latestUpdatesList = document.getElementById('latest-updates-list');

    // Voorbeeld data voor meldingen
    let incidents = [
        { id: 'M-001', type: 'Brand', location: 'Dorpsstraat 10, Herentals', status: 'new', time: '17:05' },
        { id: 'M-002', type: 'Verkeersongeval', location: 'E313 Afrit 22', status: 'in-progress', time: '17:15' },
        { id: 'M-003', type: 'Medisch Noodgeval', location: 'Koning Albertlaan 5, Geel', status: 'resolved', time: '16:50' },
        { id: 'M-004', type: 'Inbraak', location: 'Stationsplein 1, Lier', status: 'new', time: '17:25' }
    ];

    // Simpele gebruikersdata (in een echt systeem komt dit van een backend)
    const users = [
        { username: 'admin', password: 'password', role: 'admin', name: 'Beheerder' },
        { username: 'centralist', password: 'password', role: 'centralist', name: 'Centralist' },
        { username: 'medewerker', password: 'password', role: 'user', name: 'Medewerker' }
    ];
    let currentUser = null; // Houdt de ingelogde gebruiker bij

    // --- Inlog Functionaliteit ---
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            currentUser = user;
            userDisplayName.textContent = currentUser.name;
            loginSection.classList.add('d-none');
            intranetSection.classList.remove('d-none');
            loginError.classList.add('d-none');
            
            // Toon of verberg admin panel link op basis van rol
            const adminNavLink = document.querySelector('.nav-link.admin-only');
            if (currentUser.role === 'admin') {
                adminNavLink.classList.remove('d-none');
            } else {
                adminNavLink.classList.add('d-none');
            }
            
            showSection('intranet-dashboard'); // Toon standaard het dashboard na inloggen
            initializeGMS(); // Initialiseer GMS functionaliteit na inloggen
        } else {
            loginError.classList.remove('d-none');
        }
    });

    logoutBtn.addEventListener('click', () => {
        currentUser = null;
        intranetSection.classList.add('d-none');
        loginSection.classList.remove('d-none');
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        // Stop GMS simulatie bij uitloggen (optioneel)
        clearInterval(gmsSimulationInterval); 
    });

    // --- Algemene Navigatie Functionaliteit ---
    const showSection = (sectionId) => {
        contentSections.forEach(section => {
            section.classList.remove('active');
            section.classList.add('d-none');
        });
        document.getElementById(sectionId).classList.remove('d-none');
        document.getElementById(sectionId).classList.add('active');

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.section === sectionId) {
                link.classList.add('active');
            }
        });
    };

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = e.target.dataset.section || e.target.closest('a').dataset.section;
            if (sectionId) { // Zorg ervoor dat data-section bestaat
                showSection(sectionId);
            }
        });
    });

    // --- GMS Functionaliteit (ingebouwd) ---
    let gmsSimulationInterval; // Variabele om interval bij te houden

    const initializeGMS = () => {
        updateDashboardCounters();
        renderIncidents();

        // Start GMS simulatie alleen als het nog niet loopt
        if (!gmsSimulationInterval) {
            gmsSimulationInterval = setInterval(() => {
                const newIncidentChance = Math.random();
                if (newIncidentChance < 0.3) { // 30% kans op nieuwe melding
                    const newId = `M-${String(incidents.length + 1).padStart(3, '0')}`;
                    const incidentTypes = ['Brand', 'Verkeersongeval', 'Medisch Noodgeval', 'Inbraak', 'Overval'];
                    const randomType = incidentTypes[Math.floor(Math.random() * incidentTypes.length)];
                    const locations = [
                        'Hoofdstraat 123', 'Industriepark 7', 'Marktplein 1', 'Schoolstraat 45', 'Ziekenhuislaan 8'
                    ];
                    const randomLocation = locations[Math.floor(Math.random() * locations.length)] + ', Herentals';
                    const newIncident = {
                        id: newId,
                        type: randomType,
                        location: randomLocation,
                        status: 'new',
                        time: new Date().toLocaleTimeString().substring(0, 5)
                    };
                    incidents.unshift(newIncident); // Voeg toe aan begin van de array
                    renderIncidents();
                    updateDashboardCounters();
                    updateLatestUpdates(`Nieuwe melding: ${newIncident.type} op ${newIncident.location}`);
                    addChatMessage(`Systeem: Nieuwe melding ${newId} - ${newIncident.type} op ${newIncident.location}`, 'Systeem', 'received');
                }

                // Simuleer statusupdates voor bestaande meldingen
                incidents.forEach(inc => {
                    if (inc.status === 'new' && Math.random() < 0.1) {
                        inc.status = 'in-progress';
                        updateLatestUpdates(`Status update ${inc.id}: ${inc.type} is nu in uitvoering.`);
                        addChatMessage(`Systeem: Melding ${inc.id} - status gewijzigd naar 'in uitvoering'.`, 'Systeem', 'received');
                    } else if (inc.status === 'in-progress' && Math.random() < 0.05) {
                        inc.status = 'resolved';
                        updateLatestUpdates(`Status update ${inc.id}: ${inc.type} is opgelost.`);
                        addChatMessage(`Systeem: Melding ${inc.id} - status gewijzigd naar 'opgelost'.`, 'Systeem', 'received');
                    }
                });
                renderIncidents(); // Herteken de lijst na updates
                updateDashboardCounters(); // Update tellers na statuswijzigingen
            }, 5000); // Elke 5 seconden
        }
    };

    const updateDashboardCounters = () => {
        const activeCount = incidents.filter(inc => inc.status === 'new' || inc.status === 'in-progress').length;
        const urgentCount = incidents.filter(inc => ['Brand', 'Medisch Noodgeval', 'Verkeersongeval'].includes(inc.type)).length;
        const availableUnits = Math.floor(Math.random() * 20) + 5; 

        activeIncidentsCount.textContent = activeCount;
        urgentIncidentsCount.textContent = urgentCount;
        availableUnitsCount.textContent = availableUnits;
    };

    const renderIncidents = () => {
        incidentsTableBody.innerHTML = ''; 

        if (incidents.length === 0) {
            incidentsTableBody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Geen meldingen om weer te geven.</td></tr>';
            return;
        }

        incidents.forEach(incident => {
            const row = incidentsTableBody.insertRow();
            row.innerHTML = `
                <td>${incident.id}</td>
                <td>${incident.type}</td>
                <td>${incident.location}</td>
                <td><span class="status-badge ${incident.status}">${incident.status.replace('-', ' ').toUpperCase()}</span></td>
                <td>${incident.time}</td>
                <td><button class="btn btn-sm btn-info" data-id="${incident.id}"><i class="fas fa-info-circle"></i></button></td>
            `;
        });

        incidentsTableBody.querySelectorAll('.btn-info').forEach(button => {
            button.addEventListener('click', (e) => {
                const incidentId = e.currentTarget.dataset.id;
                alert(`Details voor melding ${incidentId} (Dit zou een modale dialoog openen)`);
            });
        });
    };

    const addChatMessage = (message, sender, type = 'received') => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', type, 'card', 'p-2', 'mb-2');
        if (type === 'received') {
            messageDiv.classList.add('bg-light');
        } else {
            messageDiv.classList.add('bg-success', 'text-white'); // Groen voor eigen berichten
        }
        messageDiv.innerHTML = `<span class="sender fw-bold ${type === 'received' ? 'text-primary' : 'text-dark'}">${sender}:</span> ${message}`;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight; 
    };

    sendMessageBtn.addEventListener('click', () => {
        const messageText = chatInput.value.trim();
        if (messageText && currentUser) {
            addChatMessage(messageText, currentUser.name, 'sent');
            chatInput.value = ''; 
        }
    });

    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessageBtn.click();
        }
    });

    const updateLatestUpdates = (update) => {
        const listItem = document.createElement('li');
        listItem.classList.add('list-group-item');
        listItem.textContent = `${new Date().toLocaleTimeString()} - ${update}`;
        latestUpdatesList.prepend(listItem); 
        if (latestUpdatesList.children.length > 5) {
            latestUpdatesList.removeChild(latestUpdatesList.lastChild);
        }
    };

    // --- Admin Paneel Functionaliteit (Placeholder) ---
    document.getElementById('manage-users-btn').addEventListener('click', () => {
        alert('Navigeren naar Gebruikersbeheer (nieuwe pagina of modale dialoog)');
        // Hier zou de logica komen om naar een gebruikersbeheerpagina te gaan
    });

    document.getElementById('manage-content-btn').addEventListener('click', () => {
        alert('Navigeren naar Content Beheer');
    });

    document.getElementById('manage-gms-btn').addEventListener('click', () => {
        alert('Navigeren naar GMS Instellingen');
    });
});