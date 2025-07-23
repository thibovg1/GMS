document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginMessage = document.getElementById('loginMessage');

    // --- Gesimuleerde Backend Functies ---
    // Deze functies zijn identiek in alle scripts die met gebruikersdata werken
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

            // Zorgt ervoor dat de superadmin altijd bestaat en correct is gedefinieerd
            const superAdminExists = allUsers.some(user => user.username === 'superadmin' && user.role === 'superadmin');
            if (!superAdminExists) {
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
            }
            
            return allUsers;
        },
        saveAllUsers: (users) => {
            localStorage.setItem('gms_all_users', JSON.stringify(users));
        },
        loginUser: (username, password) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const allUsers = simulatedBackend.getAllUsers();
                    const user = allUsers.find(u => u.username === username && u.password === password);

                    if (user) {
                        // Superadmin bypasses status check
                        if (user.username === 'superadmin' && user.password === 'adminpassword' && user.role === 'superadmin') {
                            resolve({ success: true, message: 'Superadmin login succesvol!', user: { id: user.id, username: user.username, role: user.role } });
                        } 
                        // Reguliere gebruikers en andere admins moeten goedgekeurd zijn
                        else if (user.status === 'approved') {
                            resolve({ success: true, message: 'Login succesvol!', user: { id: user.id, username: user.username, role: user.role } });
                        } else if (user.status === 'pending') {
                            reject({ success: false, message: 'Je account is nog niet goedgekeurd.' });
                        } else if (user.status === 'rejected') {
                            reject({ success: false, message: 'Je account is afgekeurd. Neem contact op met de beheerder.' });
                        }
                    } else {
                        reject({ success: false, message: 'Ongeldige gebruikersnaam of wachtwoord.' });
                    }
                }, 500);
            });
        }
    };
    // --- Einde Gesimuleerde Backend Functies ---

    function displayMessage(message, type) {
        loginMessage.textContent = message;
        loginMessage.className = `message ${type}`;
        loginMessage.style.display = 'block';
    }

    function hideMessage() {
        loginMessage.style.display = 'none';
        loginMessage.classList.remove('success', 'error');
    }

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideMessage();

        const username = usernameInput.value;
        const password = passwordInput.value;

        if (!username || !password) {
            displayMessage('Vul alstublieft uw gebruikersnaam en wachtwoord in.', 'error');
            return;
        }

        try {
            const response = await simulatedBackend.loginUser(username, password);
            if (response.success) {
                sessionStorage.setItem('loggedInUser', JSON.stringify(response.user));
                displayMessage(response.message, 'success');
                // Kleine vertraging voor de gebruiker om het bericht te zien
                setTimeout(() => {
                    window.location.href = 'afdeling.html'; 
                }, 500);
            } else {
                displayMessage(response.message, 'error');
            }
        } catch (error) {
            displayMessage(error.message || 'Login mislukt: Onbekende fout', 'error');
            console.error('Login fout:', error);
        }
    });

    // Zorg ervoor dat de superadmin bestaat bij het laden van de pagina, zelfs als er geen login poging is.
    simulatedBackend.getAllUsers();
});