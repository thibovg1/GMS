// js/data.js

export const departmentsList = ['Politie', 'Kmar', 'Brandweer', 'Ambulance', 'Prorail', 'Meldkamer', 'Burger'];

export const ranksByDepartment = {
    'Politie': ["Aspirant", "Surveillant", "Agent", "Hoofdagent", "Brigadier", "Inspecteur", "Hoofdinspecteur", "Commissaris", "Hoofdcommissaris", "Eerste hoofdcommissaris",],
    'Kmar': ["Marechaussee der 4e klasse", "Marechaussee der 3e klasse", "Marechaussee der 2e klasse", "Marechaussee der 1e klasse", "Wachtmeester", "Wachtmeester der 1e klasse", "Opperwachtmeester", "Adjudant-onderofficier", "Tweede luitenant", "Eerste luitenant", "Kapitein", "Majoor", "Luitenant-kolonel", "Kolonel", "Brigadegeneraal", "Generaal-majoor", "Luitenant-generaal",],
    'Brandweer': ["Aspirant", "Brandwacht", "Hoofdbrandwacht", "Brandmeester", "Hoofdbrandmeester", "Commandeur", "Adjunct-hoofdcommandeur", "Hoofdcommandeur",],
    'Ambulance': ["Ondersteunend personeel", "Ambulance in opleiding", "Ambulancechauffeur", "Ambulancebroeder", "Assistent-verpleegkundige", "Ambulanceverpleegkundige", "Ambulance­specialist", "Ambulancearts", "Ambulancechirurg", "Assistent-geneeskundige", "Geneeskundige", "Hoofd-geneeskundige", "Ambulanceleiding", "Hoofdtrainer", "Teamleider", "Ambulancebaas"],
    'Prorail': ["Treinverkeersleider", "Procesleider", "Projectmanager", "Technisch specialist", "Inspecteur spoorinfra", "Adviseur veiligheid", "Planner", "Assetmanager", "Regisseur spoorbeheer", "Data-analist", "Omgevingsmanager", "Communicatiemanager", "Directeur operatie", "Directeur projecten", "CEO ProRail"],
    'Meldkamer': ["Centralist intake", "Centralist uitgifte", "Multidisciplinair centralist", "Senior centralist", "Teamleider meldkamer", "Operationeel coördinator", "Calamiteitencoördinator (CaCo)", "Hoofd meldkamer", "Functioneel beheerder", "Technisch beheerder", "Piketfunctionaris LMS", "Procescoördinator", "Regiocoördinator meldkamer", "Trainer meldkamer", "Kwaliteitsadviseur meldkamer",],
    'Burger': ['Geen'] // Placeholder for consistency, but will be hidden
};

// Simplified specializations for demonstration purposes
export const specializationsByRank = {
    'Politie': {
        'Aspirant': ['Algemeen'],
        'Surveillant': ['Algemeen', 'Verkeer'],
        'Agent': ['Algemeen', 'Wijkagent', 'Recherche'],
        'Hoofdagent': ['Algemeen', 'Specialist'],
        'Brigadier': ['Leidinggevend', 'Coördinatie'],
        'Inspecteur': ['Teamleider', 'Onderzoek'],
        'Hoofdinspecteur': ['Afdelingshoofd'],
        'Commissaris': ['Regionaal Leidinggevend'],
        'Hoofdcommissaris': ['Korpsleiding'],
        'Eerste hoofdcommissaris': ['Nationale Leiding']
    },
    'Kmar': {
        'Marechaussee der 4e klasse': ['Algemeen'],
        'Marechaussee der 3e klasse': ['Beveiliging', 'Grensbewaking'],
        'Marechaussee der 2e klasse': ['Opsporing', 'Beveiliging'],
        'Marechaussee der 1e klasse': ['Specialist', 'Instructeur'],
        'Wachtmeester': ['Teamleider'],
        'Wachtmeester der 1e klasse': ['Coördinatie'],
        'Opperwachtmeester': ['Sectiehoofd'],
        'Adjudant-onderofficier': ['Operationeel Leidinggevend'],
        'Tweede luitenant': ['Officier in opleiding'],
        'Eerste luitenant': ['Pelotonscommandant'],
        'Kapitein': ['Compagniecommandant'],
        'Majoor': ['Staf Officier'],
        'Luitenant-kolonel': ['Bataljonscommandant'],
        'Kolonel': ['Brigadecommandant'],
        'Brigadegeneraal': ['Generaal Staf'],
        'Generaal-majoor': ['Divisiecommandant'],
        'Luitenant-generaal': ['Korpscommandant']
    },
    'Brandweer': {
        'Aspirant': ['Algemeen'],
        'Brandwacht': ['Basis'],
        'Hoofdbrandwacht': ['Gevorderd'],
        'Brandmeester': ['Ploegleider'],
        'Hoofdbrandmeester': ['Officier van Dienst'],
        'Commandeur': ['Operationeel Leidinggevend'],
        'Adjunct-hoofdcommandeur': ['Management'],
        'Hoofdcommandeur': ['Regionaal Leidinggevend']
    },
    'Ambulance': {
        'Ondersteunend personeel': ['Algemeen'],
        'Ambulance in opleiding': ['Algemeen'],
        'Ambulancechauffeur': ['Chauffeur'],
        'Ambulancebroeder': ['Verpleegkundige'],
        'Assistent-verpleegkundige': ['Assistentie'],
        'Ambulanceverpleegkundige': ['Spoedeisende Zorg'],
        'Ambulance­specialist': ['Specialist Spoedeisende Zorg'],
        'Ambulancearts': ['Medisch Leidinggevend'],
        'Ambulancechirurg': ['Chirurgische Spoedeisende Zorg'],
        'Assistent-geneeskundige': ['Assistent Arts'],
        'Geneeskundige': ['Arts'],
        'Hoofd-geneeskundige': ['Hoofd Arts'],
        'Ambulanceleiding': ['Leidinggevend'],
        'Hoofdtrainer': ['Opleiding'],
        'Teamleider': ['Teamcoördinatie'],
        'Ambulancebaas': ['Algemeen Management']
    },
    'Prorail': {
        'Treinverkeersleider': ['Algemeen'],
        'Procesleider': ['Operationeel'],
        'Projectmanager': ['Projecten'],
        'Technisch specialist': ['Techniek'],
        'Inspecteur spoorinfra': ['Inspectie'],
        'Adviseur veiligheid': ['Veiligheid'],
        'Planner': ['Planning'],
        'Assetmanager': ['Assetbeheer'],
        'Regisseur spoorbeheer': ['Spoorbeheer'],
        'Data-analist': ['Data Analyse'],
        'Omgevingsmanager': ['Omgevingsbeheer'],
        'Communicatiemanager': ['Communicatie'],
        'Directeur operatie': ['Directie Operatie'],
        'Directeur projecten': ['Directie Projecten'],
        'CEO ProRail': ['Algemeen Bestuur']
    },
    'Meldkamer': {
        'Centralist intake': ['Algemeen', 'Politie', 'Brandweer', 'Ambulance'],
        'Centralist uitgifte': ['Algemeen', 'Politie', 'Brandweer', 'Ambulance'],
        'Multidisciplinair centralist': ['Algemeen', 'Crisisbeheersing'],
        'Senior centralist': ['Algemeen', 'Coördinatie'],
        'Teamleider meldkamer': ['Leidinggevend'],
        'Operationeel coördinator': ['Leidinggevend', 'Strategisch'],
        'Calamiteitencoördinator (CaCo)': ['Crisisbeheersing'],
        'Hoofd meldkamer': ['Management'],
        'Functioneel beheerder': ['IT', 'Applicatiebeheer'],
        'Technisch beheerder': ['IT', 'Infrastructuur'],
        'Piketfunctionaris LMS': ['Logistiek', 'Management'],
        'Procescoördinator': ['Procesoptimalisatie'],
        'Regiocoördinator meldkamer': ['Regionaal management'],
        'Trainer meldkamer': ['Opleiding'],
        'Kwaliteitsadviseur meldkamer': ['Kwaliteitsmanagement']
    },
    'Burger': {
        'Geen': ['Geen']
    }
};