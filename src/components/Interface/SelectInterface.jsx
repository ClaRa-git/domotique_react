import React from 'react'
import SliderInterface from './SliderInterface'; // <-- importe le vrai composant
import ColorInterface from './ColorInterface';
import SwitchInterface from './SwitchInterface';

// Component pour afficher l'interface personnalisée
const SelectInterface = ( { interfaceFeature, onChange } ) => {

    // Récupération des données pour la création de l'interface
    const label = interfaceFeature.label;
    const valeur = interfaceFeature.value;
    const unite = interfaceFeature?.unit ?? '';
    const mini = interfaceFeature?.minimum ?? 0;
    const maxi = interfaceFeature?.maximum ?? 100;

    // Liste des interfaces personnalisées (temporaire)
    const interfaces = {
        "Luminosité": SliderInterface,
        "Couleur": ColorInterface,
        "On/Off": SwitchInterface,
    };

    // Création du nom de l'interface
    const CustomInterface = interfaces[ label ];

    // Si l'interface n'existe pas, on retourne un message d'erreur
    if ( !CustomInterface ) {
        return <div>Interface non trouvée</div>;
    }

    return <CustomInterface
                label={ label }
                valeur={ valeur }
                mini={ mini }
                maxi={ maxi }
                unite={ unite }
                onChange={ onChange } />;
};

export default SelectInterface;
