document.addEventListener('DOMContentLoaded', () => {
    console.log("Admin Dashboard Script: DOMContentLoaded");

    const adminUsernameDisplay = document.getElementById('adminUsernameDisplay');
    const adminRoleDisplay = document.getElementById('adminRoleDisplay');
    const logoutLink = document.getElementById('logoutLink');
    const userTableBody = document.querySelector('#userTable tbody');
    const adminTableBody = document.querySelector('#adminTable tbody');
    const logTableBody = document.querySelector('#logTable tbody');
    const addAdminModal = document.getElementById('addAdminModal');
    const closeButton = document.querySelector('#addAdminModal .close-button');
    const addAdminButton = document.getElementById('addAdminButton');
    const addAdminForm = document.getElementById('addAdminForm');
    const addAdminMessage = document.getElementById('addAdminMessage');
    const newAdminFullName = document.getElementById('newAdminFullName');
    const newAdminUsername = document.getElementById('newAdminUsername');
    const newAdminEmail = document.getElementById('newAdminEmail');
    const newAdminPassword = document.getElementById('newAdminPassword');
    const newAdminRole = document.getElementById('newAdminRole');

    // Haal de ingelogde admin op uit sessionStorage
    let loggedInAdmin = JSON.parse(sessionStorage.getItem('loggedInAdmin'));
    console.log("Admin Dashboard Script: loggedInAdmin:", loggedInAdmin);

    // --- Admin Toegangscontrole ---
    function checkAdminAccess() {
        if (!loggedInAdmin || (loggedInAdmin.role !== 'admin' && loggedInAdmin.role !== 'superadmin')) {
            alert('Geen toegang: U bent niet geautoriseerd om dit dashboard te bekijken.');
            console.warn("Admin Dashboard: Toegang geweigerd. Geen geldige admin rol of niet ingelogd.");
            window.location.href = 'admin_login.html'; // Zorg dat dit de correcte loginpagina is
            return false;
        }
        console.log("Admin Dashboard: Toegang verleend voor", loggedInAdmin.username, "met rol", loggedInAdmin.role);
        return true;
    }

    if (!checkAdminAccess()) {
        return; // Stop verdere uitvoering als er geen toegang is
    }

    // Update de weergegeven admin info
    if (adminUsernameDisplay) adminUsernameDisplay.textContent = loggedInAdmin.username;
    if (adminRoleDisplay) adminRoleDisplay.textContent = loggedInAdmin.role;

    // Beheer zichtbaarheid van admin-specifieke elementen voor superadmin
    if (loggedInAdmin.role !== 'superadmin') {
        const adminManagementSection = document.getElementById('admin-management-section');
        if (adminManagementSection) {
            adminManagementSection.style.display = 'none';
            console.log("Admin Dashboard: Admin management sectie verborgen voor niet-superadmin.");
        }
        if (newAdminRole) {
            const superAdminOption = newAdminRole.querySelector('option[value="superadmin"]');
            if (superAdminOption) {
                superAdminOption.remove();
                console.log("Admin Dashboard: Superadmin optie verwijderd uit rolselectie voor niet-superadmin.");
            }
        }
        if (addAdminButton) {
            addAdminButton.style.display = 'none';
            console.log("Admin Dashboard: Add Admin knop verborgen voor niet-superadmin.");
        }
    }

    // --- Gesimuleerde Backend Functies ---
    // Gebruik een robuuste ID-generator om conflicten te minimaliseren
    const generateUniqueId = () => {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    };

    const simulatedBackend = {
        // Haalt alle gebruikers op en garandeert dat de superadmin bestaat
        getAllUsers: () => {
            const storedAllUsers = localStorage.getItem('gms_all_users');
            let allUsers = [];

            if (storedAllUsers) {
                try {
                    allUsers = JSON.parse(storedAllUsers);
                } catch (e) {
                    console.error("Fout bij parsen van gms_all_users uit localStorage, resetten:", e);
                    allUsers = []; // Reset als parse mislukt, voorkomt verdere fouten
                }
            }
            console.log("Admin Dashboard: Huidige gebruikers in localStorage (voor superadmin check):", allUsers);

            // Superadmin definitie
            const SUPERADMIN_USERNAME = 'superadmin';
            const SUPERADMIN_PASSWORD = 'adminpassword'; // DIT IS HET WACHTWOORD

            const superAdminExists = allUsers.some(user => user.username === SUPERADMIN_USERNAME && user.role === 'superadmin');
            if (!superAdminExists) {
                console.warn("Superadmin niet gevonden, aanmaken...");
                const superAdmin = {
                    id: generateUniqueId(),
                    fullName: 'Super Administrator',
                    username: SUPERADMIN_USERNAME,
                    password: SUPERADMIN_PASSWORD,
                    role: 'superadmin',
                    email: 'superadmin@example.com',
                    status: 'approved'
                };
                allUsers.push(superAdmin);
                simulatedBackend.saveAllUsers(allUsers); // Sla direct op na toevoegen
                simulatedBackend.logAction(`Systeem: Superadmin (${SUPERADMIN_USERNAME}) automatisch aangemaakt.`);
                console.log("Superadmin aangemaakt en opgeslagen:", superAdmin);
            } else {
                // Controleer of de bestaande superadmin de juiste password en role heeft
                const existingSuperAdmin = allUsers.find(user => user.username === SUPERADMIN_USERNAME);
                if (existingSuperAdmin && (existingSuperAdmin.password !== SUPERADMIN_PASSWORD || existingSuperAdmin.role !== 'superadmin')) {
                    console.warn("Bestaande superadmin heeft onjuiste wachtwoord of rol, bijwerken...");
                    existingSuperAdmin.password = SUPERADMIN_PASSWORD;
                    existingSuperAdmin.role = 'superadmin';
                    simulatedBackend.saveAllUsers(allUsers); // Opslaan na bijwerken
                    simulatedBackend.logAction(`Systeem: Superadmin (${SUPERADMIN_USERNAME}) gegevens bijgewerkt.`);
                }
            }
            return allUsers;
        },
        // Slaat alle gebruikers op naar localStorage
        saveAllUsers: (users) => {
            try {
                localStorage.setItem('gms_all_users', JSON.stringify(users));
                console.log("Admin Dashboard: Gebruikers succesvol opgeslagen in localStorage.");
            } catch (e) {
                console.error("Fout bij opslaan van gms_all_users naar localStorage:", e);
            }
        },
        // Haalt logboekitems op
        getLogs: () => {
            const storedLogs = localStorage.getItem('gms_admin_logs');
            if (storedLogs) {
                try {
                    return JSON.parse(storedLogs);
                } catch (e) {
                    console.error("Fout bij parsen van gms_admin_logs uit localStorage, resetten:", e);
                    return [];
                }
            }
            return [];
        },
        // Voegt een logboekitem toe
        logAction: (action) => {
            const logs = simulatedBackend.getLogs();
            const timestamp = new Date().toLocaleString('nl-BE');
            logs.push({ timestamp, action });
            try {
                localStorage.setItem('gms_admin_logs', JSON.stringify(logs));
                console.log("Admin Dashboard: Log actie toegevoegd:", action);
            } catch (e) {
                console.error("Fout bij opslaan van gms_admin_logs naar localStorage:", e);
            }
        },
        // Werkt gebruikersstatus bij
        updateUserStatus: (userId, newStatus) => {
            return new Promise((resolve) => {
                setTimeout(() => { // Simulatie van netwerkvertraging
                    let users = simulatedBackend.getAllUsers(); // Haal de meest recente lijst op
                    const userIndex = users.findIndex(u => u.id === userId);
                    if (userIndex !== -1) {
                        const updatedUser = users[userIndex];
                        updatedUser.status = newStatus;
                        simulatedBackend.saveAllUsers(users);
                        simulatedBackend.logAction(`${loggedInAdmin.username} heeft status van ${updatedUser.username} (ID: ${userId}) bijgewerkt naar ${newStatus}.`);
                        resolve({ success: true, message: `Gebruiker ${updatedUser.username} status bijgewerkt naar ${newStatus}.` });
                    } else {
                        console.error("Admin Dashboard: Gebruiker niet gevonden voor statusupdate:", userId);
                        resolve({ success: false, message: 'Gebruiker niet gevonden.' });
                    }
                }, 300);
            });
        },
        // Verwijdert een gebruiker (of admin)
        deleteUser: (userId) => {
            return new Promise((resolve) => {
                setTimeout(() => { // Simulatie van netwerkvertraging
                    let users = simulatedBackend.getAllUsers(); // Haal de meest recente lijst op
                    const userToDelete = users.find(u => u.id === userId);

                    if (!userToDelete) {
                        console.error("Admin Dashboard: Gebruiker niet gevonden voor verwijdering:", userId);
                        return resolve({ success: false, message: 'Gebruiker niet gevonden.' });
                    }

                    // Voorkom verwijdering van de superadmin als het de enige is
                    if (userToDelete.role === 'superadmin') {
                        const allSuperAdmins = users.filter(u => u.role === 'superadmin');
                        if (allSuperAdmins.length === 1 && userToDelete.username === 'superadmin') { // Specifieke check voor de hardcoded superadmin
                            console.warn("Admin Dashboard: Poging tot verwijdering van enige superadmin geblokkeerd.");
                            return resolve({ success: false, message: 'Kan de enige superadmin niet verwijderen.' });
                        }
                    }
                    // Voorkom dat de ingelogde admin zichzelf kan verwijderen via dit dashboard
                    if (userToDelete.id === loggedInAdmin.id) {
                         console.warn("Admin Dashboard: Poging tot zelfverwijdering geblokkeerd.");
                         return resolve({ success: false, message: 'U kunt uw eigen account niet verwijderen via dit dashboard.' });
                    }

                    const initialLength = users.length;
                    users = users.filter(u => u.id !== userId);
                    if (users.length < initialLength) {
                        simulatedBackend.saveAllUsers(users);
                        simulatedBackend.logAction(`${loggedInAdmin.username} heeft gebruiker ${userToDelete.username} (ID: ${userId}) verwijderd.`);
                        resolve({ success: true, message: 'Gebruiker succesvol verwijderd.' });
                    } else {
                        // Dit geval zou niet moeten optreden als userToDelete is gevonden
                        console.error("Admin Dashboard: Gebruiker wel gevonden maar niet gefilterd:", userId);
                        resolve({ success: false, message: 'Fout bij verwijderen van gebruiker.' });
                    }
                }, 300);
            });
        },
        // Voegt een nieuwe admin toe
        addNewAdmin: (fullName, username, email, password, role) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => { // Simulatie van netwerkvertraging
                    let users = simulatedBackend.getAllUsers(); // Haal de meest recente lijst op
                    if (users.some(u => u.username === username)) {
                        console.warn("Admin Dashboard: Nieuwe admin faalt, gebruikersnaam bestaat al:", username);
                        return reject({ success: false, message: 'Gebruikersnaam bestaat al.' });
                    }
                    if (users.some(u => u.email === email)) {
                        console.warn("Admin Dashboard: Nieuwe admin faalt, e-mailadres bestaat al:", email);
                        return reject({ success: false, message: 'E-mailadres is al geregistreerd.' });
                    }

                    const newAdmin = {
                        id: generateUniqueId(),
                        fullName,
                        username,
                        email,
                        password, // LET OP: wachtwoord wordt hier in plaintext opgeslagen (alleen voor simulatie)
                        role: role,
                        status: 'approved' // Nieuwe admins zijn direct goedgekeurd
                    };
                    users.push(newAdmin);
                    simulatedBackend.saveAllUsers(users);
                    simulatedBackend.logAction(`${loggedInAdmin.username} heeft nieuwe admin ${newAdmin.username} (${newAdmin.role}) toegevoegd.`);
                    console.log("Admin Dashboard: Nieuwe admin succesvol toegevoegd:", newAdmin);
                    resolve({ success: true, message: 'Nieuwe admin succesvol toegevoegd.' });
                }, 500);
            });
        }
    };
    // --- Einde Gesimuleerde Backend Functies ---

    // --- Render Functies ---
    function renderUserTable() {
        console.log("Admin Dashboard: Rendering user table...");
        userTableBody.innerHTML = '';
        // Haal gebruikers op die de rol 'user' hebben
        const users = simulatedBackend.getAllUsers().filter(user => user.role === 'user');
        console.log("Admin Dashboard: Gevonden gebruikers voor tabel:", users);

        if (users.length === 0) {
            const row = userTableBody.insertRow();
            const cell = row.insertCell();
            cell.colSpan = 7;
            cell.textContent = 'Geen geregistreerde gebruikers gevonden.';
            cell.style.textAlign = 'center';
            cell.style.fontStyle = 'italic';
            return;
        }

        users.forEach(user => {
            const row = userTableBody.insertRow();
            row.insertCell().textContent = user.id;
            row.insertCell().textContent = user.fullName;
            row.insertCell().textContent = user.username;
            row.insertCell().textContent = user.email;
            row.insertCell().textContent = user.role;
            row.insertCell().textContent = user.status;

            const actionCell = row.insertCell();
            actionCell.className = 'action-buttons';

            // Alleen superadmins en normale admins kunnen gebruikers beheren
            if (loggedInAdmin.role === 'superadmin' || loggedInAdmin.role === 'admin') {
                if (user.status === 'pending') {
                    const approveButton = document.createElement('button');
                    approveButton.textContent = 'Goedkeuren';
                    approveButton.className = 'approve-button';
                    approveButton.onclick = () => handleUserAction(user.id, 'approve');
                    actionCell.appendChild(approveButton);

                    const rejectButton = document.createElement('button');
                    rejectButton.textContent = 'Afwijzen';
                    rejectButton.className = 'reject-button';
                    rejectButton.onclick = () => handleUserAction(user.id, 'reject');
                    actionCell.appendChild(rejectButton);
                } else { // Voor goedgekeurde of afgewezen gebruikers
                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Verwijderen';
                    deleteButton.className = 'delete-button';
                    deleteButton.onclick = () => handleUserAction(user.id, 'delete');
                    actionCell.appendChild(deleteButton);
                }
            } else {
                const span = document.createElement('span');
                span.textContent = 'Geen acties';
                span.style.color = '#aaa';
                actionCell.appendChild(span);
            }
        });
    }

    function renderAdminTable() {
        console.log("Admin Dashboard: Rendering admin table...");
        adminTableBody.innerHTML = '';
        // Haal gebruikers op die de rol 'admin' of 'superadmin' hebben
        const admins = simulatedBackend.getAllUsers().filter(user => user.role === 'admin' || user.role === 'superadmin');
        console.log("Admin Dashboard: Gevonden admins voor tabel:", admins);

        if (admins.length === 0) {
            const row = adminTableBody.insertRow();
            const cell = row.insertCell();
            cell.colSpan = 6;
            cell.textContent = 'Geen admin-accounts gevonden (controleer superadmin initialisatie).';
            cell.style.textAlign = 'center';
            cell.style.fontStyle = 'italic';
            return;
        }

        admins.forEach(admin => {
            const row = adminTableBody.insertRow();
            row.insertCell().textContent = admin.id;
            row.insertCell().textContent = admin.fullName;
            row.insertCell().textContent = admin.username;
            row.insertCell().textContent = admin.email;
            row.insertCell().textContent = admin.role;

            const actionCell = row.insertCell();
            actionCell.className = 'action-buttons';

            // Alleen superadmins kunnen andere admins verwijderen
            if (loggedInAdmin.role === 'superadmin') {
                // Voorkom verwijdering van de ingelogde superadmin of de enige superadmin
                const allSuperAdmins = admins.filter(a => a.role === 'superadmin');
                const canDelete = admin.id !== loggedInAdmin.id && !(admin.role === 'superadmin' && allSuperAdmins.length === 1);

                if (canDelete) {
                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Verwijderen';
                    deleteButton.className = 'delete-button';
                    deleteButton.onclick = () => handleUserAction(admin.id, 'deleteAdmin');
                    actionCell.appendChild(deleteButton);
                } else if (admin.id === loggedInAdmin.id) {
                    const span = document.createElement('span');
                    span.textContent = '(Jij)';
                    span.style.color = '#ccc';
                    actionCell.appendChild(span);
                } else if (admin.role === 'superadmin' && allSuperAdmins.length === 1) {
                    const span = document.createElement('span');
                    span.textContent = '(Enige Superadmin)';
                    span.style.color = '#ccc';
                    actionCell.appendChild(span);
                }
            } else {
                const span = document.createElement('span');
                span.textContent = 'Geen acties';
                span.style.color = '#aaa';
                actionCell.appendChild(span);
            }
        });
    }

    function renderLogTable() {
        console.log("Admin Dashboard: Rendering log table...");
        logTableBody.innerHTML = '';
        const logs = simulatedBackend.getLogs();
        console.log("Admin Dashboard: Gevonden logs:", logs);

        if (logs.length === 0) {
            const row = logTableBody.insertRow();
            const cell = row.insertCell();
            cell.colSpan = 2;
            cell.textContent = 'Geen logboekactiviteiten gevonden.';
            cell.style.textAlign = 'center';
            cell.style.fontStyle = 'italic';
            return;
        }

        // Logboek in omgekeerde chronologische volgorde (meest recente bovenaan)
        logs.slice().reverse().forEach(log => {
            const row = logTableBody.insertRow();
            row.insertCell().textContent = log.timestamp;
            row.insertCell().textContent = log.action;
        });
    }

    // --- Event Handlers ---
    async function handleUserAction(userId, actionType) {
        console.log(`Admin Dashboard: Handling action "${actionType}" for user ID: ${userId}`);
        if (!confirm(`Weet u zeker dat u deze actie wilt uitvoeren? (${actionType})`)) {
            return;
        }

        let response;
        if (actionType === 'approve') {
            response = await simulatedBackend.updateUserStatus(userId, 'approved');
        } else if (actionType === 'reject') {
            response = await simulatedBackend.updateUserStatus(userId, 'rejected');
        } else if (actionType === 'delete' || actionType === 'deleteAdmin') {
            response = await simulatedBackend.deleteUser(userId);
        } else {
            console.error("Admin Dashboard: Onbekende actietype:", actionType);
            alert('Onbekende actie.');
            return;
        }

        if (response && response.success) {
            alert(response.message);
            renderUserTable();
            renderAdminTable();
            renderLogTable(); // Logboek ook updaten
            console.log("Admin Dashboard: Actie succesvol, tabellen opnieuw gerenderd.");
        } else {
            alert(response.message || 'Actie mislukt. Controleer console voor details.');
            console.error("Admin Dashboard: Actie mislukt:", response ? response.message : 'Onbekende fout.');
        }
    }

    logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        sessionStorage.removeItem('loggedInAdmin');
        console.log("Admin Dashboard: Logged out, sessionStorage cleared.");
        alert('U bent succesvol uitgelogd als beheerder.');
        window.location.href = 'index.html'; // Of admin_login.html, afhankelijk van je flow
    });

    // Modale functionaliteit voor het toevoegen van admins
    addAdminButton.addEventListener('click', () => {
        if (loggedInAdmin.role === 'superadmin') {
            if (addAdminModal) addAdminModal.style.display = 'flex';
            if (newAdminRole) {
                newAdminRole.style.display = 'block';
                // Zorg ervoor dat de rolselectie de superadmin optie heeft voor superadmins
                const superAdminOption = newAdminRole.querySelector('option[value="superadmin"]');
                if (!superAdminOption) {
                    const option = document.createElement('option');
                    option.value = 'superadmin';
                    option.textContent = 'Super Admin';
                    newAdminRole.appendChild(option);
                    console.log("Admin Dashboard: Superadmin optie toegevoegd aan rolselectie.");
                }
            }
            console.log("Admin Dashboard: Add Admin modal geopend.");
        } else {
            alert('U heeft geen rechten om nieuwe admins toe te voegen.');
            console.warn("Admin Dashboard: Add Admin poging geblokkeerd voor niet-superadmin.");
        }
    });

    closeButton.addEventListener('click', () => {
        if (addAdminModal) addAdminModal.style.display = 'none';
        if (addAdminForm) addAdminForm.reset();
        if (addAdminMessage) addAdminMessage.style.display = 'none';
        console.log("Admin Dashboard: Add Admin modal gesloten.");
    });

    window.addEventListener('click', (event) => {
        if (event.target === addAdminModal) {
            if (addAdminModal) addAdminModal.style.display = 'none';
            if (addAdminForm) addAdminForm.reset();
            if (addAdminMessage) addAdminMessage.style.display = 'none';
            console.log("Admin Dashboard: Add Admin modal gesloten via click buiten.");
        }
    });

    addAdminForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (addAdminMessage) addAdminMessage.style.display = 'none';
        console.log("Admin Dashboard: Add Admin formulier ingediend.");

        const fullName = newAdminFullName.value.trim();
        const username = newAdminUsername.value.trim();
        const email = newAdminEmail.value.trim();
        const password = newAdminPassword.value;
        const role = newAdminRole.value;

        if (!fullName || !username || !email || !password || !role) {
            if (addAdminMessage) {
                addAdminMessage.textContent = 'Vul alle velden in.';
                addAdminMessage.className = 'message error';
                addAdminMessage.style.display = 'block';
            }
            console.warn("Admin Dashboard: Add Admin validatiefout: niet alle velden ingevuld.");
            return;
        }

        if (password.length < 6) {
            if (addAdminMessage) {
                addAdminMessage.textContent = 'Wachtwoord moet minimaal 6 tekens lang zijn.';
                addAdminMessage.className = 'message error';
                addAdminMessage.style.display = 'block';
            }
            console.warn("Admin Dashboard: Add Admin validatiefout: wachtwoord te kort.");
            return;
        }

        try {
            const response = await simulatedBackend.addNewAdmin(fullName, username, email, password, role);
            if (response.success) {
                if (addAdminMessage) {
                    addAdminMessage.textContent = response.message;
                    addAdminMessage.className = 'message success';
                    addAdminMessage.style.display = 'block';
                }
                if (addAdminForm) addAdminForm.reset();
                renderAdminTable();
                renderLogTable(); // Logboek ook updaten
                console.log("Admin Dashboard: Nieuwe admin succesvol toegevoegd via formulier.");
            } else {
                if (addAdminMessage) {
                    addAdminMessage.textContent = response.message;
                    addAdminMessage.className = 'message error';
                    addAdminMessage.style.display = 'block';
                }
                console.error("Admin Dashboard: Fout bij toevoegen admin via formulier:", response.message);
            }
        } catch (error) {
            if (addAdminMessage) {
                addAdminMessage.textContent = error.message || 'Fout bij toevoegen admin. (zie console)';
                addAdminMessage.className = 'message error';
                addAdminMessage.style.display = 'block';
            }
            console.error('Admin Dashboard: Onverwachte fout bij toevoegen admin:', error);
        }
    });

    // --- Initiële Render ---
    // Zorg ervoor dat superadmin bestaat en users/admins correct worden geladen
    simulatedBackend.getAllUsers();
    renderUserTable();
    renderAdminTable();
    renderLogTable();
    console.log("Admin Dashboard Script: Initiële rendering voltooid.");
});