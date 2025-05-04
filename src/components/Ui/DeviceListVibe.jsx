import React, { useState } from 'react'
import { FaGear } from 'react-icons/fa6';
import { IoClose } from 'react-icons/io5';
import { RiArrowDownSFill, RiArrowRightSFill } from 'react-icons/ri';
import SelectInterface from '../Interface/SelectInterface';
import { useLocation, useNavigate } from 'react-router-dom';

// Affiche la liste des appareils
const DeviceListVibe = ( { room, vibeId } ) => {

    // Récupération de navigate
    const navigate = useNavigate();

    // Récuparation de location
    const location = useLocation();

    // State pour gérer l'ouverture et la fermeture des menus
	const [ openMenuId, setOpenMenuId ] = useState( null );

    // Récupère la liste des appareils de la pièce
    const devices = room?.devices || [];

    const [ isVisible, setIsVisible ] = useState( false );

    const [ selectedSetting, setSelectedSetting ] = useState( null ); // Gère la popup

    const handleOpenPopup = ( setting ) => {
        setSelectedSetting( setting ); // Ouvre avec le bon réglage
    };

    const handleClosePopup = () => {
        setSelectedSetting( null ); // Ferme la popup
    };


    // Regroupe les appareils par type
    const groupedDevices = devices.reduce( ( acc, device ) => {
        const typeLabel = device.deviceType.label;
        if ( !acc[ typeLabel ] ) {
        acc[ typeLabel ] = [];
        }
        acc[ typeLabel ].push( device );
        return acc;
    }, {});

    // Fonction pour naviguer vers la page des settings
    const goToSettings = ( vibeId, deviceId, roomId ) => {
        navigate( `/setting?vibeId=${vibeId}&deviceId=${deviceId}`, {
            state: {
                from: location,
                roomId: roomId
            },
        });
    };

    return (
        <div className='flex flex-col items-center justify-center w-full mb-4' >
            { Object.entries( groupedDevices ).map( ( [ type, devices ] ) => (
                <div
                    key={ type }
                    className='flex flex-col mb-4 w-full'
                >
                    <h3 className='font-bold bg-secondary-orange text-white text-center p-2 rounded-lg mb-4' >
                        { type }
                    </h3>
                    <ul>
                        { devices.map( ( device ) => (
                            <div key={ device.id }>
                                <li className='relative' >
                                <div 
                                    className='flex justify-between items-center bg-white p-4 rounded-lg mb-2 cursor-pointer'
                                    onClick={ () => {
                                            goToSettings( vibeId, device.id, room.id );
                                        }
                                    }
                                >
                                    { device.label }
                                    { openMenuId === device.id ?
                                        <RiArrowDownSFill
                                            size={ 24 }
                                            className='text-secondary-pink'
                                        />
                                        : 
                                        <RiArrowRightSFill
                                            size={ 24 }
                                            className='text-secondary-pink'
                                        />
                                    }
                                </div>
                                
                                </li>
                                <hr className='border-t border-gray-300 my-2' />
                            </div>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    )
}

export default DeviceListVibe