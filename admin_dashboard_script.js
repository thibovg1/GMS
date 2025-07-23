document.addEventListener('DOMContentLoaded', () => {
    console.log("Admin Dashboard Script: DOMContentLoaded - Start.");

    // --- DOM Element Selectors ---
    const adminUsernameDisplay = document.getElementById('adminUsernameDisplay');
    const adminRoleDisplay = document.getElementById('adminRoleDisplay');
    const logoutLink = document.getElementById('logoutLink');

    // Navigation elements
    const navItems = document.querySelectorAll('.nav-item');
    const dashboardSections = document.querySelectorAll('.dashboard-section');

    // Overview section
    const totalUsersCount = document.getElementById('totalUsersCount');
    const openMeldingenCount = document.getElementById('openMeldingenCount');
    const activeUnitsCount = document.getElementById('activeUnitsCount');
    const recentLogsList = document.getElementById('recentLogsList');
    const unitStatusOverview = document.getElementById('unitStatusOverview');

    // User Management section
    const userTableBody = document.getElementById('userTableBody');
    const noUsersMessage = document.getElementById('noUsersMessage');
    const userSearchInput = document.getElementById('userSearchInput');
    const userFilterStatus = document.getElementById('userFilterStatus');

    // Admin Management section
    const adminManagementSection = document.getElementById('admin-management'); // De hele sectie
    const adminTableBody = document.getElementById('adminTableBody');
    const noAdminsMessage = document.getElementById('noAdminsMessage');
    const addAdminButton = document.getElementById('addAdminButton');

    // Log Viewer section
    const logTableBody = document.getElementById('logTableBody');
    const noLogsMessage = document.getElementById('noLogsMessage');

    // Add Admin Modal elements
    const addAdminModal = document.getElementById('addAdminModal');
    const closeAddAdminModalButton = addAdminModal.querySelector('.close-button');
    const addAdminForm = document.getElementById('addAdminForm');
    const addAdminMessage = document.getElementById('addAdminMessage');
    const newAdminFullName = document.getElementById('newAdminFullName');
    const newAdminUsername = document.getElementById('newAdminUsername');
    const newAdminEmail = document.getElementById('newAdminEmail');
    const newAdminPassword = document.getElementById('newAdminPassword');
    const newAdminRole = document.getElementById('newAdminRole');

    // --- Global State / Logged In Admin ---
    let loggedInAdmin = JSON.parse(sessionStorage.getItem('loggedInAdmin'));
    console.log("Admin Dashboard Script: Initial loggedInAdmin:", loggedInAdmin);

    // --- Constants ---
    const SUPERADMIN_USERNAME = 'superadmin';
    const SUPERADMIN_PASSWORD = 'adminpassword'; // DIT IS HET WACHTWOORD VOOR DE SUPERADMIN!
    const LOCAL_STORAGE_USERS_KEY = 'gms_all_users';
    const LOCAL_STORAGE_LOGS_KEY = 'gms_admin_logs';
    const SESSION_STORAGE_SESSIONS_KEY = 'gms_logged_in_sessions';
    const LOCAL_STORAGE_MELDINGEN_KEY = 'gms_meldingen';

    // --- Admin Access Control ---
    function checkAdminAccess() {
        if (!loggedInAdmin || (loggedInAdmin.role !== 'admin' && loggedInAdmin.role !== 'superadmin')) {
            alert('Geen toegang: U bent niet geautoriseerd om dit dashboard te bekijken.');
            console.warn("Access Denied: Not a valid admin role or not logged in.");
            window.location.href = 'admin_login.html'; // Redirect to admin login page
            return false;
        }
        console.log(`Access Granted for ${loggedInAdmin.username} (${loggedInAdmin.role}).`);
        return true;
    }

    if (!checkAdminAccess()) {
        return; // Stop script execution if access is denied
    }

    // Update header display
    if (adminUsernameDisplay) adminUsernameDisplay.textContent = loggedInAdmin.username;
    if (adminRoleDisplay) adminRoleDisplay.textContent = loggedInAdmin.role;

    // Hide admin-only sections if not a superadmin
    if (loggedInAdmin.role !== 'superadmin') {
        document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'none');
        console.log("Admin Dashboard Script: Admin-only sections hidden for non-superadmin.");
        if (newAdminRole) {
            const superAdminOption = newAdminRole.querySelector('option[value="superadmin"]');
            if (superAdminOption) superAdminOption.remove();
        }
    }

    // --- Utility Functions ---
    const generateUniqueId = () => {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    };

    const displayMessage = (element, message, type) => {
        if (!element) return;
        element.textContent = message;
        element.className = `message ${type}`;
        element.style.display = 'block';
        console.log(`Message displayed (${type}): ${message}`);
    };

    const hideMessage = (element) => {
        if (element) {
            element.style.display = 'none';
            element.classList.remove('success', 'error');
        }
    };

    // --- Simulated Backend for Data Management ---
    const simulatedBackend = {
        // --- User Data Management ---
        getAllUsers: () => {
            let users = [];
            try {
                const storedUsers = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
                if (storedUsers) {
                    users = JSON.parse(storedUsers);
                }
            } catch (e) {
                console.error("Error parsing users from localStorage, resetting:", e);
                users = []; // Reset if data is corrupt
            }

            // Ensure superadmin always exists
            const superAdminExists = users.some(u => u.username === SUPERADMIN_USERNAME && u.role === 'superadmin');
            if (!superAdminExists) {
                console.warn(`Superadmin '${SUPERADMIN_USERNAME}' not found, creating...`);
                const superAdmin = {
                    id: generateUniqueId(),
                    fullName: 'Global Super Admin',
                    username: SUPERADMIN_USERNAME,
                    password: SUPERADMIN_PASSWORD,
                    role: 'superadmin',
                    email: 'superadmin@global.com',
                    status: 'approved'
                };
                users.push(superAdmin);
                simulatedBackend.saveAllUsers(users);
                simulatedBackend.logAction(`System: Superadmin account '${SUPERADMIN_USERNAME}' created.`);
            } else {
                // Ensure existing superadmin has correct password/role (for resilience)
                const existingSuperAdmin = users.find(u => u.username === SUPERADMIN_USERNAME);
                if (existingSuperAdmin && (existingSuperAdmin.password !== SUPERADMIN_PASSWORD || existingSuperAdmin.role !== 'superadmin')) {
                    console.warn("Existing superadmin has incorrect password or role, updating...");
                    existingSuperAdmin.password = SUPERADMIN_PASSWORD;
                    existingSuperAdmin.role = 'superadmin';
                    simulatedBackend.saveAllUsers(users);
                    simulatedBackend.logAction(`System: Superadmin account '${SUPERADMIN_USERNAME}' details updated.`);
                }
            }
            return users;
        },
        saveAllUsers: (users) => {
            try {
                localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(users));
                console.log("Users saved to localStorage.");
            } catch (e) {
                console.error("Error saving users to localStorage:", e);
            }
        },

        // --- Log Data Management ---
        getLogs: () => {
            let logs = [];
            try {
                const storedLogs = localStorage.getItem(LOCAL_STORAGE_LOGS_KEY);
                if (storedLogs) {
                    logs = JSON.parse(storedLogs);
                }
            } catch (e) {
                console.error("Error parsing logs from localStorage, resetting:", e);
                logs = [];
            }
            return logs;
        },
        logAction: (action) => {
            const logs = simulatedBackend.getLogs();
            const timestamp = new Date().toLocaleString('nl-BE');
            logs.push({ timestamp, action });
            try {
                localStorage.setItem(LOCAL_STORAGE_LOGS_KEY, JSON.stringify(logs));
                console.log(`Log Action: ${action}`);
            } catch (e) {
                console.error("Error saving logs to localStorage:", e);
            }
        },

        // --- Meldingen Data (Read-only for dashboard stats) ---
        getAllMeldingen: () => {
            try {
                return JSON.parse(localStorage.getItem(LOCAL_STORAGE_MELDINGEN_KEY)) || [];
            } catch (e) {
                console.error("Error parsing meldingen from localStorage:", e);
                return [];
            }
        },

        // --- Session Data (Read-only for active units) ---
        getAllSessions: () => {
            try {
                return JSON.parse(sessionStorage.getItem(SESSION_STORAGE_SESSIONS_KEY)) || [];
            } catch (e) {
                console.error("Error parsing sessions from sessionStorage:", e);
                return [];
            }
        },

        // --- Async Operations (Simulated API calls) ---
        updateUserStatus: async (userId, newStatus) => {
            await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
            let users = simulatedBackend.getAllUsers();
            const userIndex = users.findIndex(u => u.id === userId);
            if (userIndex !== -1) {
                const user = users[userIndex];
                user.status = newStatus;
                simulatedBackend.saveAllUsers(users);
                simulatedBackend.logAction(`${loggedInAdmin.username} changed status of user '${user.username}' (ID: ${userId}) to '${newStatus}'.`);
                return { success: true, message: `Status van ${user.username} bijgewerkt naar ${newStatus}.` };
            }
            return { success: false, message: 'Gebruiker niet gevonden.' };
        },
        deleteUser: async (userId) => {
            await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
            let users = simulatedBackend.getAllUsers();
            const userToDelete = users.find(u => u.id === userId);

            if (!userToDelete) return { success: false, message: 'Gebruiker niet gevonden.' };

            // Special checks for admin deletion
            if (userToDelete.role === 'superadmin') {
                const allSuperAdmins = users.filter(u => u.role === 'superadmin');
                if (allSuperAdmins.length === 1) { // Prevent deleting the last superadmin
                    return { success: false, message: 'Kan de enige superadmin niet verwijderen.' };
                }
            }
            if (userToDelete.id === loggedInAdmin.id) { // Prevent deleting self
                return { success: false, message: 'U kunt uw eigen account niet verwijderen via dit dashboard.' };
            }

            const initialLength = users.length;
            users = users.filter(u => u.id !== userId);
            if (users.length < initialLength) {
                simulatedBackend.saveAllUsers(users);
                simulatedBackend.logAction(`${loggedInAdmin.username} deleted user '${userToDelete.username}' (ID: ${userId}).`);
                return { success: true, message: 'Gebruiker succesvol verwijderd.' };
            }
            return { success: false, message: 'Fout bij verwijderen van gebruiker.' };
        },
        addNewAdmin: async (fullName, username, email, password, role) => {
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
            let users = simulatedBackend.getAllUsers();
            if (users.some(u => u.username === username)) {
                throw new Error('Gebruikersnaam bestaat al.');
            }
            if (users.some(u => u.email === email)) {
                throw new Error('E-mailadres is al geregistreerd.');
            }

            const newAdmin = {
                id: generateUniqueId(),
                fullName,
                username,
                email,
                password, // For simulation only!
                role: role,
                status: 'approved'
            };
            users.push(newAdmin);
            simulatedBackend.saveAllUsers(users);
            simulatedBackend.logAction(`${loggedInAdmin.username} added new admin '${newAdmin.username}' (Role: ${newAdmin.role}).`);
            return { success: true, message: 'Nieuwe admin succesvol toegevoegd.' };
        }
    };

    // --- Rendering Functions ---

    // Render Dashboard Overview
    function renderOverview() {
        console.log("Rendering Dashboard Overview.");
        const allUsers = simulatedBackend.getAllUsers();
        const regularUsers = allUsers.filter(u => u.role === 'user');
        const allMeldingen = simulatedBackend.getAllMeldingen();
        const openMeldingen = allMeldingen.filter(m => m.status !== 'Afgehandeld' && m.status !== 'Gearchiveerd');
        const activeSessions = simulatedBackend.getAllSessions();
        // Filter out Meldkamer/Burger from 'active units' for the stat
        const activeUnits = activeSessions.filter(s => s.department && s.unitStatus && s.department !== 'Meldkamer' && s.department !== 'Burger');

        if (totalUsersCount) totalUsersCount.textContent = regularUsers.length;
        if (openMeldingenCount) openMeldingenCount.textContent = openMeldingen.length;
        if (activeUnitsCount) activeUnitsCount.textContent = activeUnits.length;

        // Render Recent Logs
        if (recentLogsList) {
            recentLogsList.innerHTML = '';
            const logs = simulatedBackend.getLogs().slice().reverse().slice(0, 5); // Get 5 most recent
            if (logs.length === 0) {
                recentLogsList.innerHTML = '<li>Geen recente activiteiten.</li>';
            } else {
                logs.forEach(log => {
                    const li = document.createElement('li');
                    li.textContent = `${log.timestamp}: ${log.action}`;
                    recentLogsList.appendChild(li);
                });
            }
        }

        // Render Unit Status Overview
        if (unitStatusOverview) {
            unitStatusOverview.innerHTML = '';
            if (activeUnits.length === 0) {
                unitStatusOverview.innerHTML = '<li>Geen actieve eenheden.</li>';
            } else {
                const statusCounts = {}; // { 'Statusnaam': aantal }
                activeUnits.forEach(unit => {
                    statusCounts[unit.unitStatus] = (statusCounts[unit.unitStatus] || 0) + 1;
                });

                for (const status in statusCounts) {
                    const li = document.createElement('li');
                    li.textContent = `${status}: ${statusCounts[status]} eenheden`;
                    unitStatusOverview.appendChild(li);
                }
            }
        }
    }

    // Render User Management Table
    function renderUserTable() {
        console.log("Rendering User Table.");
        userTableBody.innerHTML = '';
        const allUsers = simulatedBackend.getAllUsers();
        let filteredUsers = allUsers.filter(user => user.role === 'user');

        const searchTerm = userSearchInput.value.toLowerCase();
        const filterStatus = userFilterStatus.value;

        if (searchTerm) {
            filteredUsers = filteredUsers.filter(user =>
                user.fullName.toLowerCase().includes(searchTerm) ||
                user.username.toLowerCase().includes(searchTerm) ||
                user.email.toLowerCase().includes(searchTerm)
            );
        }

        if (filterStatus !== 'all') {
            filteredUsers = filteredUsers.filter(user => user.status === filterStatus);
        }

        if (filteredUsers.length === 0) {
            noUsersMessage.style.display = 'block';
            return;
        } else {
            noUsersMessage.style.display = 'none';
        }

        filteredUsers.forEach(user => {
            const row = userTableBody.insertRow();
            row.insertCell().textContent = user.id;
            row.insertCell().textContent = user.fullName;
            row.insertCell().textContent = user.username;
            row.insertCell().textContent = user.email;
            row.insertCell().textContent = user.role;
            row.insertCell().textContent = user.status;

            const actionCell = row.insertCell();
            actionCell.className = 'action-buttons';

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
                } else {
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

    // Render Admin Management Table
    function renderAdminTable() {
        console.log("Rendering Admin Table.");
        adminTableBody.innerHTML = '';
        const admins = simulatedBackend.getAllUsers().filter(user => user.role === 'admin' || user.role === 'superadmin');

        if (admins.length === 0) {
            noAdminsMessage.style.display = 'block';
            return;
        } else {
            noAdminsMessage.style.display = 'none';
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

            if (loggedInAdmin.role === 'superadmin') {
                const allSuperAdmins = admins.filter(a => a.role === 'superadmin');
                // Allow delete if not self and not the only superadmin
                const canDelete = admin.id !== loggedInAdmin.id && !(admin.role === 'superadmin' && allSuperAdmins.length === 1);

                if (canDelete) {
                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Verwijderen';
                    deleteButton.className = 'delete-button';
                    deleteButton.onclick = () => handleUserAction(admin.id, 'delete'); // Use generic deleteUser
                    actionCell.appendChild(deleteButton);
                } else {
                    const span = document.createElement('span');
                    if (admin.id === loggedInAdmin.id) {
                        span.textContent = '(Jij)';
                    } else if (admin.role === 'superadmin' && allSuperAdmins.length === 1) {
                        span.textContent = '(Enige Superadmin)';
                    }
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

    // Render Log Viewer Table
    function renderLogTable() {
        console.log("Rendering Log Table.");
        logTableBody.innerHTML = '';
        const logs = simulatedBackend.getLogs();

        if (logs.length === 0) {
            noLogsMessage.style.display = 'block';
            return;
        } else {
            noLogsMessage.style.display = 'none';
        }

        // Display most recent logs first
        logs.slice().reverse().forEach(log => {
            const row = logTableBody.insertRow();
            row.insertCell().textContent = log.timestamp;
            row.insertCell().textContent = log.action;
        });
    }

    // --- Event Handlers ---

    // Handle user actions (approve, reject, delete)
    async function handleUserAction(userId, actionType) {
        console.log(`Attempting action: ${actionType} for user ID: ${userId}`);
        if (!confirm(`Weet je zeker dat je deze actie wilt uitvoeren? (${actionType})`)) {
            return;
        }

        let response;
        try {
            if (actionType === 'approve') {
                response = await simulatedBackend.updateUserStatus(userId, 'approved');
            } else if (actionType === 'reject') {
                response = await simulatedBackend.updateUserStatus(userId, 'rejected');
            } else if (actionType === 'delete') {
                response = await simulatedBackend.deleteUser(userId);
            } else {
                console.error("Unknown action type:", actionType);
                alert("Onbekende actie.");
                return;
            }

            if (response && response.success) {
                alert(response.message);
                updateAllRenderings(); // Re-render all relevant sections
            } else {
                alert(response.message || 'Actie mislukt.');
            }
        } catch (error) {
            console.error("Error during user action:", error);
            alert(`Er is een fout opgetreden: ${error.message || 'Onbekende fout.'}`);
        }
    }

    // Navigation click handler
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove 'active' from all nav items and sections
            navItems.forEach(nav => nav.classList.remove('active'));
            dashboardSections.forEach(section => section.classList.remove('active'));

            // Add 'active' to clicked nav item and corresponding section
            item.classList.add('active');
            const targetSectionId = item.dataset.section;
            const targetSection = document.getElementById(targetSectionId);
            if (targetSection) {
                targetSection.classList.add('active');
                // Re-render specific section content when navigated to it
                switch (targetSectionId) {
                    case 'overview':
                        renderOverview();
                        break;
                    case 'user-management':
                        renderUserTable();
                        break;
                    case 'admin-management':
                        renderAdminTable();
                        break;
                    case 'log-viewer':
                        renderLogTable();
                        break;
                }
            }
            console.log(`Mapsd to section: ${targetSectionId}`);
        });
    });

    // Logout
    logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        sessionStorage.removeItem('loggedInAdmin');
        console.log("Logged out. Redirecting to admin_login.html.");
        alert('U bent succesvol uitgelogd als beheerder.');
        window.location.href = 'admin_login.html'; // Or index.html
    });

    // Add Admin Button (opens modal)
    addAdminButton.addEventListener('click', () => {
        if (loggedInAdmin.role === 'superadmin') {
            addAdminModal.style.display = 'flex'; // Show modal
            hideMessage(addAdminMessage); // Clear previous messages
            addAdminForm.reset(); // Reset form
            console.log("Add Admin modal opened.");
        } else {
            alert('U heeft geen rechten om nieuwe admins toe te voegen.');
        }
    });

    // Close Add Admin Modal (X button)
    closeAddAdminModalButton.addEventListener('click', () => {
        addAdminModal.style.display = 'none';
        console.log("Add Admin modal closed by button.");
    });

    // Close Add Admin Modal (click outside)
    window.addEventListener('click', (event) => {
        if (event.target === addAdminModal) {
            addAdminModal.style.display = 'none';
            console.log("Add Admin modal closed by outside click.");
        }
    });

    // Handle Add Admin Form Submission
    addAdminForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideMessage(addAdminMessage);
        console.log("Add Admin form submitted.");

        const fullName = newAdminFullName.value.trim();
        const username = newAdminUsername.value.trim();
        const email = newAdminEmail.value.trim();
        const password = newAdminPassword.value;
        const role = newAdminRole.value;

        if (!fullName || !username || !email || !password || !role) {
            displayMessage(addAdminMessage, 'Vul alstublieft alle velden in.', 'error');
            return;
        }
        if (password.length < 6) {
            displayMessage(addAdminMessage, 'Wachtwoord moet minimaal 6 tekens lang zijn.', 'error');
            return;
        }

        try {
            const response = await simulatedBackend.addNewAdmin(fullName, username, email, password, role);
            displayMessage(addAdminMessage, response.message, 'success');
            addAdminForm.reset();
            updateAllRenderings(); // Update tables after adding new admin
            // Optional: Close modal after successful addition
            setTimeout(() => addAdminModal.style.display = 'none', 1500);
        } catch (error) {
            displayMessage(addAdminMessage, error.message || 'Fout bij toevoegen admin.', 'error');
            console.error('Error adding admin:', error);
        }
    });

    // User table search and filter
    if (userSearchInput) {
        userSearchInput.addEventListener('keyup', renderUserTable);
    }
    if (userFilterStatus) {
        userFilterStatus.addEventListener('change', renderUserTable);
    }

    // --- Initial Load & Periodic Updates ---
    function updateAllRenderings() {
        renderOverview();
        renderUserTable(); // Render all tables/sections
        renderAdminTable();
        renderLogTable();
    }

    // Call initial rendering functions
    updateAllRenderings();

    // Set up periodic refresh for dashboard stats and logs
    // (Simulates live updates without a real backend)
    setInterval(renderOverview, 10000); // Update overview every 10 seconds
    setInterval(renderLogTable, 5000); // Update logs every 5 seconds
    setInterval(renderUserTable, 15000); // Periodically refresh user table
    setInterval(renderAdminTable, 15000); // Periodically refresh admin table

    console.log("Admin Dashboard Script: Initialization Complete.");
});