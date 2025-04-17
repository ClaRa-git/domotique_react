import React from 'react'
import SliderInterface from './SliderInterface'; // <-- importe le vrai composant

const SelectInterface = ({ interfaceFeature }) => {

    const label = interfaceFeature.label;
    const unit = interfaceFeature?.unit?.symbol ?? '';

    const interfaces = {
        "Luminosité": SliderInterface,
    };

    const CustomInterface = interfaces[ label ];

    if (!CustomInterface) {
        return <div>Interface non trouvée</div>;
    }

    return <CustomInterface label={ label } min={ 0 } max={ 100 } unit={ unit }/>;
};

export default SelectInterface;
