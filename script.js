document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.navbar ul li a');
    const contentSections = document.querySelectorAll('.content-section');
    const activeIncidentsCount = document.getElementById('active-incidents-count');
    const urgentIncidentsCount = document.getElementById('urgent-incidents-count');
    const availableUnitsCount = document.getElementById('available-units-count');
    const incidentsContainer = document.getElementById('incidents-container');
    const chatInput = document.getElementById('chat-input');
    const sendMessageBtn = document.getElementById('send-message-btn');
    const chatMessages = document.getElementById('chat-messages');
    const latestUpdatesList = document.getElementById('latest-updates-list');

    let activeIncidents = 0;
    let urgentIncidents = 0;
    let availableUnits = 0;

    // Voorbeeld data voor meldingen
    let incidents = [
        { id: 'M-001', type: 'Brand', location: 'Dorpsstraat 10, Herentals', status: 'new', time: '17:05' },
        { id: 'M-002', type: 'Verkeersongeval', location: 'E313 Afrit 22', status: 'in-progress', time: '17:15' },
        { id: 'M-003', type: 'Medisch Noodgeval', location: 'Koning Albertlaan 5, Geel', status: 'resolved', time: '16:50' },
        { id: 'M-004', type: 'Inbraak', location: 'Stationsplein 1, Lier', status: 'new', time: '17:25' }
    ];

    // Functie om de actieve sectie te wisselen
    const showSection = (sectionId) => {
        contentSections.forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionId).classList.add('active');

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.section === sectionId) {
                link.classList.add('active');
            }
        });
    };

    // Navigatie klik-events
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = e.target.dataset.section || e.target.closest('a').dataset.section;
            showSection(sectionId);
        });
    });

    // Initialiseer de dashboard tellers
    const updateDashboardCounters = () => {
        activeIncidents = incidents.filter(inc => inc.status === 'new' || inc.status === 'in-progress').length;
        urgentIncidents = incidents.filter(inc => inc.type === 'Brand' || inc.type === 'Medisch Noodgeval' || inc.type === 'Verkeersongeval').length; // Vereenvoudigde urgentie
        availableUnits = Math.floor(Math.random() * 20) + 5; // Simuleer aantal beschikbare eenheden

        activeIncidentsCount.textContent = activeIncidents;
        urgentIncidentsCount.textContent = urgentIncidents;
        availableUnitsCount.textContent = availableUnits;
    };

    // Render meldingen in de lijst
    const renderIncidents = () => {
        incidentsContainer.innerHTML = ''; // Maak de lijst leeg

        if (incidents.length === 0) {
            incidentsContainer.innerHTML = '<p style="text-align: center; padding: 20px;">Geen meldingen om weer te geven.</p>';
            return;
        }

        incidents.forEach(incident => {
            const incidentRow = document.createElement('div');
            incidentRow.classList.add('incident-row');
            incidentRow.innerHTML = `
                <span>${incident.id}</span>
                <span>${incident.type}</span>
                <span>${incident.location}</span>
                <span><span class="status-badge ${incident.status}">${incident.status.replace('-', ' ').toUpperCase()}</span></span>
                <span>${incident.time}</span>
                <span><button data-id="${incident.id}">Details</button></span>
            `;
            incidentsContainer.appendChild(incidentRow);
        });

        // Voeg event listeners toe aan de detailknoppen
        incidentsContainer.querySelectorAll('.incident-row button').forEach(button => {
            button.addEventListener('click', (e) => {
                const incidentId = e.target.dataset.id;
                alert(`Details voor melding ${incidentId} (Dit zou een modale dialoog openen)`);
                // Hier zou je code toevoegen om een modale dialoog te openen met meer details
            });
        });
    };

    // Voeg een nieuw chatbericht toe
    const addChatMessage = (message, sender, type = 'received') => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', type);
        messageDiv.innerHTML = `<span class="sender">${sender}:</span> ${message}`;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll naar beneden
    };

    // Stuur bericht functie
    sendMessageBtn.addEventListener('click', () => {
        const messageText = chatInput.value.trim();
        if (messageText) {
            addChatMessage(messageText, 'U', 'sent');
            chatInput.value = ''; // Leeg het invoerveld
            // Hier zou logica komen om het bericht naar een backend te sturen
        }
    });

    // Enter-toets voor chat
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessageBtn.click();
        }
    });

    // Functie om de laatste updates bij te werken
    const updateLatestUpdates = (update) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${new Date().toLocaleTimeString()} - ${update}`;
        latestUpdatesList.prepend(listItem); // Voeg bovenaan toe
        if (latestUpdatesList.children.length > 5) { // Houd de lijst beperkt
            latestUpdatesList.removeChild(latestUpdatesList.lastChild);
        }
    };

    // Simulatie van nieuwe meldingen en updates
    setInterval(() => {
        const newIncidentChance = Math.random();
        if (newIncidentChance < 0.3) { // 30% kans op nieuwe melding
            const newId = `M-${String(incidents.length + 1).padStart(3, '0')}`;
            const incidentTypes = ['Brand', 'Verkeersongeval', 'Medisch Noodgeval', 'Inbraak', 'Overval'];
            const randomType = incidentTypes[Math.floor(Math.random() * incidentTypes.length)];
            const locations = [
                'Hoofdstraat 123', 'Industriepark 7', 'Marktplein 1', 'Schoolstraat 45', 'Ziekenhuislaan 8'
            ];
            const randomLocation = locations[Math.floor(Math.random() * locations.length)] + ', Herentals';
            const newIncident = {
                id: newId,
                type: randomType,
                location: randomLocation,
                status: 'new',
                time: new Date().toLocaleTimeString().substring(0, 5)
            };
            incidents.unshift(newIncident); // Voeg toe aan begin van de array
            renderIncidents();
            updateDashboardCounters();
            updateLatestUpdates(`Nieuwe melding: ${newIncident.type} op ${newIncident.location}`);
            addChatMessage(`Systeem: Nieuwe melding ${newId} - ${newIncident.type} op ${newIncident.location}`, 'Systeem', 'received');
        }

        // Simuleer statusupdates voor bestaande meldingen
        incidents.forEach(inc => {
            if (inc.status === 'new' && Math.random() < 0.1) { // 10% kans om naar in-progress te gaan
                inc.status = 'in-progress';
                updateLatestUpdates(`Status update ${inc.id}: ${inc.type} is nu in uitvoering.`);
                addChatMessage(`Systeem: Melding ${inc.id} - status gewijzigd naar 'in uitvoering'.`, 'Systeem', 'received');
            } else if (inc.status === 'in-progress' && Math.random() < 0.05) { // 5% kans om naar resolved te gaan
                inc.status = 'resolved';
                updateLatestUpdates(`Status update ${inc.id}: ${inc.type} is opgelost.`);
                addChatMessage(`Systeem: Melding ${inc.id} - status gewijzigd naar 'opgelost'.`, 'Systeem', 'received');
            }
        });
        renderIncidents(); // Herteken de lijst na updates
        updateDashboardCounters(); // Update tellers na statuswijzigingen
    }, 5000); // Elke 5 seconden

    // Eerste initialisatie
    showSection('dashboard');
    updateDashboardCounters();
    renderIncidents();
});