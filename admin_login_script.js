document.addEventListener('DOMContentLoaded', () => {
    const adminLoginForm = document.getElementById('adminLoginForm');
    const adminUsernameInput = document.getElementById('adminUsername');
    const adminPasswordInput = document.getElementById('adminPassword');
    const adminLoginMessage = document.getElementById('adminLoginMessage');

    // --- Gesimuleerde Backend Functies ---
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
        adminLogin: (username, password) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const allUsers = simulatedBackend.getAllUsers();
                    // Zoek naar een gebruiker die admin of superadmin is en overeenkomt met de credentials
                    const adminUser = allUsers.find(u => 
                        u.username === username && u.password === password && 
                        (u.role === 'admin' || u.role === 'superadmin')
                    );

                    if (adminUser) {
                        // De superadmin hoeft niet expliciet een aparte tak te hebben hier,
                        // omdat de rol al in `adminUser.role` staat en die wordt teruggegeven.
                        // Belangrijk is dat *elke* admin (incl. superadmin) de status 'approved' moet hebben om hier te slagen,
                        // tenzij je de superadmin ook hier een bypass geeft voor de 'status' check,
                        // wat voor admins minder gebruikelijk is dan voor reguliere logins.
                        // In ons model is de superadmin's status al 'approved' bij creatie, dus dit is OK.

                        if (adminUser.status === 'approved') {
                            resolve({ success: true, message: 'Admin login succesvol!', admin: { id: adminUser.id, username: adminUser.username, role: adminUser.role } });
                        } else {
                            reject({ success: false, message: 'Je admin account is nog niet goedgekeurd of is afgekeurd.' });
                        }
                    } else {
                        reject({ success: false, message: 'Ongeldige admin gebruikersnaam of wachtwoord.' });
                    }
                }, 500);
            });
        }
    };
    // --- Einde Gesimuleerde Backend Functies ---

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
            const response = await simulatedBackend.adminLogin(username, password);
            if (response.success) {
                sessionStorage.setItem('loggedInAdmin', JSON.stringify(response.admin)); // Sla de rol op
                displayMessage(response.message, 'success');
                // Kleine vertraging voor de gebruiker om het bericht te zien
                setTimeout(() => {
                    window.location.href = 'admin_dashboard.html'; 
                }, 500);
            } else {
                displayMessage(response.message, 'error');
            }
        } catch (error) {
            displayMessage(error.message || 'Login mislukt: Onbekende fout', 'error');
            console.error('Admin Login fout:', error);
        }
    });

    simulatedBackend.getAllUsers();
});