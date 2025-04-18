import React from 'react'
import SliderInterface from './SliderInterface'; // <-- importe le vrai composant

// Component pour afficher l'interface personnalisée
const SelectInterface = ( { interfaceFeature } ) => {

    // Récupération des données pour la création de l'interface
    const label = interfaceFeature.label;
    const unit = interfaceFeature?.unit?.symbol ?? '';

    // Liste des interfaces personnalisées (temporaire)
    const interfaces = {
        "Luminosité": SliderInterface,
    };

    // Création du nom de l'interface
    const CustomInterface = interfaces[ label ];

    // Si l'interface n'existe pas, on retourne un message d'erreur
    if ( !CustomInterface ) {
        return <div>Interface non trouvée</div>;
    }

    return <CustomInterface label={ label } min={ 0 } max={ 100 } unit={ unit } />;
};

export default SelectInterface;
