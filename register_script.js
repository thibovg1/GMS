document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const registerMessage = document.getElementById('registerMessage');

    // --- Gesimuleerde Backend (gelijk aan die in andere scripts) ---
    const generateUniqueId = () => {
        return Date.now() + Math.floor(Math.random() * 1000);
    };

    const simulatedBackend = {
        getAllUsers: () => {
            const storedAllUsers = localStorage.getItem('gms_all_users');
            return storedAllUsers ? JSON.parse(storedAllUsers) : [];
        },
        saveAllUsers: (users) => {
            localStorage.setItem('gms_all_users', JSON.stringify(users));
        },
        registerUser: (fullName, username, email, password) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => { // Simuleer netwerkvertraging
                    let allUsers = simulatedBackend.getAllUsers();

                    // Controleer of gebruikersnaam of e-mail al bestaat
                    if (allUsers.some(user => user.username === username)) {
                        return reject({ success: false, message: 'Gebruikersnaam bestaat al.' });
                    }
                    if (allUsers.some(user => user.email === email)) {
                        return reject({ success: false, message: 'E-mailadres is al geregistreerd.' });
                    }

                    const newUser = {
                        id: generateUniqueId(),
                        fullName: fullName,
                        username: username,
                        email: email,
                        password: password,
                        role: 'user', // STANDAARD ROL IS NU 'USER'
                        status: 'pending' // Nieuwe gebruikers zijn in afwachting van goedkeuring
                    };

                    allUsers.push(newUser);
                    simulatedBackend.saveAllUsers(allUsers);
                    resolve({ success: true, message: 'Registratie succesvol!' }); // Boodschap aangepast
                }, 500);
            });
        }
    };
    // --- Einde Gesimuleerde Backend ---

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

        const fullName = document.getElementById('reg_fullName').value;
        const username = document.getElementById('reg_username').value;
        const email = document.getElementById('reg_email').value;
        const password = document.getElementById('reg_password').value;
        const confirmPassword = document.getElementById('reg_confirmPassword').value;

        if (password !== confirmPassword) {
            displayMessage('Wachtwoorden komen niet overeen.', 'error');
            return;
        }

        try {
            const response = await simulatedBackend.registerUser(fullName, username, email, password);
            if (response.success) {
                displayMessage(response.message, 'success');
                registerForm.reset(); // Leeg het formulier na succesvolle registratie
            } else {
                displayMessage(response.message, 'error');
            }
        } catch (error) {
            displayMessage(error.message || 'Registratie mislukt: Onbekende fout', 'error');
            console.error('Registratie fout:', error);
        }
    });
});