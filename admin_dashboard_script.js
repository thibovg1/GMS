document.addEventListener('DOMContentLoaded', () => {
    const adminUsernameDisplay = document.getElementById('adminUsernameDisplay');
    const adminRoleDisplay = document.getElementById('adminRoleDisplay');
    const logoutLink = document.getElementById('logoutLink');
    const userTableBody = document.querySelector('#userTable tbody');
    const adminTableBody = document.querySelector('#adminTable tbody');
    const logTableBody = document.querySelector('#logTable tbody'); // Logboek tabel
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

    let loggedInAdmin = JSON.parse(sessionStorage.getItem('loggedInAdmin'));

    // --- Admin Toegangscontrole ---
    function checkAdminAccess() {
        if (!loggedInAdmin || (loggedInAdmin.role !== 'admin' && loggedInAdmin.role !== 'superadmin')) {
            alert('Geen toegang: U bent niet geautoriseerd om dit dashboard te bekijken.');
            window.location.href = 'admin_login.html';
            return false;
        }
        return true;
    }

    if (!checkAdminAccess()) {
        return;
    }

    adminUsernameDisplay.textContent = loggedInAdmin.username;
    adminRoleDisplay.textContent = loggedInAdmin.role;

    // Verberg de admin-beheer sectie als de ingelogde gebruiker geen superadmin is
    if (loggedInAdmin.role !== 'superadmin') {
        const adminManagementSection = document.getElementById('admin-management-section');
        if (adminManagementSection) {
            adminManagementSection.style.display = 'none';
        }
        // Verberg de optie om een 'superadmin' toe te voegen voor normale admins
        if (newAdminRole) {
            const superAdminOption = newAdminRole.querySelector('option[value="superadmin"]');
            if (superAdminOption) {
                superAdminOption.remove();
            }
        }
        // Verberg ook de "Add Admin" knop als de ingelogde gebruiker geen superadmin is
        if (addAdminButton) {
            addAdminButton.style.display = 'none';
        }
    }

    // --- Gesimuleerde Backend Functies ---
    const generateUniqueId = () => {
        return Date.now() + Math.floor(Math.random() * 1000);
    };

    const simulatedBackend = {
        // Functie om alle gebruikers op te halen en de superadmin te garanderen
        getAllUsers: () => {
            const storedAllUsers = localStorage.getItem('gms_all_users');
            let allUsers = [];

            if (storedAllUsers) {
                try {
                    allUsers = JSON.parse(storedAllUsers);
                } catch (e) {
                    console.error("Fout bij parsen van gms_all_users uit localStorage:", e);
                    allUsers = []; // Reset als parse mislukt
                }
            }

            // Zorgt ervoor dat de superadmin altijd bestaat en correct is gedefinieerd
            const superAdminExists = allUsers.some(user => user.username === 'superadmin' && user.role === 'superadmin');
            if (!superAdminExists) {
                console.log("Superadmin niet gevonden, aanmaken...");
                const superAdmin = {
                    id: generateUniqueId(),
                    fullName: 'Super Admin',
                    username: 'superadmin',
                    password: 'adminpassword', // Dit is het wachtwoord
                    role: 'superadmin', // Cruciale roldefinitie
                    email: 'super@admin.com',
                    status: 'approved' // Superadmin is altijd goedgekeurd
                };
                allUsers.push(superAdmin);
                simulatedBackend.saveAllUsers(allUsers); // Sla direct op na toevoegen
                simulatedBackend.logAction(`${loggedInAdmin ? loggedInAdmin.username : 'Systeem'} heeft superadmin aangemaakt.`);
            }
            return allUsers;
        },
        // Functie om alle gebruikers op te slaan
        saveAllUsers: (users) => {
            localStorage.setItem('gms_all_users', JSON.stringify(users));
        },
        // Functie om logboekitems op te halen
        getLogs: () => {
            const storedLogs = localStorage.getItem('gms_admin_logs');
            if (storedLogs) {
                try {
                    return JSON.parse(storedLogs);
                } catch (e) {
                    console.error("Fout bij parsen van gms_admin_logs uit localStorage:", e);
                    return [];
                }
            }
            return [];
        },
        // Functie om een logboekitem toe te voegen
        logAction: (action) => {
            const logs = simulatedBackend.getLogs();
            const timestamp = new Date().toLocaleString('nl-BE');
            logs.push({ timestamp, action });
            localStorage.setItem('gms_admin_logs', JSON.stringify(logs));
        },
        // Functie om gebruikersstatus bij te werken
        updateUserStatus: (userId, newStatus) => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    let users = simulatedBackend.getAllUsers();
                    const userIndex = users.findIndex(u => u.id === userId);
                    if (userIndex !== -1) {
                        const updatedUser = users[userIndex];
                        updatedUser.status = newStatus;
                        simulatedBackend.saveAllUsers(users); // Opslaan na statusupdate
                        simulatedBackend.logAction(`${loggedInAdmin.username} heeft status van ${updatedUser.username} bijgewerkt naar ${newStatus}.`);
                        resolve({ success: true, message: `Gebruiker ${updatedUser.username} status bijgewerkt naar ${newStatus}.` });
                    } else {
                        resolve({ success: false, message: 'Gebruiker niet gevonden.' });
                    }
                }, 300);
            });
        },
        // Functie om een gebruiker te verwijderen
        deleteUser: (userId) => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    let users = simulatedBackend.getAllUsers();
                    const userToDelete = users.find(u => u.id === userId);

                    if (!userToDelete) {
                        return resolve({ success: false, message: 'Gebruiker niet gevonden.' });
                    }

                    // Voorkom verwijdering van de superadmin als het de enige is
                    if (userToDelete.role === 'superadmin') {
                        const allSuperAdmins = users.filter(u => u.role === 'superadmin');
                        if (allSuperAdmins.length === 1) {
                            return resolve({ success: false, message: 'Kan de enige superadmin niet verwijderen.' });
                        }
                    }
                    // Voorkom dat een admin zichzelf kan verwijderen via dit dashboard
                    if (userToDelete.id === loggedInAdmin.id) {
                         return resolve({ success: false, message: 'U kunt uw eigen account niet verwijderen via dit dashboard.' });
                    }

                    const initialLength = users.length;
                    users = users.filter(u => u.id !== userId);
                    if (users.length < initialLength) {
                        simulatedBackend.saveAllUsers(users); // Opslaan na verwijdering
                        simulatedBackend.logAction(`${loggedInAdmin.username} heeft gebruiker ${userToDelete.username} verwijderd.`);
                        resolve({ success: true, message: 'Gebruiker succesvol verwijderd.' });
                    } else {
                        resolve({ success: false, message: 'Gebruiker niet gevonden.' }); // Zou niet moeten gebeuren als userToDelete is gevonden
                    }
                }, 300);
            });
        },
        // Functie om een nieuwe admin toe te voegen
        addNewAdmin: (fullName, username, email, password, role) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    let users = simulatedBackend.getAllUsers();
                    if (users.some(u => u.username === username)) {
                        return reject({ success: false, message: 'Gebruikersnaam bestaat al.' });
                    }
                    if (users.some(u => u.email === email)) {
                        return reject({ success: false, message: 'E-mailadres is al geregistreerd.' });
                    }

                    const newAdmin = {
                        id: generateUniqueId(),
                        fullName,
                        username,
                        email,
                        password, // Wachtwoord wordt hier in plaintext opgeslagen (simulatie)
                        role: role,
                        status: 'approved' // Nieuwe admins zijn direct goedgekeurd
                    };
                    users.push(newAdmin);
                    simulatedBackend.saveAllUsers(users); // Opslaan na toevoegen admin
                    simulatedBackend.logAction(`${loggedInAdmin.username} heeft nieuwe admin ${newAdmin.username} (${newAdmin.role}) toegevoegd.`);
                    resolve({ success: true, message: 'Nieuwe admin succesvol toegevoegd.' });
                }, 500);
            });
        }
    };
    // --- Einde Gesimuleerde Backend Functies ---

    // --- Render Functies ---
    function renderUserTable() {
        userTableBody.innerHTML = '';
        const users = simulatedBackend.getAllUsers().filter(user => user.role === 'user');
        if (users.length === 0) {
            const row = userTableBody.insertRow();
            const cell = row.insertCell();
            cell.colSpan = 7; // Aantal kolommen in de tabel
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

            // Alleen superadmins en goedgekeurde admins kunnen gebruikers beheren
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
            }
        });
    }

    function renderAdminTable() {
        adminTableBody.innerHTML = '';
        const admins = simulatedBackend.getAllUsers().filter(user => user.role === 'admin' || user.role === 'superadmin');
        if (admins.length === 0) {
            const row = adminTableBody.insertRow();
            const cell = row.insertCell();
            cell.colSpan = 6; // Aantal kolommen in de tabel
            cell.textContent = 'Geen admin-accounts gevonden (behalve mogelijk de superadmin als deze filtert).';
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
                const canDelete = admin.id !== loggedInAdmin.id && (admin.role !== 'superadmin' || allSuperAdmins.length > 1);

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
                // Normale admins zien geen acties voor andere admins
                const span = document.createElement('span');
                span.textContent = 'Geen acties';
                span.style.color = '#aaa';
                actionCell.appendChild(span);
            }
        });
    }

    function renderLogTable() {
        logTableBody.innerHTML = '';
        const logs = simulatedBackend.getLogs();
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
        if (!confirm(`Weet u zeker dat u deze actie wilt uitvoeren? (${actionType})`)) {
            return;
        }

        let response;
        if (actionType === 'approve') {
            response = await simulatedBackend.updateUserStatus(userId, 'approved');
        } else if (actionType === 'reject') {
            response = await simulatedBackend.updateUserStatus(userId, 'rejected');
        } else if (actionType === 'delete' || actionType === 'deleteAdmin') { // Delete user functie bevat al de superadmin-check
            response = await simulatedBackend.deleteUser(userId);
        }

        if (response && response.success) {
            alert(response.message);
            renderUserTable();
            renderAdminTable();
            renderLogTable(); // Logboek ook updaten
        } else {
            alert(response.message || 'Actie mislukt.');
        }
    }

    logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        sessionStorage.removeItem('loggedInAdmin');
        alert('U bent succesvol uitgelogd als beheerder.');
        window.location.href = 'index.html';
    });

    // Modale functionaliteit voor het toevoegen van admins
    addAdminButton.addEventListener('click', () => {
        if (loggedInAdmin.role === 'superadmin') {
            addAdminModal.style.display = 'flex';
            newAdminRole.style.display = 'block';
            // Zorg ervoor dat de rolselectie de superadmin optie heeft voor superadmins
            const superAdminOption = newAdminRole.querySelector('option[value="superadmin"]');
            if (!superAdminOption) {
                const option = document.createElement('option');
                option.value = 'superadmin';
                option.textContent = 'Super Admin';
                newAdminRole.appendChild(option);
            }
        } else {
            alert('U heeft geen rechten om nieuwe admins toe te voegen.');
        }
    });

    closeButton.addEventListener('click', () => {
        addAdminModal.style.display = 'none';
        addAdminForm.reset();
        addAdminMessage.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === addAdminModal) {
            addAdminModal.style.display = 'none';
            addAdminForm.reset();
            addAdminMessage.style.display = 'none';
        }
    });

    addAdminForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        addAdminMessage.style.display = 'none';

        const fullName = newAdminFullName.value.trim();
        const username = newAdminUsername.value.trim();
        const email = newAdminEmail.value.trim();
        const password = newAdminPassword.value;
        const role = newAdminRole.value;

        if (!fullName || !username || !email || !password || !role) {
            addAdminMessage.textContent = 'Vul alle velden in.';
            addAdminMessage.className = 'message error';
            addAdminMessage.style.display = 'block';
            return;
        }

        if (password.length < 6) {
            addAdminMessage.textContent = 'Wachtwoord moet minimaal 6 tekens lang zijn.';
            addAdminMessage.className = 'message error';
            addAdminMessage.style.display = 'block';
            return;
        }

        try {
            const response = await simulatedBackend.addNewAdmin(fullName, username, email, password, role);
            if (response.success) {
                addAdminMessage.textContent = response.message;
                addAdminMessage.className = 'message success';
                addAdminMessage.style.display = 'block';
                addAdminForm.reset();
                renderAdminTable();
                renderLogTable(); // Logboek ook updaten
            } else {
                addAdminMessage.textContent = response.message;
                addAdminMessage.className = 'message error';
                addAdminMessage.style.display = 'block';
            }
        } catch (error) {
            addAdminMessage.textContent = error.message || 'Fout bij toevoegen admin.';
            addAdminMessage.className = 'message error';
            addAdminMessage.style.display = 'block';
            console.error('Error adding admin:', error);
        }
    });

    // --- Initiële Render ---
    simulatedBackend.getAllUsers(); // Zorgt ervoor dat superadmin bestaat bij de start
    renderUserTable();
    renderAdminTable();
    renderLogTable();
});