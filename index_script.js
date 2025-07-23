document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginMessage = document.getElementById('loginMessage');

    // --- Gesimuleerde Backend (gelijk aan die in andere scripts) ---
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
        loginUser: (username, password) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => { // Simuleer netwerkvertraging
                    const allUsers = simulatedBackend.getAllUsers();
                    const user = allUsers.find(u => u.username === username && u.password === password);

                    if (user && user.status === 'approved') {
                        resolve({ success: true, message: 'Login succesvol!', user: { id: user.id, username: user.username, role: user.role } });
                    } else if (user && user.status === 'pending') {
                        reject({ success: false, message: 'Je account is nog niet goedgekeurd.' });
                    } else if (user && user.status === 'rejected') {
                        reject({ success: false, message: 'Je account is afgekeurd. Neem contact op met de beheerder.' });
                    }
                    else {
                        reject({ success: false, message: 'Ongeldige gebruikersnaam of wachtwoord.' });
                    }
                }, 500);
            });
        }
    };
    // --- Einde Gesimuleerde Backend ---

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
                // Sla de ingelogde gebruiker op in sessionStorage
                sessionStorage.setItem('loggedInUser', JSON.stringify(response.user));
                displayMessage(response.message, 'success');
                // Stuur door naar de selectiepagina, die nu afdeling.html heet
                window.location.href = 'afdeling.html'; 
            } else {
                displayMessage(response.message, 'error');
            }
        } catch (error) {
            displayMessage(error.message || 'Login mislukt: Onbekende fout', 'error');
            console.error('Login fout:', error);
        }
    });

    // Zorg ervoor dat de superadmin wordt geïnitialiseerd bij het laden van de loginpagina
    simulatedBackend.getAllUsers();
});