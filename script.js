document.addEventListener('DOMContentLoaded', () => {
    // Definieer de standaard admin-gebruiker en de initiële gebruikerslijst
    const defaultAdminUser = { username: 'admin', password: 'password', role: 'admin', name: 'Beheerder', status: 'approved' };
    
    // Functie om gebruikers uit localStorage te laden
    const loadUsers = () => {
        let users = JSON.parse(localStorage.getItem('intranetUsers')) || [];
        
        // Voeg de standaard admin toe als deze nog niet bestaat
        if (!users.some(u => u.username === defaultAdminUser.username)) {
            users.push(defaultAdminUser);
            localStorage.setItem('intranetUsers', JSON.stringify(users)); // Opslaan na toevoegen admin
        }
        return users;
    };

    let users = loadUsers(); // Laad de gebruikerslijst bij het starten van het script
    let currentUser = null; // Houdt de ingelogde gebruiker bij

    // GMS Standaard Instellingen (als er nog geen zijn opgeslagen)
    const defaultGmsSettings = {
        maxAvailableUnits: 25,
        incidentSpawnChance: 0.3,
        minResponseTime: 60,
        maxResponseTime: 180,
        updateFrequency: 5,
        resolutionChance: 0.05,
        resolvedRetentionTime: 300,
        incidentTypes: [
            { name: 'Brand', urgent: true },
            { name: 'Verkeersongeval', urgent: true },
            { name: 'Medisch Noodgeval', urgent: true },
            { name: 'Inbraak', urgent: false },
            { name: 'Overval', urgent: true },
            { name: 'Wateroverlast', urgent: false },
            { name: 'Natuurbrand', urgent: true }
        ],
        // Nieuw: Uiterlijk instellingen
        primaryColor: '#0d6efd', // Bootstrap primary
        secondaryColor: '#6c757d', // Bootstrap secondary
        textColor: '#212529', // Bootstrap body color
        backgroundImageUrl: '', // Geen standaard achtergrondafbeelding
        fontSizeBase: 16 // Standaard 16px
    };

    // Laad GMS instellingen uit localStorage of gebruik standaardwaarden
    let gmsSettings = JSON.parse(localStorage.getItem('gmsSettings')) || defaultGmsSettings;
    // Zorg ervoor dat alle nieuwe instellingen aanwezig zijn, zelfs als ze nog niet in localStorage stonden
    gmsSettings = { ...defaultGmsSettings, ...gmsSettings };
    // Diepe merge voor incidentTypes, zodat toegevoegde types behouden blijven
    if (localStorage.getItem('gmsSettings')) {
        const storedSettings = JSON.parse(localStorage.getItem('gmsSettings'));
        if (storedSettings.incidentTypes) {
            const mergedIncidentTypes = [...defaultGmsSettings.incidentTypes];
            storedSettings.incidentTypes.forEach(storedType => {
                // Alleen toevoegen als het type nog niet bestaat op basis van naam
                if (!mergedIncidentTypes.some(defaultType => defaultType.name === storedType.name)) {
                    mergedIncidentTypes.push(storedType);
                }
            });
            gmsSettings.incidentTypes = mergedIncidentTypes;
        }
    }


    // Functie om GMS instellingen op te slaan
    const saveGmsSettings = () => {
        localStorage.setItem('gmsSettings', JSON.stringify(gmsSettings));
    };

    // Functie om uiterlijk instellingen toe te passen
    const applyGmsVisualSettings = () => {
        const root = document.documentElement; // De <html> tag
        root.style.setProperty('--bs-primary', gmsSettings.primaryColor);
        root.style.setProperty('--bs-secondary', gmsSettings.secondaryColor);
        root.style.setProperty('--bs-body-color', gmsSettings.textColor);
        root.style.setProperty('font-size', `${gmsSettings.fontSizeBase}px`);

        // Achtergrondafbeelding voor de intranet sectie
        const intranetSection = document.getElementById('intranet-section');
        if (intranetSection) {
            if (gmsSettings.backgroundImageUrl) {
                intranetSection.style.backgroundImage = `url('${gmsSettings.backgroundImageUrl}')`;
                intranetSection.style.backgroundSize = 'cover';
                intranetSection.style.backgroundPosition = 'center';
                intranetSection.style.backgroundAttachment = 'fixed'; // Optioneel: scrollt niet mee
            } else {
                intranetSection.style.backgroundImage = 'none';
            }
        }

        // Optioneel: Update navigatiebalk kleur als deze dynamisch moet zijn
        const navbar = document.querySelector('.navbar');
        if (navbar) {
             navbar.style.backgroundColor = gmsSettings.primaryColor; // Voor een simpele aanpassing
             navbar.classList.remove('navbar-dark', 'bg-primary'); // Verwijder Bootstrap standaardklassen indien nodig
             navbar.style.setProperty('color', gmsSettings.textColor); // Tekstkleur voor navbar
        }
        // Voor de knoppen en andere elementen die Bootstrap variabelen gebruiken,
        // zou je CSS variabelen moeten overschrijven of specifieke klassen maken.
        // Voor deze demo volstaat het aanpassen van de root-variabelen vaak.
    };


    // Check welke pagina we zijn en voer de relevante functionaliteit uit
    if (document.getElementById('login-section')) {
        // We zijn op de login pagina (index.html)
        const loginSection = document.getElementById('login-section');
        const intranetSection = document.getElementById('intranet-section');
        const loginForm = document.getElementById('login-form');
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
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

        // Voorbeeld data voor meldingen (deze blijft lokaal)
        let incidents = [
            { id: 'M-001', type: 'Brand', location: 'Dorpsstraat 10, Herentals', status: 'new', time: '17:05', spawnTime: Date.now() - 30000, urgent: true },
            { id: 'M-002', type: 'Verkeersongeval', location: 'E313 Afrit 22', status: 'in-progress', time: '17:15', spawnTime: Date.now() - 90000, urgent: true },
            { id: 'M-003', type: 'Medisch Noodgeval', location: 'Koning Albertlaan 5, Geel', status: 'resolved', time: '16:50', spawnTime: Date.now() - 120000, urgent: true, resolvedTime: Date.now() - 60000 },
            { id: 'M-004', type: 'Inbraak', location: 'Stationsplein 1, Lier', status: 'new', time: '17:25', spawnTime: Date.now() - 10000, urgent: false }
        ];

        // Pas direct bij laden de visuele instellingen toe
        applyGmsVisualSettings();


        // --- Inlog Functionaliteit ---
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = usernameInput.value;
            const password = passwordInput.value;

            const user = users.find(u => u.username === username && u.password === password);

            if (user) {
                if (user.status === 'approved' || user.role === 'admin') { // Admin heeft altijd toegang, goedgekeurde gebruikers ook
                    currentUser = user;
                    userDisplayName.textContent = currentUser.name;
                    loginSection.classList.add('d-none'); // Verberg login sectie
                    intranetSection.classList.remove('d-none'); // Toon intranet sectie
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

                    // BELANGRIJK: Laad de admin UI's alleen wanneer het admin-paneel wordt getoond
                    // We kunnen dit koppelen aan de klik op de admin-panel nav-link
                    // of direct bij het laden van de pagina als admin is ingelogd
                    if (currentUser.role === 'admin') {
                         loadGmsSettingsIntoForm();
                         renderIncidentTypes();
                         renderUserManagement();
                    }

                } else if (user.status === 'pending') {
                    loginError.textContent = 'Uw account is in afwachting van goedkeuring door een beheerder.';
                    loginError.classList.remove('d-none');
                } else if (user.status === 'rejected') {
                    loginError.textContent = 'Uw account is afgewezen. Neem contact op met de beheerder.';
                    loginError.classList.remove('d-none');
                }
            } else {
                loginError.textContent = 'Ongeldige gebruikersnaam of wachtwoord.';
                loginError.classList.remove('d-none');
            }
        });

        logoutBtn.addEventListener('click', () => {
            currentUser = null;
            intranetSection.classList.add('d-none');
            loginSection.classList.remove('d-none'); // Toon de login sectie
            usernameInput.value = '';
            passwordInput.value = '';
            loginError.classList.add('d-none'); // Verberg eventuele login errors
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
                if (sectionId) { 
                    showSection(sectionId);
                    // Specifieke acties bij het tonen van het admin-paneel
                    if (sectionId === 'admin-panel' && currentUser && currentUser.role === 'admin') {
                        loadGmsSettingsIntoForm();
                        renderIncidentTypes();
                        renderUserManagement();
                    }
                }
            });
        });

        // --- GMS Functionaliteit (ingebouwd) ---
        let gmsSimulationInterval; 

        const initializeGMS = () => {
            // Zorg ervoor dat de simulatie alleen draait als deze nog niet actief is
            if (gmsSimulationInterval) {
                clearInterval(gmsSimulationInterval); // Stop de vorige interval als deze bestaat
            }

            updateDashboardCounters();
            renderIncidents();

            // Gebruik de nieuwe 'updateFrequency' instelling
            gmsSimulationInterval = setInterval(() => {
                const now = Date.now();

                // Kans op nieuwe meldingen
                const newIncidentChance = Math.random();
                if (newIncidentChance < gmsSettings.incidentSpawnChance) { 
                    const newId = `M-${String(incidents.length + 1).padStart(3, '0')}`;
                    // Kies een willekeurig incidenttype uit de gmsSettings
                    const randomTypeObj = gmsSettings.incidentTypes[Math.floor(Math.random() * gmsSettings.incidentTypes.length)];
                    const randomType = randomTypeObj.name;
                    const isUrgent = randomTypeObj.urgent;

                    const locations = [
                        'Hoofdstraat 123', 'Industriepark 7', 'Marktplein 1', 'Schoolstraat 45', 'Ziekenhuislaan 8'
                    ];
                    const randomLocation = locations[Math.floor(Math.random() * locations.length)] + ', Herentals';
                    const newIncident = {
                        id: newId,
                        type: randomType,
                        location: randomLocation,
                        status: 'new',
                        time: new Date().toLocaleTimeString().substring(0, 5),
                        spawnTime: now,
                        urgent: isUrgent
                    };
                    incidents.unshift(newIncident); 
                    renderIncidents();
                    updateDashboardCounters();
                    updateLatestUpdates(`Nieuwe melding: ${newIncident.type} op ${newIncident.location}`);
                    addChatMessage(`Systeem: Nieuwe melding ${newId} - ${newIncident.type} op ${newIncident.location}`, 'Systeem', 'received');
                }

                // Update statussen van bestaande meldingen en verwijder opgeloste meldingen
                const incidentsToRemove = [];
                incidents.forEach(inc => {
                    if (inc.status === 'new') {
                        const timeSinceSpawn = (now - inc.spawnTime) / 1000; // Tijd in seconden
                        if (timeSinceSpawn >= gmsSettings.minResponseTime && Math.random() < 0.2) { 
                            inc.status = 'in-progress';
                            updateLatestUpdates(`Status update ${inc.id}: ${inc.type} is nu in uitvoering.`);
                            addChatMessage(`Systeem: Melding ${inc.id} - status gewijzigd naar 'in uitvoering'.`, 'Systeem', 'received');
                        } else if (timeSinceSpawn >= gmsSettings.maxResponseTime) { 
                            inc.status = 'in-progress';
                            updateLatestUpdates(`Status update ${inc.id}: ${inc.type} is nu in uitvoering (automatisch na responstijd limiet).`);
                            addChatMessage(`Systeem: Melding ${inc.id} - status gewijzigd naar 'in uitvoering'.`, 'Systeem', 'received');
                        }
                    } else if (inc.status === 'in-progress' && Math.random() < gmsSettings.resolutionChance) {
                        inc.status = 'resolved';
                        inc.resolvedTime = now;
                        updateLatestUpdates(`Status update ${inc.id}: ${inc.type} is opgelost.`);
                        addChatMessage(`Systeem: Melding ${inc.id} - status gewijzigd naar 'opgelost'.`, 'Systeem', 'received');
                    } else if (inc.status === 'resolved') {
                        const timeSinceResolved = (now - inc.resolvedTime) / 1000;
                        if (timeSinceResolved >= gmsSettings.resolvedRetentionTime) {
                            incidentsToRemove.push(inc.id);
                        }
                    }
                });

                // Verwijder de incidenten die gemarkeerd zijn om te verwijderen
                incidents = incidents.filter(inc => !incidentsToRemove.includes(inc.id));

                renderIncidents(); 
                updateDashboardCounters(); 
            }, gmsSettings.updateFrequency * 1000); // Interval in milliseconden
        };

        const updateDashboardCounters = () => {
            const activeCount = incidents.filter(inc => inc.status === 'new' || inc.status === 'in-progress').length;
            const urgentCount = incidents.filter(inc => inc.urgent && (inc.status === 'new' || inc.status === 'in-progress')).length; 
            const availableUnits = Math.floor(Math.random() * gmsSettings.maxAvailableUnits) + 5; 

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

            // Sorteer meldingen: Nieuwste eerst, dan 'new', dan 'in-progress', dan 'resolved'
            const sortedIncidents = [...incidents].sort((a, b) => {
                const statusOrder = { 'new': 1, 'in-progress': 2, 'resolved': 3 };
                if (statusOrder[a.status] !== statusOrder[b.status]) {
                    return statusOrder[a.status] - statusOrder[b.status];
                }
                return b.spawnTime - a.spawnTime;
            });

            sortedIncidents.forEach(incident => {
                const row = incidentsTableBody.insertRow();
                // Voeg een klasse toe voor urgente meldingen
                if (incident.urgent) {
                    row.classList.add('table-danger'); // Bootstrap klasse voor rode rij
                }
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
                messageDiv.classList.add('bg-success', 'text-white'); 
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

        // --- Admin Paneel Functionaliteit ---
        // We verwijderen de knoppen om te wisselen tussen de admin modules,
        // en zorgen ervoor dat ze direct geladen en zichtbaar zijn.
        // const manageUsersBtn = document.getElementById('manage-users-btn'); // Niet meer nodig
        // const manageGmsBtn = document.getElementById('manage-gms-btn');     // Niet meer nodig
        
        // Containers voor de verschillende admin modules
        const userManagementContainer = document.getElementById('user-management-container');
        const gmsSettingsContainer = document.getElementById('gms-settings-container'); 

        // Formulieren en inputs voor GMS instellingen
        const gmsSettingsForm = document.getElementById('gms-settings-form');
        const maxAvailableUnitsInput = document.getElementById('max-available-units');
        const incidentSpawnChanceInput = document.getElementById('incident-spawn-chance');
        const minResponseTimeInput = document.getElementById('min-response-time');
        const maxResponseTimeInput = document.getElementById('max-response-time');
        const updateFrequencyInput = document.getElementById('update-frequency');
        const resolutionChanceInput = document.getElementById('resolution-chance');
        const resolvedRetentionTimeInput = document.getElementById('resolved-retention-time');
        const gmsSettingsSuccessMessage = document.getElementById('gms-settings-success');

        // Nieuwe elementen voor incident types
        const incidentTypesList = document.getElementById('incident-types-list');
        const newIncidentTypeNameInput = document.getElementById('new-incident-type-name');
        const newIncidentTypeUrgentCheckbox = document.getElementById('new-incident-type-urgent');
        const addIncidentTypeBtn = document.getElementById('add-incident-type-btn');

        // Nieuwe elementen voor uiterlijk instellingen
        const primaryColorInput = document.getElementById('primary-color');
        const secondaryColorInput = document.getElementById('secondary-color');
        const textColorInput = document.getElementById('text-color');
        const backgroundImageUrlInput = document.getElementById('background-image-url');
        const fontSizeBaseInput = document.getElementById('font-size-base');

        // Deze knoppen zijn nu overbodig omdat de secties direct zichtbaar zijn
        // manageUsersBtn.addEventListener('click', () => { ... });
        // manageGmsBtn.addEventListener('click', () => { ... });


        const renderUserManagement = () => {
            // Zorg dat de container leeg is voor het opnieuw renderen
            userManagementContainer.querySelector('#user-table-body').innerHTML = ''; 
            const userTableBody = userManagementContainer.querySelector('#user-table-body');
            
            // Reload users to get the latest state from localStorage
            users = loadUsers(); 

            users.forEach(user => {
                // Sla de standaard admin-gebruiker over in de lijst om te bewerken
                if (user.username === defaultAdminUser.username) {
                    const row = userTableBody.insertRow();
                    row.innerHTML = `
                        <td>${user.name} (Admin)</td>
                        <td>${user.role}</td>
                        <td>${user.status}</td>
                        <td>N.v.t.</td> 
                    `;
                    return;
                }

                const row = userTableBody.insertRow();
                const statusOptions = ['pending', 'approved', 'rejected'].map(s => 
                    `<option value="${s}" ${user.status === s ? 'selected' : ''}>${s.toUpperCase()}</option>`
                ).join('');

                const roleOptions = ['user', 'centralist', 'admin'].map(r => 
                    `<option value="${r}" ${user.role === r ? 'selected' : ''}>${r.toUpperCase()}</option>`
                ).join('');

                row.innerHTML = `
                    <td>${user.username}</td>
                    <td>
                        <select class="form-select user-role-select" data-username="${user.username}">
                            ${roleOptions}
                        </select>
                    </td>
                    <td>
                        <select class="form-select user-status-select" data-username="${user.username}">
                            ${statusOptions}
                        </select>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-danger delete-user-btn" data-username="${user.username}"><i class="fas fa-trash-alt"></i> Verwijder</button>
                    </td>
                `;
            });

            // Event listeners voor status wijzigingen
            userManagementContainer.querySelectorAll('.user-status-select').forEach(select => {
                select.addEventListener('change', (e) => {
                    const usernameToUpdate = e.target.dataset.username;
                    const newStatus = e.target.value;
                    const userIndex = users.findIndex(u => u.username === usernameToUpdate);
                    if (userIndex !== -1) {
                        users[userIndex].status = newStatus;
                        localStorage.setItem('intranetUsers', JSON.stringify(users));
                        alert(`Status van ${usernameToUpdate} is gewijzigd naar ${newStatus}.`);
                    }
                });
            });

            // Event listeners voor rol wijzigingen
            userManagementContainer.querySelectorAll('.user-role-select').forEach(select => {
                select.addEventListener('change', (e) => {
                    const usernameToUpdate = e.target.dataset.username;
                    const newRole = e.target.value;
                    const userIndex = users.findIndex(u => u.username === usernameToUpdate);
                    if (userIndex !== -1) {
                        users[userIndex].role = newRole;
                        localStorage.setItem('intranetUsers', JSON.stringify(users));
                        alert(`Rol van ${usernameToUpdate} is gewijzigd naar ${newRole}.`);
                    }
                });
            });

            // Event listeners voor verwijderen
            userManagementContainer.querySelectorAll('.delete-user-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const usernameToDelete = e.target.dataset.username;
                    if (confirm(`Weet u zeker dat u gebruiker ${usernameToDelete} wilt verwijderen?`)) {
                        users = users.filter(u => u.username !== usernameToDelete);
                        localStorage.setItem('intranetUsers', JSON.stringify(users));
                        renderUserManagement(); // Herteken de tabel
                        alert(`Gebruiker ${usernameToDelete} is verwijderd.`);
                    }
                });
            });
        };

        // Functie om GMS instellingen in het formulier te laden
        const loadGmsSettingsIntoForm = () => {
            maxAvailableUnitsInput.value = gmsSettings.maxAvailableUnits;
            incidentSpawnChanceInput.value = gmsSettings.incidentSpawnChance;
            minResponseTimeInput.value = gmsSettings.minResponseTime;
            maxResponseTimeInput.value = gmsSettings.maxResponseTime;
            updateFrequencyInput.value = gmsSettings.updateFrequency;
            resolutionChanceInput.value = gmsSettings.resolutionChance;
            resolvedRetentionTimeInput.value = gmsSettings.resolvedRetentionTime;
            
            // Laad uiterlijk instellingen
            primaryColorInput.value = gmsSettings.primaryColor;
            secondaryColorInput.value = gmsSettings.secondaryColor;
            textColorInput.value = gmsSettings.textColor;
            backgroundImageUrlInput.value = gmsSettings.backgroundImageUrl;
            fontSizeBaseInput.value = gmsSettings.fontSizeBase;

            gmsSettingsSuccessMessage.classList.add('d-none'); // Verberg succesbericht
        };

        // Functie om incident types te renderen in het admin paneel
        const renderIncidentTypes = () => {
            incidentTypesList.innerHTML = '';
            gmsSettings.incidentTypes.forEach((type, index) => {
                const typeDiv = document.createElement('div');
                typeDiv.classList.add('input-group', 'mb-2');
                typeDiv.innerHTML = `
                    <input type="text" class="form-control incident-type-name" value="${type.name}" data-index="${index}" disabled>
                    <div class="input-group-text">
                        <input class="form-check-input mt-0 incident-type-urgent" type="checkbox" ${type.urgent ? 'checked' : ''} data-index="${index}" aria-label="Incident type is standaard urgent">
                        <label class="form-check-label ms-2">Urgent</label>
                    </div>
                    <button class="btn btn-outline-danger remove-incident-type-btn" type="button" data-index="${index}"><i class="fas fa-minus me-1"></i> Verwijder</button>
                `;
                incidentTypesList.appendChild(typeDiv);
            });

            // Event listeners voor wijzigen urgentie
            incidentTypesList.querySelectorAll('.incident-type-urgent').forEach(checkbox => {
                checkbox.addEventListener('change', (e) => {
                    const index = parseInt(e.target.dataset.index, 10);
                    gmsSettings.incidentTypes[index].urgent = e.target.checked;
                    // Opslaan gebeurt bij formulier submit
                });
            });

            // Event listeners voor verwijderen
            incidentTypesList.querySelectorAll('.remove-incident-type-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const index = parseInt(e.target.dataset.index, 10);
                    if (confirm(`Weet u zeker dat u het incident type "${gmsSettings.incidentTypes[index].name}" wilt verwijderen?`)) {
                        gmsSettings.incidentTypes.splice(index, 1);
                        renderIncidentTypes(); // Herteken de lijst
                        // Opslaan gebeurt bij formulier submit
                    }
                });
            });
        };

        // Event listener voor toevoegen incident type
        addIncidentTypeBtn.addEventListener('click', () => {
            const name = newIncidentTypeNameInput.value.trim();
            const urgent = newIncidentTypeUrgentCheckbox.checked;

            if (name === '') {
                alert('Voer een naam in voor het nieuwe incident type.');
                return;
            }
            if (gmsSettings.incidentTypes.some(type => type.name.toLowerCase() === name.toLowerCase())) {
                alert(`Het incident type "${name}" bestaat al.`);
                return;
            }

            gmsSettings.incidentTypes.push({ name: name, urgent: urgent });
            newIncidentTypeNameInput.value = '';
            newIncidentTypeUrgentCheckbox.checked = false;
            renderIncidentTypes(); // Herteken de lijst
            // Opslaan gebeurt bij formulier submit
        });


        // Event listener voor GMS instellingen formulier
        gmsSettingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Save simulation settings
            gmsSettings.maxAvailableUnits = parseInt(maxAvailableUnitsInput.value, 10);
            gmsSettings.incidentSpawnChance = parseFloat(incidentSpawnChanceInput.value);
            gmsSettings.minResponseTime = parseInt(minResponseTimeInput.value, 10);
            gmsSettings.maxResponseTime = parseInt(maxResponseTimeInput.value, 10);
            gmsSettings.updateFrequency = parseInt(updateFrequencyInput.value, 10);
            gmsSettings.resolutionChance = parseFloat(resolutionChanceInput.value);
            gmsSettings.resolvedRetentionTime = parseInt(resolvedRetentionTimeInput.value, 10);

            // Save visual settings
            gmsSettings.primaryColor = primaryColorInput.value;
            gmsSettings.secondaryColor = secondaryColorInput.value;
            gmsSettings.textColor = textColorInput.value;
            gmsSettings.backgroundImageUrl = backgroundImageUrlInput.value;
            gmsSettings.fontSizeBase = parseInt(fontSizeBaseInput.value, 10);

            // Basic validation for simulation settings (already covered in previous steps)
            if (isNaN(gmsSettings.maxAvailableUnits) || gmsSettings.maxAvailableUnits < 1) {
                alert('Aantal beschikbare eenheden moet een positief getal zijn.');
                return;
            }
            if (isNaN(gmsSettings.incidentSpawnChance) || gmsSettings.incidentSpawnChance < 0 || gmsSettings.incidentSpawnChance > 1) {
                alert('Kans op nieuwe melding moet tussen 0.0 en 1.0 liggen.');
                return;
            }
            if (isNaN(gmsSettings.minResponseTime) || gmsSettings.minResponseTime < 5) {
                alert('Minimale responstijd moet minimaal 5 seconden zijn.');
                return;
            }
            if (isNaN(gmsSettings.maxResponseTime) || gmsSettings.maxResponseTime < gmsSettings.minResponseTime) {
                alert('Maximale responstijd moet groter of gelijk zijn aan de minimale responstijd.');
                return;
            }
            if (isNaN(gmsSettings.updateFrequency) || gmsSettings.updateFrequency < 1) {
                alert('Update frequentie moet minimaal 1 seconde zijn.');
                return;
            }
            if (isNaN(gmsSettings.resolutionChance) || gmsSettings.resolutionChance < 0 || gmsSettings.resolutionChance > 1) {
                alert('Kans dat melding opgelost wordt, moet tussen 0.0 en 1.0 liggen.');
                return;
            }
            if (isNaN(gmsSettings.resolvedRetentionTime) || gmsSettings.resolvedRetentionTime < 0) {
                alert('Tijd dat opgeloste meldingen zichtbaar blijven moet een positief getal zijn.');
                return;
            }
            if (gmsSettings.incidentTypes.length === 0) {
                alert('Voeg ten minste één incident type toe.');
                return;
            }

            // Basic validation for visual settings
            // Geen strikte validatie voor kleuren/URL hier, browser zal ongeldige waarden negeren.
            if (isNaN(gmsSettings.fontSizeBase) || gmsSettings.fontSizeBase < 10 || gmsSettings.fontSizeBase > 24) {
                alert('Basis lettergrootte moet tussen 10 en 24 pixels liggen.');
                return;
            }


            saveGmsSettings(); // Sla de bijgewerkte instellingen op
            applyGmsVisualSettings(); // Pas de nieuwe visuele instellingen toe
            gmsSettingsSuccessMessage.classList.remove('d-none');
            
            // Start de GMS simulatie opnieuw met de nieuwe instellingen
            initializeGMS(); 

            // Verberg het succesbericht na een paar seconden
            setTimeout(() => {
                gmsSettingsSuccessMessage.classList.add('d-none');
            }, 3000);
        });

        // De "Content Beheer" knop blijft bestaan, maar de functionaliteit is nog niet ingebouwd
        document.getElementById('manage-content-btn').addEventListener('click', () => {
            alert('Navigeren naar Content Beheer - Functionaliteit nog niet geïmplementeerd.');
        });


    } else if (document.getElementById('register-section')) {
        // We zijn op de registratie pagina (register.html)
        const registerForm = document.getElementById('register-form');
        const registerUsernameInput = document.getElementById('register-username');
        const registerPasswordInput = document.getElementById('register-password');
        const confirmPasswordInput = document.getElementById('confirm-password');
        const registerError = document.getElementById('register-error');
        const registerSuccess = document.getElementById('register-success');

        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = registerUsernameInput.value.trim();
            const password = registerPasswordInput.value;
            const confirmPassword = confirmPasswordInput.value;

            registerError.classList.add('d-none');
            registerSuccess.classList.add('d-none');

            // Validatie
            if (username.length < 3) {
                registerError.textContent = 'Gebruikersnaam moet minimaal 3 karakters bevatten.';
                registerError.classList.remove('d-none');
                return;
            }
            if (password.length < 6) {
                registerError.textContent = 'Wachtwoord moet minimaal 6 karakters bevatten.';
                registerError.classList.remove('d-none');
                return;
            }
            if (password !== confirmPassword) {
                registerError.textContent = 'Wachtwoorden komen niet overeen.';
                registerError.classList.remove('d-none');
                return;
            }

            // Gebruik localStorage voor DEMO doeleinden
            // In een echt systeem: API-call naar backend om gebruiker te registreren in een database
            let users = loadUsers(); // Haal de meest recente lijst op
            if (users.some(u => u.username === username)) {
                registerError.textContent = 'Deze gebruikersnaam is al in gebruik.';
                registerError.classList.remove('d-none');
                return;
            }

            // Nieuwe gebruiker krijgt de status 'pending'
            const newUser = { username: username, password: password, role: 'user', name: username, status: 'pending' };
            users.push(newUser);
            localStorage.setItem('intranetUsers', JSON.stringify(users)); // Opslaan in localStorage

            registerSuccess.textContent = 'Registratie succesvol! Uw account is aangemaakt en wacht op goedkeuring door een beheerder. U kunt pas inloggen nadat uw account is goedgekeurd.';
            registerSuccess.classList.remove('d-none');

            // Maak de registratievelden leeg
            registerUsernameInput.value = '';
            registerPasswordInput.value = '';
            confirmPasswordInput.value = '';
        });
    }
});