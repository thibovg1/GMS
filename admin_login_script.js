document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('errorMessage');

    // Constants for Superadmin (MUST match admin_dashboard_script.js)
    const SUPERADMIN_USERNAME = 'superadmin';
    const SUPERADMIN_PASSWORD = 'adminpassword'; // Your Superadmin Password

    // Local Storage Key for Users
    const LOCAL_STORAGE_USERS_KEY = 'gms_all_users';

    // Helper to get all users (including admins) from localStorage
    const getAllUsers = () => {
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

        // Ensure the superadmin account exists in localStorage
        const superAdminExists = users.some(u => u.username === SUPERADMIN_USERNAME && u.role === 'superadmin');
        if (!superAdminExists) {
            console.warn(`Superadmin '${SUPERADMIN_USERNAME}' not found in localStorage, creating...`);
            const superAdmin = {
                id: 'superadmin_id_fixed', // Fixed ID for consistency
                fullName: 'Global Super Admin',
                username: "superadmin",
                password: "adminpassword",
                role: 'superadmin',
                email: 'superadmin@global.com',
                status: 'approved'
            };
            users.push(superAdmin);
            localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(users));
            console.log("Superadmin account ensured in localStorage.");
        } else {
            // Ensure existing superadmin has correct password/role (for resilience)
            const existingSuperAdmin = users.find(u => u.username === SUPERADMIN_USERNAME);
            if (existingSuperAdmin && (existingSuperAdmin.password !== SUPERADMIN_PASSWORD || existingSuperAdmin.role !== 'superadmin')) {
                console.warn("Existing superadmin has incorrect password or role, updating...");
                existingSuperAdmin.password = SUPERADMIN_PASSWORD;
                existingSuperAdmin.role = 'superadmin';
                localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(users));
                console.log(`Superadmin account '${SUPERADMIN_USERNAME}' details updated in localStorage.`);
            }
        }
        return users;
    };

    // Ensure superadmin exists on page load (good for initial setup and recovery)
    getAllUsers();

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        errorMessage.textContent = ''; // Clear previous errors

        const username = usernameInput.value.trim();
        const password = passwordInput.value;

        // Directly check for Superadmin login (hardcoded for initial access)
        if (username === SUPERADMIN_USERNAME && password === SUPERADMIN_PASSWORD) {
            const adminUser = {
                id: 'superadmin_id_fixed', // Use fixed ID
                username: "superadmin",
                role: 'superadmin',
                fullName: 'Global Super Admin'
            };
            sessionStorage.setItem('loggedInAdmin', JSON.stringify(adminUser));
            console.log('Superadmin login successful.');
            window.location.href = 'admin_dashboard.html';
            return;
        }

        // Check other admin/user logins from localStorage
        const allUsers = getAllUsers(); // Re-fetch to ensure superadmin is in list if it was just added
        const foundUser = allUsers.find(user => user.username === username && user.password === password);

        if (foundUser) {
            // Check if it's an admin account (admin or superadmin)
            if (foundUser.role === 'admin' || foundUser.role === 'superadmin') {
                if (foundUser.status === 'approved') {
                    // Store admin user data in sessionStorage
                    sessionStorage.setItem('loggedInAdmin', JSON.stringify(foundUser));
                    console.log('Admin login successful for:', foundUser.username);
                    window.location.href = 'admin_dashboard.html';
                } else if (foundUser.status === 'pending') {
                    errorMessage.textContent = 'Uw account wacht op goedkeuring.';
                } else { // rejected
                    errorMessage.textContent = 'Uw account is afgewezen.';
                }
            } else {
                errorMessage.textContent = 'Ongeldige gebruikersnaam of wachtwoord voor admin toegang.';
            }
        } else {
            errorMessage.textContent = 'Ongeldige gebruikersnaam of wachtwoord.';
        }
    });
});