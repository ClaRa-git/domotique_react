import { useState } from 'react';

// Le composant SwitchToggle permet d'afficher un bouton de type switch
const SwitchToggle = ( { sendToParent } ) => {

    // Le state enabled permet de savoir si le switch est activé ou non
    const [ enabled, setEnabled ] = useState( false );

    // La fonction handleEnable permet de changer l'état du switch
    const handleEnable = () => {
        setEnabled( !enabled )
        sendToParent( !enabled );
    }

    return (
        <button
            onClick={ handleEnable }
            className={ `relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                enabled ?
                'bg-secondary-pink'
                :
                'bg-gray-300'
                }` }
            type='button'
        >
            <span
                className={ `inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                    enabled ?
                    'translate-x-6'
                    :
                    'translate-x-1' }` }
            />
        </button>
    );
};

export default SwitchToggle;
