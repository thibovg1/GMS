document.addEventListener('DOMContentLoaded', () => {
    const adminLoginForm = document.getElementById('adminLoginForm');
    const adminUsernameInput = document.getElementById('adminUsername');
    const adminPasswordInput = document.getElementById('adminPassword');
    const adminLoginMessage = document.getElementById('adminLoginMessage');

    // --- Gesimuleerde Backend (Moet consistent zijn met andere scripts) ---
    const generateUniqueId = () => {
        return Date.now() + Math.floor(Math.random() * 1000);
    };

    const simulatedBackend = {
        getAllUsers: () => {
            const storedAllUsers = localStorage.getItem('gms_all_users');
            let allUsers = [];

            if (storedAllUsers) {
                allUsers = JSON.parse(storedAllUsers);
            }

            // Zorgt ervoor dat de superadmin altijd bestaat bij het laden van de pagina
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
        // Specifieke login voor admins
        loginAdmin: (username, password) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => { // Simuleer netwerkvertraging
                    const allUsers = simulatedBackend.getAllUsers();
                    const user = allUsers.find(u => u.username === username && u.password === password);

                    if (user && user.status === 'approved') {
                        // Controleer of de rol voldoende is voor admin toegang
                        const allowedRoles = ['mod', 'admin', 'superadmin'];
                        if (allowedRoles.includes(user.role)) {
                            resolve({ success: true, message: 'Admin login succesvol!', user: { id: user.id, username: user.username, role: user.role } });
                        } else {
                            reject({ success: false, message: 'Uw account heeft niet de benodigde rechten voor admin toegang.' });
                        }
                    } else if (user && user.status === 'pending') {
                        reject({ success: false, message: 'Je account is nog niet goedgekeurd.' });
                    } else if (user && user.status === 'rejected') {
                        reject({ success: false, message: 'Je account is afgekeurd. Neem contact op met de beheerder.' });
                    } else {
                        reject({ success: false, message: 'Ongeldige gebruikersnaam of wachtwoord.' });
                    }
                }, 500);
            });
        }
    };
    // --- Einde Gesimuleerde Backend ---

    function displayMessage(message, type) {
        adminLoginMessage.textContent = message;
        adminLoginMessage.className = `message ${type}`;
        adminLoginMessage.style.display = 'block';
    }

    function hideMessage() {
        adminLoginMessage.style.display = 'none';
        adminLoginMessage.classList.remove('success', 'error');
    }

    adminLoginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideMessage();

        const username = adminUsernameInput.value;
        const password = adminPasswordInput.value;

        if (!username || !password) {
            displayMessage('Vul alstublieft uw gebruikersnaam en wachtwoord in.', 'error');
            return;
        }

        try {
            const response = await simulatedBackend.loginAdmin(username, password);
            if (response.success) {
                sessionStorage.setItem('loggedInUser', JSON.stringify(response.user));
                displayMessage(response.message, 'success');
                window.location.href = 'admin_dashboard.html'; 
            } else {
                displayMessage(response.message, 'error');
            }
        } catch (error) {
            displayMessage(error.message || 'Login mislukt: Onbekende fout', 'error');
            console.error('Admin Login fout:', error);
        }
    });

    // Zorg ervoor dat de superadmin wordt geïnitialiseerd bij het laden van de loginpagina
    simulatedBackend.getAllUsers();
});