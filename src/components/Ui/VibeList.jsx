import React from 'react';
import { RiArrowDownSFill } from 'react-icons/ri';
import { FaGear } from 'react-icons/fa6';
import { API_ROOT } from '../../constants/apiConstant';

const VibeList = ({ vibes, openMenuId, toggleMenu, handleData, dataDeviceVibe, roomId }) => {
console.log('VibeList', vibes);
    return (
        <ul className='mb-16'>
            {vibes.map((vibe) => (
                <div key={vibe.id}>
                    <li className='relative'>
                        <div 
                            className='flex justify-between items-center bg-white p-4 rounded-lg mb-2 cursor-pointer'
                            onClick={() => toggleMenu(vibe.id)}
                        >
                            <img src={`${API_ROOT}/images/icons/${vibe.icon.imagePath}`} alt="icone" />
                            {vibe.label}
                            <RiArrowDownSFill 
                                size={24} 
                                className='text-secondary-pink' 
                                onClick={() => handleData(roomId, vibe.id)} 
                            />
                        </div>

                        {openMenuId === vibe.id && (
                            <ul className='bg-gray-50 p-4 rounded-lg mb-2 ml-4'>
                                <p className='text-sm font-semibold mb-2'>Réglages :</p>
                                {dataDeviceVibe?.map((setting, index) => (
                                    <li key={index} className='text-sm text-gray-700 mb-2 border-2 rounded-lg p-2'>
                                        <div className='flex justify-between items-center mb-2 w-full underline'>
                                            <h3 className='font-bold'>{setting.deviceLabel}</h3>
                                            <FaGear />
                                        </div>
                                        - {setting.label}: {setting.value} {setting.symbol ?? ''}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                    <hr className='border-t border-gray-300 my-2' />
                </div>
            ))}
        </ul>
    );
};

export default VibeList;
