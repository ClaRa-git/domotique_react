import React from 'react';
import VibeSetting from './VibeSetting';

// Le composant VibeList permet d'afficher la liste des ambiances en fonction de la pièce
const VibeList = ( { vibes, openMenuId, toggleMenu, roomId } ) => {

    return (
        <ul className='mb-16' >
            {vibes.map( ( vibe ) => (
                <VibeSetting
                    key={ vibe.id }
                    vibe={ vibe }
                    openMenuId={ openMenuId }
                    toggleMenu={ toggleMenu }
                    roomId={ roomId } 
                />
            ))}
        </ul>
    );
};

export default VibeList;
