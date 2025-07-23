document.addEventListener('DOMContentLoaded', () => {
    // Functie om unieke ID's te genereren
    const generateUniqueId = () => {
        return Date.now() + Math.floor(Math.random() * 1000);
    };

    const simulatedBackend = {
        // Deze functie is essentieel om te zorgen dat de 'superadmin' altijd beschikbaar is in localStorage
        getAllUsers: () => {
            const storedAllUsers = localStorage.getItem('gms_all_users');
            let allUsers = [];

            if (storedAllUsers) {
                allUsers = JSON.parse(storedAllUsers);
            }

            // Controleer of de superadmin al bestaat in de lijst
            const superAdminExists = allUsers.some(user => user.username === 'superadmin' && user.role === 'superadmin');
            if (!superAdminExists) {
                const superAdmin = {
                    id: generateUniqueId(),
                    fullName: 'Super Admin',
                    username: 'superadmin',
                    password: 'adminpassword', // Wachtwoord wordt niet meer gebruikt voor login, maar blijft voor consistentie
                    role: 'superadmin', // Behoud superadmin rol voor console toegang
                    email: 'super@admin.com',
                    status: 'approved'
                };
                allUsers.push(superAdmin);
                simulatedBackend.saveAllUsers(allUsers); // Sla meteen op na toevoegen
            }
            
            return allUsers;
        },
        saveAllUsers: (users) => {
            localStorage.setItem('gms_all_users', JSON.stringify(users));
        }
    };

    // Zorg ervoor dat de gebruikerslijst wordt geïnitialiseerd bij het laden van de pagina.
    // Dit garandeert dat de 'superadmin' bestaat, zelfs zonder login-proces.
    simulatedBackend.getAllUsers(); 
});