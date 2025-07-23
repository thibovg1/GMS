document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const registerMessage = document.getElementById('registerMessage');

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

            // Zorgt ervoor dat de superadmin altijd bestaat bij het laden van een pagina
            // die getAllUsers aanroept, indien nodig.
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
                simulatedBackend.saveAllUsers(allUsers); // Sla meteen op na toevoegen
            }
            
            return allUsers; // Retourneer de (geüpdatete) lijst
        },
        saveAllUsers: (users) => {
            localStorage.setItem('gms_all_users', JSON.stringify(users));
        },
        registerUser: (userData) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => { // Simuleer netwerkvertraging
                    let allUsers = simulatedBackend.getAllUsers(); // Haal de actuele lijst op

                    // Controleer of gebruikersnaam of e-mail al bestaat
                    if (allUsers.some(user => user.username === userData.username)) {
                        return reject({ success: false, message: 'Gebruikersnaam bestaat al.' });
                    }
                    if (allUsers.some(user => user.email === userData.email)) {
                        return reject({ success: false, message: 'E-mailadres is al geregistreerd.' });
                    }

                    // Voeg de nieuwe gebruiker toe met 'mod' rol en 'approved' status
                    const newUser = {
                        id: generateUniqueId(),
                        fullName: userData.fullName,
                        username: userData.username,
                        email: userData.email,
                        password: userData.password, // WAARSCHUWING: Dit is onveilig voor echte apps!
                        role: 'mod', // Nieuwe gebruikers zijn standaard 'mod'
                        status: 'approved' // Direct goedgekeurd
                    };

                    allUsers.push(newUser);
                    simulatedBackend.saveAllUsers(allUsers);
                    resolve({ success: true, message: 'Registratie succesvol! Je bent nu een mod.' });
                }, 500); // 0.5 seconde vertraging
            });
        }
    };

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Voorkom standaard formulier indiening

            const fullName = document.getElementById('reg_fullName').value;
            const username = document.getElementById('reg_username').value;
            const email = document.getElementById('reg_email').value;
            const password = document.getElementById('reg_password').value;
            const confirmPassword = document.getElementById('reg_confirmPassword').value;

            // Verberg eerdere berichten
            registerMessage.style.display = 'none';
            registerMessage.classList.remove('success', 'error');

            if (password !== confirmPassword) {
                displayMessage('Wachtwoorden komen niet overeen.', 'error');
                return;
            }

            if (password.length < 6) {
                displayMessage('Wachtwoord moet minimaal 6 tekens lang zijn.', 'error');
                return;
            }

            try {
                const response = await simulatedBackend.registerUser({ fullName, username, email, password });
                if (response.success) {
                    displayMessage(response.message, 'success');
                    registerForm.reset(); // Leeg het formulier na succesvolle registratie
                } else {
                    displayMessage(response.message, 'error');
                }
            } catch (error) {
                displayMessage(`Registratie mislukt: ${error.message || 'Onbekende fout'}`, 'error');
                console.error('Registratie fout:', error);
            }
        });
    }

    function displayMessage(message, type) {
        registerMessage.textContent = message;
        registerMessage.classList.add(type);
        registerMessage.style.display = 'block';
    }

    // Zorg ervoor dat de gebruikerslijst wordt geïnitialiseerd bij het laden van de pagina
    // Dit zorgt ervoor dat de superadmin bestaat voordat er registraties plaatsvinden.
    simulatedBackend.getAllUsers();
});