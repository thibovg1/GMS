document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const fullNameInput = document.getElementById('reg_fullName');
    const usernameInput = document.getElementById('reg_username');
    const emailInput = document.getElementById('reg_email');
    const passwordInput = document.getElementById('reg_password');
    const confirmPasswordInput = document.getElementById('reg_confirmPassword');
    const registerMessage = document.getElementById('registerMessage');

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
        registerUser: (fullName, username, email, password) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const allUsers = simulatedBackend.getAllUsers();
                    
                    if (allUsers.some(user => user.username === username)) {
                        return reject({ success: false, message: 'Gebruikersnaam bestaat al.' });
                    }
                    if (allUsers.some(user => user.email === email)) {
                        return reject({ success: false, message: 'E-mailadres is al geregistreerd.' });
                    }

                    const newUser = {
                        id: generateUniqueId(),
                        fullName,
                        username,
                        email,
                        password, 
                        role: 'user', // Standaardrol voor nieuwe registraties
                        status: 'pending' // Nieuwe accounts moeten goedgekeurd worden
                    };
                    allUsers.push(newUser);
                    simulatedBackend.saveAllUsers(allUsers); // Opslaan na registratie
                    resolve({ success: true, message: 'Registratie succesvol! Wacht op goedkeuring door een beheerder.' });
                }, 500);
            });
        }
    };
    // --- Einde Gesimuleerde Backend Functies ---

    function displayMessage(message, type) {
        registerMessage.textContent = message;
        registerMessage.className = `message ${type}`;
        registerMessage.style.display = 'block';
    }

    function hideMessage() {
        registerMessage.style.display = 'none';
        registerMessage.classList.remove('success', 'error');
    }

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideMessage();

        const fullName = fullNameInput.value.trim();
        const username = usernameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (!fullName || !username || !email || !password || !confirmPassword) {
            displayMessage('Vul alstublieft alle velden in.', 'error');
            return;
        }

        if (password.length < 6) {
            displayMessage('Wachtwoord moet minimaal 6 tekens lang zijn.', 'error');
            return;
        }

        if (password !== confirmPassword) {
            displayMessage('Wachtwoorden komen niet overeen.', 'error');
            return;
        }

        try {
            const response = await simulatedBackend.registerUser(fullName, username, email, password);
            if (response.success) {
                displayMessage(response.message, 'success');
                registerForm.reset();
            } else {
                displayMessage(response.message, 'error');
            }
        } catch (error) {
            displayMessage(error.message || 'Registratie mislukt: Onbekende fout', 'error');
            console.error('Registratie fout:', error);
        }
    });

    simulatedBackend.getAllUsers();
});