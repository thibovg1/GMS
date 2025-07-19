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
        incidentSpawnChance: 0.3
    };

    // Laad GMS instellingen uit localStorage of gebruik standaardwaarden
    let gmsSettings = JSON.parse(localStorage.getItem('gmsSettings')) || defaultGmsSettings;

    // Functie om GMS instellingen op te slaan
    const saveGmsSettings = () => {
        localStorage.setItem('gmsSettings', JSON.stringify(gmsSettings));
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
            { id: 'M-001', type: 'Brand', location: 'Dorpsstraat 10, Herentals', status: 'new', time: '17:05' },
            { id: 'M-002', type: 'Verkeersongeval', location: 'E313 Afrit 22', status: 'in-progress', time: '17:15' },
            { id: 'M-003', type: 'Medisch Noodgeval', location: 'Koning Albertlaan 5, Geel', status: 'resolved', time: '16:50' },
            { id: 'M-004', type: 'Inbraak', location: 'Stationsplein 1, Lier', status: 'new', time: '17:25' }
        ];

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

            gmsSimulationInterval = setInterval(() => {
                const newIncidentChance = Math.random();
                // Gebruik de instelling voor de kans op nieuwe meldingen
                if (newIncidentChance < gmsSettings.incidentSpawnChance) { 
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
                    incidents.unshift(newIncident); 
                    renderIncidents();
                    updateDashboardCounters();
                    updateLatestUpdates(`Nieuwe melding: ${newIncident.type} op ${newIncident.location}`);
                    addChatMessage(`Systeem: Nieuwe melding ${newId} - ${newIncident.type} op ${newIncident.location}`, 'Systeem', 'received');
                }

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
                renderIncidents(); 
                updateDashboardCounters(); 
            }, 5000); 
        };

        const updateDashboardCounters = () => {
            const activeCount = incidents.filter(inc => inc.status === 'new' || inc.status === 'in-progress').length;
            const urgentCount = incidents.filter(inc => ['Brand', 'Medisch Noodgeval', 'Verkeersongeval'].includes(inc.type)).length;
            // Gebruik de instelling voor het maximaal aantal beschikbare eenheden
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
        const adminPanelSection = document.getElementById('admin-panel');
        const manageUsersBtn = document.getElementById('manage-users-btn');
        const manageGmsBtn = document.getElementById('manage-gms-btn'); // Nieuwe referentie
        
        // Containers voor de verschillende admin modules
        const userManagementContainer = document.createElement('div');
        userManagementContainer.id = 'user-management-container';
        userManagementContainer.classList.add('mt-4', 'd-none'); // Initieel verborgen
        adminPanelSection.appendChild(userManagementContainer);

        const gmsSettingsContainer = document.getElementById('gms-settings-container'); // Bestaande container

        // Formulieren en inputs voor GMS instellingen
        const gmsSettingsForm = document.getElementById('gms-settings-form');
        const maxAvailableUnitsInput = document.getElementById('max-available-units');
        const incidentSpawnChanceInput = document.getElementById('incident-spawn-chance');
        const gmsSettingsSuccessMessage = document.getElementById('gms-settings-success');


        manageUsersBtn.addEventListener('click', () => {
            if (currentUser && currentUser.role === 'admin') {
                userManagementContainer.classList.remove('d-none');
                gmsSettingsContainer.classList.add('d-none'); // Verberg andere module
                renderUserManagement();
            } else {
                alert('U heeft geen toegang tot gebruikersbeheer.');
            }
        });

        manageGmsBtn.addEventListener('click', () => {
            if (currentUser && currentUser.role === 'admin') {
                gmsSettingsContainer.classList.remove('d-none');
                userManagementContainer.classList.add('d-none'); // Verberg andere module
                loadGmsSettingsIntoForm(); // Laad de huidige instellingen in het formulier
            } else {
                alert('U heeft geen toegang tot GMS instellingen.');
            }
        });

        const renderUserManagement = () => {
            userManagementContainer.innerHTML = `
                <h4><i class="fas fa-users me-2"></i> Gebruikers Overzicht</h4>
                <div class="table-responsive">
                    <table class="table table-hover table-striped">
                        <thead class="table-dark">
                            <tr>
                                <th scope="col">Gebruikersnaam</th>
                                <th scope="col">Rol</th>
                                <th scope="col">Status</th>
                                <th scope="col">Acties</th>
                            </tr>
                        </thead>
                        <tbody id="user-table-body">
                            </tbody>
                    </table>
                </div>
            `;
            const userTableBody = document.getElementById('user-table-body');
            
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
            gmsSettingsSuccessMessage.classList.add('d-none'); // Verberg succesbericht
        };

        // Event listener voor GMS instellingen formulier
        gmsSettingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            gmsSettings.maxAvailableUnits = parseInt(maxAvailableUnitsInput.value, 10);
            gmsSettings.incidentSpawnChance = parseFloat(incidentSpawnChanceInput.value);

            // Basic validation
            if (isNaN(gmsSettings.maxAvailableUnits) || gmsSettings.maxAvailableUnits < 1) {
                alert('Aantal beschikbare eenheden moet een positief getal zijn.');
                return;
            }
            if (isNaN(gmsSettings.incidentSpawnChance) || gmsSettings.incidentSpawnChance < 0 || gmsSettings.incidentSpawnChance > 1) {
                alert('Kans op nieuwe melding moet tussen 0.0 en 1.0 liggen.');
                return;
            }

            saveGmsSettings(); // Sla de bijgewerkte instellingen op
            gmsSettingsSuccessMessage.classList.remove('d-none');
            
            // Start de GMS simulatie opnieuw met de nieuwe instellingen
            // Belangrijk: Hierdoor worden de veranderingen meteen van kracht
            initializeGMS(); 

            // Verberg het succesbericht na een paar seconden
            setTimeout(() => {
                gmsSettingsSuccessMessage.classList.add('d-none');
            }, 3000);
        });

        document.getElementById('manage-content-btn').addEventListener('click', () => {
            alert('Navigeren naar Content Beheer');
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