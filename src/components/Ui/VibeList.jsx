import React from 'react';
import { RiArrowDownSFill, RiArrowRightSFill } from 'react-icons/ri';
import { FaGear } from 'react-icons/fa6';
import { API_ROOT } from '../../constants/apiConstant';
import VibeSetting from './VibeSetting';

const VibeList = ({ vibes, openMenuId, toggleMenu, roomId }) => {

    return (
        <ul className='mb-16'>
            {vibes.map((vibe) => (
                <VibeSetting
                    key={vibe.id}
                    vibe={vibe}
                    openMenuId={openMenuId}
                    toggleMenu={toggleMenu}
                    roomId={roomId} 
                />
            ))}
        </ul>
    );
};

export default VibeList;
