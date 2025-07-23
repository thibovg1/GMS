document.addEventListener('DOMContentLoaded', () => {
    // DOM-elementen
    const userTableBody = document.getElementById('userTableBody');
    const addAdminForm = document.getElementById('addAdminForm');
    const adminMessage = document.getElementById('adminMessage');
    const adminTableBody = document.getElementById('adminTableBody');
    const adminPasswordHeader = document.getElementById('adminPasswordHeader');

    // Logboek elementen
    const logList = document.getElementById('logList');
    const clearLogsButton = document.getElementById('clearLogsButton');

    // Instellingen elementen
    const settingsForm = document.getElementById('settingsForm');
    const appNameInput = document.getElementById('app_name');
    const maxUsersInput = document.getElementById('max_users');
    const maintenanceModeInput = document.getElementById('maintenance_mode');
    const settingsMessage = document.getElementById('settingsMessage');

    const logoutLink = document.getElementById('logoutLink');

    // Constanten
    const ADMIN_TOKEN = 'your_super_secret_admin_token'; // Simulatie van een token

    // Functie om unieke ID's te genereren
    const generateUniqueId = () => {
        return Date.now() + Math.floor(Math.random() * 1000);
    };

    // --- Gesimuleerde Backend met localStorage ---
    const simulatedBackend = {
        // --- Algemene Gebruikers (user + mod + admin + superadmin) opslag ---
        getAllUsers: () => {
            const storedAllUsers = localStorage.getItem('gms_all_users');
            let allUsers = [];

            if (storedAllUsers) {
                allUsers = JSON.parse(storedAllUsers);
            }

            // Zorgt ervoor dat de superadmin altijd bestaat
            const superAdminExists = allUsers.some(user => user.username === 'superadmin' && user.role === 'superadmin');
            if (!superAdminExists) {
                const superAdmin = {
                    id: generateUniqueId(),
                    fullName: 'Super Admin',
                    username: 'superadmin',
                    password: 'adminpassword',
                    role: 'superadmin',
                    email: 'super@admin.com',
                    status: 'approved'
                };
                allUsers.push(superAdmin);
                simulatedBackend.saveAllUsers(allUsers);
            }
            
            return allUsers;
        },
        saveAllUsers: (users) => {
            localStorage.setItem('gms_all_users', JSON.stringify(users));
        },

        // --- Reguliere Gebruikers (alleen users) ---
        getUsers: () => {
            return simulatedBackend.getAllUsers().filter(user => user.role === 'user');
        },
        updateUserStatus: (userId, newStatus, token) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (token !== ADMIN_TOKEN) { return reject({ success: false, message: 'Ongeautoriseerde toegang.' }); }
                    
                    // Alleen superadmin of admin mag user status wijzigen
                    if (loggedInAdmin.role !== 'superadmin' && loggedInAdmin.role !== 'admin') {
                        return reject({ success: false, message: 'Alleen een superadmin of admin kan de status van gebruikers wijzigen.' });
                    }

                    let allUsers = simulatedBackend.getAllUsers();
                    const userIndex = allUsers.findIndex(u => u.id === userId);
                    if (userIndex > -1) {
                        // Zorg ervoor dat de user die je probeert te wijzigen ook daadwerkelijk een 'user' is
                        if (allUsers[userIndex].role !== 'user') {
                            return reject({ success: false, message: 'Kan geen status wijzigen van niet-gebruikersrollen via dit paneel.' });
                        }
                        allUsers[userIndex].status = newStatus;
                        simulatedBackend.saveAllUsers(allUsers);
                        logAdminAction(`Gebruiker ${allUsers[userIndex].username} status gewijzigd naar ${newStatus}`);
                        resolve({ success: true, message: 'Status succesvol bijgewerkt.' });
                    } else {
                        reject({ success: false, message: 'Gebruiker niet gevonden.' });
                    }
                }, 300);
            });
        },

        // --- Admin Beheer (admin, mod, superadmin) ---
        getAdmins: () => {
            return simulatedBackend.getAllUsers().filter(user => user.role === 'admin' || user.role === 'superadmin' || user.role === 'mod');
        },
        addAdmin: (username, password, token) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (token !== ADMIN_TOKEN) { return reject({ success: false, message: 'Ongeautoriseerde toegang.' }); }
                    
                    if (loggedInAdmin.role !== 'superadmin') {
                        return reject({ success: false, message: 'Alleen een superadmin kan nieuwe admins toevoegen.' });
                    }
                    let allUsers = simulatedBackend.getAllUsers();
                    if (allUsers.some(user => user.username === username)) {
                        return reject({ success: false, message: 'Gebruikersnaam bestaat al.' });
                    }

                    const newAdminUser = {
                        id: generateUniqueId(),
                        fullName: `Mod: ${username}`,
                        username: username,
                        email: `${username}@mod.com`,
                        password: password,
                        role: 'mod', // Nieuwe admins via UI zijn standaard 'mod'
                        status: 'approved'
                    };

                    allUsers.push(newAdminUser);
                    simulatedBackend.saveAllUsers(allUsers);
                    logAdminAction(`Nieuwe admin ${username} toegevoegd (rol: mod)`);
                    resolve({ success: true, message: 'Admin succesvol toegevoegd met rol "mod".' });
                }, 300);
            });
        },
        updateAdminRole: (userId, newRole, token) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (token !== ADMIN_TOKEN) { return reject({ success: false, message: 'Ongeautoriseerde toegang.' }); }
                    let allUsers = simulatedBackend.getAllUsers();
                    const userIndex = allUsers.findIndex(u => u.id === userId);
                    if (userIndex > -1) {
                        const targetUser = allUsers[userIndex];
                        
                        // Alleen superadmin mag rollen van anderen wijzigen
                        if (loggedInAdmin.role !== 'superadmin') {
                            return reject({ success: false, message: 'Alleen een superadmin kan de rol van gebruikers wijzigen.' });
                        }
                        // Superadmin kan zijn eigen rol niet wijzigen naar iets anders dan superadmin
                        if (loggedInAdmin.id === targetUser.id && targetUser.role === 'superadmin' && newRole !== 'superadmin') {
                             return reject({ success: false, message: 'De superadmin kan zijn eigen rol niet wijzigen.' });
                        }
                        // Controleer of de nieuwe rol geldig is
                        const validRoles = ['user', 'mod', 'admin', 'superadmin'];
                        if (!validRoles.includes(newRole)) {
                            return reject({ success: false, message: 'Ongeldige rol opgegeven. Kies uit: user, mod, admin, superadmin.' });
                        }
                        // Voorkom het toewijzen van 'user' rol aan bestaande admins/superadmins via de console, tenzij het oorspronkelijk een user was.
                        // We laten het hier flexibel, de superadmin weet wat hij doet.
                        
                        // Log speciale actie voor rolwijziging
                        logAdminAction(`Gebruiker ${targetUser.username} rol gewijzigd van ${targetUser.role} naar ${newRole}`);
                        targetUser.role = newRole;
                        simulatedBackend.saveAllUsers(allUsers);
                        resolve({ success: true, message: 'Rol succesvol bijgewerkt.' });
                    } else {
                        reject({ success: false, message: 'Gebruiker niet gevonden.' });
                    }
                }, 300);
            });
        },
        deleteAdmin: (userId, token) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (token !== ADMIN_TOKEN) { return reject({ success: false, message: 'Ongeautoriseerde toegang.' }); }
                    
                    if (loggedInAdmin.role !== 'superadmin') {
                        return reject({ success: false, message: 'Alleen een superadmin kan admins verwijderen.' });
                    }

                    let allUsers = simulatedBackend.getAllUsers();
                    
                    const adminToDelete = allUsers.find(u => u.id === userId && (u.role === 'admin' || u.role === 'superadmin' || u.role === 'mod'));

                    if (!adminToDelete) { return reject({ success: false, message: 'Admin niet gevonden.' }); }

                    if (adminToDelete.role === 'superadmin') {
                        return reject({ success: false, message: 'De "superadmin" kan niet worden verwijderd.' });
                    }
                    if (loggedInAdmin && adminToDelete.id === loggedInAdmin.id) {
                        return reject({ success: false, message: 'Je kunt jezelf niet verwijderen.' });
                    }
                    
                    allUsers = allUsers.filter(user => user.id !== userId);
                    simulatedBackend.saveAllUsers(allUsers);
                    logAdminAction(`Admin ${adminToDelete.username} verwijderd`);
                    resolve({ success: true, message: 'Admin succesvol verwijderd.' });
                }, 300);
            });
        },

        // --- Logboeken Beheer ---
        getLogs: () => {
            const storedLogs = localStorage.getItem('gms_logs');
            return storedLogs ? JSON.parse(storedLogs) : [];
        },
        addLog: (logEntry) => {
            const logs = simulatedBackend.getLogs();
            logs.push(logEntry);
            localStorage.setItem('gms_logs', JSON.stringify(logs));
        },
        clearLogs: (token) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (token !== ADMIN_TOKEN) { return reject({ success: false, message: 'Ongeautoriseerde toegang.' }); }
                    
                    if (loggedInAdmin.role !== 'superadmin') {
                        return reject({ success: false, message: 'Alleen een superadmin kan de logboeken leegmaken.' });
                    }
                    localStorage.removeItem('gms_logs');
                    logAdminAction(`Logboeken leeggemaakt door ${loggedInAdmin.username}`);
                    resolve({ success: true, message: 'Logboeken succesvol geleegd.' });
                }, 300);
            });
        },

        // --- Instellingen Beheer ---
        getSettings: () => {
            const storedSettings = localStorage.getItem('gms_settings');
            return storedSettings ? JSON.parse(storedSettings) : { appName: 'GMS App', maxUsers: 1000, maintenanceMode: false };
        },
        saveSettings: (settings, token) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (token !== ADMIN_TOKEN) { return reject({ success: false, message: 'Ongeautoriseerde toegang.' }); }
                    
                    if (loggedInAdmin.role !== 'superadmin') {
                        return reject({ success: false, message: 'Alleen een superadmin kan instellingen opslaan.' });
                    }
                    localStorage.setItem('gms_settings', JSON.stringify(settings));
                    logAdminAction(`Instellingen opgeslagen door ${loggedInAdmin.username}`);
                    resolve({ success: true, message: 'Instellingen succesvol opgeslagen.' });
                }, 300);
            });
        }
    };

    // --- Bepaal de 'ingelogde' admin. Haal uit sessionStorage! ---
    const loggedInAdmin = JSON.parse(sessionStorage.getItem('loggedInUser'));

    // Toegangscontrole: Stuur terug als de rol niet voldoende is (alleen mod, admin, superadmin)
    if (!loggedInAdmin || !['mod', 'admin', 'superadmin'].includes(loggedInAdmin.role)) {
        alert('U heeft geen toegang tot dit dashboard. Log in met een bevoegde rol.');
        window.location.href = 'index.html';
        return;
    }
    
    const consoleAdmin = simulatedBackend.getAllUsers().find(user => user.username === 'superadmin' && user.role === 'superadmin');


    // Functie om berichten weer te geven (generiek)
    function showMessage(message, type, element) {
        element.textContent = message;
        element.className = `explanation-note ${type}`;
        element.style.display = 'block';
        setTimeout(() => {
            element.style.display = 'none';
        }, 5000);
    }

    // --- Logboek Functionaliteit ---
    function logAdminAction(action) {
        if (!loggedInAdmin) {
            console.warn("Geen loggedInAdmin gevonden om actie te loggen.");
            return;
        }
        const timestamp = new Date().toLocaleString('nl-NL');
        const logEntry = {
            timestamp: timestamp,
            admin: loggedInAdmin.username, 
            action: action
        };
        simulatedBackend.addLog(logEntry);
        renderLogs();
    }

    function renderLogs() {
        logList.innerHTML = '';
        const logs = simulatedBackend.getLogs();
        if (logs.length === 0) {
            logList.innerHTML = '<li>Geen logboekactiviteit gevonden.</li>';
        } else {
            logs.forEach(log => {
                const li = document.createElement('li');
                li.innerHTML = `<span class="log-timestamp">${log.timestamp}</span><strong>[${log.admin}]</strong> ${log.action}`;
                logList.appendChild(li);
            });
        }
    }

    if (clearLogsButton) {
        clearLogsButton.addEventListener('click', async () => {
            if (loggedInAdmin.role !== 'superadmin') {
                showMessage("Alleen een superadmin kan de logboeken leegmaken.", "error", settingsMessage);
                return;
            }
            if (confirm("Weet u zeker dat u alle logboeken wilt leegmaken? Dit kan niet ongedaan gemaakt worden.")) {
                try {
                    const response = await simulatedBackend.clearLogs(ADMIN_TOKEN);
                    if (response.success) {
                        showMessage(response.message, 'success', settingsMessage);
                        renderLogs();
                    } else {
                        showMessage(response.message, 'error', settingsMessage);
                    }
                } catch (error) {
                    showMessage(`Fout bij leegmaken logboeken: ${error.message || 'Onbekende fout'}`, 'error', settingsMessage);
                    console.error('Fout bij leegmaken logboeken:', error);
                }
            }
        });
    }

    // --- Instellingen Functionaliteit ---
    function renderSettings() {
        const settings = simulatedBackend.getSettings();
        appNameInput.value = settings.appName;
        maxUsersInput.value = settings.maxUsers;
        maintenanceModeInput.checked = settings.maintenanceMode;

        const inputs = settingsForm.querySelectorAll('input, button');
        inputs.forEach(input => {
            if (loggedInAdmin.role !== 'superadmin') {
                input.disabled = true;
            } else {
                input.disabled = false;
            }
        });

        if (loggedInAdmin.role !== 'superadmin') {
            showMessage("Alleen een superadmin kan deze instellingen wijzigen.", "warning", settingsMessage);
        } else {
            settingsMessage.style.display = 'none';
        }
    }

    if (settingsForm) {
        settingsForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            settingsMessage.style.display = 'none';

            if (loggedInAdmin.role !== 'superadmin') {
                showMessage("Alleen een superadmin kan instellingen opslaan.", "error", settingsMessage);
                return;
            }

            const newSettings = {
                appName: appNameInput.value,
                maxUsers: parseInt(maxUsersInput.value),
                maintenanceMode: maintenanceModeInput.checked
            };

            try {
                const response = await simulatedBackend.saveSettings(newSettings, ADMIN_TOKEN);
                if (response.success) {
                    showMessage(response.message, 'success', settingsMessage);
                } else {
                    showMessage(response.message, 'error', settingsMessage);
                }
            } catch (error) {
                showMessage(`Fout bij opslaan instellingen: ${error.message || 'Onbekende fout'}`, 'error', settingsMessage);
                console.error('Fout bij opslaan instellingen:', error);
            }
        });
    }

    // --- Gebruikersbeheer (Users) Functionaliteit ---
    function renderUsers() {
        userTableBody.innerHTML = '';
        const users = simulatedBackend.getUsers().filter(user => user.role === 'user'); 

        const activeUsers = users.filter(user => user.status !== 'rejected');

        if (activeUsers.length === 0) {
            userTableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 20px; color: #777;">Geen gebruikersaccounts gevonden.</td></tr>`;
        }

        activeUsers.forEach(user => {
            const row = userTableBody.insertRow();
            row.dataset.userId = user.id;

            row.insertCell().textContent = user.fullName;
            row.insertCell().textContent = user.username;
            row.insertCell().textContent = user.email;
            row.insertCell().textContent = user.role;

            const statusCell = row.insertCell();
            let statusText = '';
            let statusClass = '';
            switch (user.status) {
                case 'pending': statusText = 'In Afwachting'; statusClass = 'status-pending'; break;
                case 'approved': statusText = 'Goedgekeurd'; statusClass = 'status-approved'; break;
                default: statusText = 'Onbekend'; statusClass = '';
            }
            statusCell.textContent = statusText;
            statusCell.className = statusClass;

            const actionsCell = row.insertCell();
            
            if (user.status !== 'approved' && (loggedInAdmin.role === 'superadmin' || loggedInAdmin.role === 'admin')) {
                const approveButton = document.createElement('button');
                approveButton.textContent = 'Goedkeuren';
                approveButton.className = 'action-button approve-button';
                approveButton.addEventListener('click', () => handleUserAction(user.id, 'approved', user.fullName));
                actionsCell.appendChild(approveButton);
            } else if (user.status !== 'approved' && loggedInAdmin.role === 'mod') {
                actionsCell.textContent = 'Geen acties via UI';
            }

            if (loggedInAdmin.role === 'superadmin' || loggedInAdmin.role === 'admin') {
                const rejectButton = document.createElement('button');
                rejectButton.textContent = 'Afkeuren';
                rejectButton.className = 'action-button reject-button';
                rejectButton.addEventListener('click', () => handleUserAction(user.id, 'rejected', user.fullName));
                actionsCell.appendChild(rejectButton);
            }
            
            if (user.status === 'approved' && (loggedInAdmin.role === 'superadmin' || loggedInAdmin.role === 'admin')) {
                const revokeButton = document.createElement('button');
                revokeButton.textContent = 'Intrekken';
                revokeButton.className = 'action-button revoke-button';
                revokeButton.addEventListener('click', () => handleUserAction(user.id, 'pending', user.fullName));
                actionsCell.appendChild(revokeButton);
            }
        });
    }

    async function handleUserAction(userId, newStatus, userName) {
        if (loggedInAdmin.role !== 'superadmin' && loggedInAdmin.role !== 'admin') {
            showMessage("Alleen een superadmin of admin kan gebruikersstatussen wijzigen.", "error", adminMessage);
            return;
        }

        const adminAuthToken = ADMIN_TOKEN;
        try {
            const response = await simulatedBackend.updateUserStatus(userId, newStatus, adminAuthToken);
            if (response.success) {
                let messageText = `Status van ${userName} gewijzigd naar `;
                let messageType = 'success';
                switch (newStatus) {
                    case 'approved': messageText += 'Goedgekeurd.'; break;
                    case 'rejected': messageText += 'Afgekeurd. Gebruiker is nu uit de lijst verwijderd.'; messageType = 'error'; break;
                    case 'pending': messageText += 'In Afwachting (toegang ingetrokken).'; messageType = 'warning'; break;
                }
                showMessage(messageText, messageType, adminMessage);
                renderUsers();
            } else {
                showMessage(`Fout bij uitvoeren van actie: ${response.message}`, 'error', adminMessage);
            }
        } catch (error) {
            showMessage(`Er is een probleem opgetreden: ${error.message || 'Onbekende fout'}`, 'error', adminMessage);
            console.error('Fout bij het updaten van status:', error);
        }
    }

    // --- Admin Beheer Functionaliteit (Superadmin, Admin, Mod) ---
    function renderAdmins() {
        adminTableBody.innerHTML = '';
        const admins = simulatedBackend.getAllUsers().filter(user => user.role !== 'user');

        if (admins.length === 0) {
            adminTableBody.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: 20px; color: #777;">Geen admins gevonden.</td></tr>`;
        }

        admins.forEach(admin => {
            const row = adminTableBody.insertRow();
            row.dataset.userId = admin.id;

            row.insertCell().textContent = admin.username;
            row.insertCell().textContent = '******';
            row.insertCell().textContent = admin.role;

            const actionsCell = row.insertCell();

            if (admin.role !== 'superadmin' && loggedInAdmin.role === 'superadmin') {
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Verwijderen';
                deleteButton.className = 'action-button reject-button';
                deleteButton.addEventListener('click', () => handleDeleteAdmin(admin.id, admin.username));
                actionsCell.appendChild(deleteButton);
            } else if (admin.role === 'superadmin') {
                actionsCell.textContent = 'Niet bewerkbaar via UI';
            } else if (loggedInAdmin.role !== 'superadmin') {
                actionsCell.textContent = 'Geen acties via UI';
            }
        });
        if (loggedInAdmin.role !== 'superadmin' && adminPasswordHeader) {
            adminPasswordHeader.style.display = 'none';
        } else if (adminPasswordHeader) {
            adminPasswordHeader.style.display = 'table-cell';
        }
    }

    async function handleAddAdmin(username, password) {
        if (loggedInAdmin.role !== 'superadmin') {
            showMessage("Alleen een superadmin kan nieuwe admins toevoegen.", "error", adminMessage);
            return;
        }
        if (password !== document.getElementById('new_admin_confirm_password').value) {
            showMessage("Wachtwoorden komen niet overeen.", "error", adminMessage);
            return;
        }

        try {
            const response = await simulatedBackend.addAdmin(username, password, ADMIN_TOKEN);
            if (response.success) {
                showMessage(response.message, 'success', adminMessage);
                addAdminForm.reset();
                renderAdmins();
            } else {
                showMessage(response.message, 'error', adminMessage);
            }
        } catch (error) {
            showMessage(`Fout bij toevoegen admin: ${error.message || 'Onbekende fout'}`, 'error', adminMessage);
            console.error('Fout bij toevoegen admin:', error);
        }
    }

    async function handleDeleteAdmin(userId, username) {
        if (loggedInAdmin.role !== 'superadmin') {
            showMessage("Alleen een superadmin kan admins verwijderen.", "error", adminMessage);
            return;
        }
        if (confirm(`Weet u zeker dat u admin ${username} wilt verwijderen?`)) {
            try {
                const response = await simulatedBackend.deleteAdmin(userId, ADMIN_TOKEN);
                if (response.success) {
                    showMessage(response.message, 'success', adminMessage);
                    renderAdmins();
                } else {
                    showMessage(response.message, 'error', adminMessage);
                }
            } catch (error) {
                    showMessage(`Fout bij verwijderen admin: ${error.message || 'Onbekende fout'}`, 'error', adminMessage);
                    console.error('Fout bij verwijderen admin:', error);
            }
        }
    }

    // Event listeners
    if (addAdminForm) {
        addAdminForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('new_admin_username').value;
            const password = document.getElementById('new_admin_password').value;
            await handleAddAdmin(username, password);
        });
    }

    if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            sessionStorage.removeItem('loggedInUser');
            window.location.href = 'index.html';
        });
    }

    // Initial render calls
    renderUsers();
    renderAdmins();
    renderLogs();
    renderSettings();

    // Publieke interface voor console commando's
    window.gmsAdmin = {
        updateUserStatus: (userId, newStatus) => {
            if (!consoleAdmin || consoleAdmin.role !== 'superadmin') {
                console.error("Alleen een superadmin kan deze actie via de console uitvoeren.");
                return Promise.reject({ success: false, message: 'Ongeautoriseerde actie.' });
            }
            return simulatedBackend.updateUserStatus(userId, newStatus, ADMIN_TOKEN)
                .then(response => { console.log(response.message); renderUsers(); return response; })
                .catch(error => { console.error('Console update user status failed:', error.message); return { success: false, message: error.message }; });
        },
        // FUNCTIE VOOR HET WIJZIGEN VAN ROLLEN VIA CONSOLE
        updateUserRole: (userId, newRole) => {
            if (!consoleAdmin || consoleAdmin.role !== 'superadmin') {
                console.error("Alleen een superadmin kan de rol van gebruikers wijzigen via de console.");
                return Promise.reject({ success: false, message: 'Ongeautoriseerde actie.' });
            }
            return simulatedBackend.updateAdminRole(userId, newRole, ADMIN_TOKEN) // Hergebruik van updateAdminRole, maar nu voor alle rollen
                .then(response => { 
                    console.log(response.message); 
                    renderUsers(); // Zorg dat gebruikers en admins opnieuw worden gerenderd
                    renderAdmins(); 
                    return response; 
                })
                .catch(error => { 
                    console.error('Console update user role failed:', error.message); 
                    return { success: false, message: error.message }; 
                });
        },
        deleteAdmin: (userId) => {
            if (!consoleAdmin || consoleAdmin.role !== 'superadmin') {
                console.error("Alleen een superadmin kan deze actie via de console uitvoeren.");
                return Promise.reject({ success: false, message: 'Ongeautoriseerde actie.' });
            }
            return simulatedBackend.deleteAdmin(userId, ADMIN_TOKEN)
                .then(response => { console.log(response.message); renderAdmins(); return response; })
                .catch(error => { console.error('Console delete admin failed:', error.message); return { success: false, message: error.message }; });
        },
        saveSettings: (settings) => {
            if (!consoleAdmin || consoleAdmin.role !== 'superadmin') {
                console.error("Alleen een superadmin kan deze actie via de console uitvoeren.");
                return Promise.reject({ success: false, message: 'Ongeautoriseerde actie.' });
            }
            return simulatedBackend.saveSettings(settings, ADMIN_TOKEN)
                .then(response => { console.log(response.message); renderSettings(); return response; })
                .catch(error => { console.error('Console save settings failed:', error.message); return { success: false, message: error.message }; });
        },
        clearLogs: () => {
            if (!consoleAdmin || consoleAdmin.role !== 'superadmin') {
                console.error("Alleen een superadmin kan deze actie via de console uitvoeren.");
                return Promise.reject({ success: false, message: 'Ongeautoriseerde actie.' });
            }
             return simulatedBackend.clearLogs(ADMIN_TOKEN)
                .then(response => { console.log(response.message); renderLogs(); return response; })
                .catch(error => { console.error('Console clear logs failed:', error.message); return { success: false, message: error.message }; });
        },
        getAllUsers: () => {
            return simulatedBackend.getAllUsers();
        }
    };
});