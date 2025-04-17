import React, { useState } from 'react'
import { FaGear } from 'react-icons/fa6';
import { IoClose } from 'react-icons/io5';
import { RiArrowDownSFill, RiArrowRightSFill } from 'react-icons/ri';
import SelectInterface from '../Interface/SelectInterface';

// Affiche la liste des appareils
const DeviceListVibe = ( { room } ) => {

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

    return (
        <div className='flex flex-col items-center justify-center w-full mb-4'>
            { Object.entries( groupedDevices ).map( ( [ type, devices ] ) => (
                <div
                    key={ type }
                    className='flex flex-col mb-4 w-full'
                >
                    <h3 className='font-bold bg-secondary-orange text-white text-center p-2 rounded-lg mb-4'>
                        { type }
                    </h3>
                    <ul>
                        { devices.map( ( device ) => (
                            <div key={ device.id }>
                                <li className='relative'>
                                <div 
                                    className='flex justify-between items-center bg-white p-4 rounded-lg mb-2 cursor-pointer'
                                    onClick={ () => {
                                            setOpenMenuId( device.id );
                                            handleClosePopup();
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
                                { openMenuId === device.id && (
                                    <ul className='bg-gray-100 p-4 rounded-lg mb-2 ml-4'>
                                        <p className='text-sm font-semibold mb-2'>
                                            Réglages :
                                        </p>
                                        { device.settings && device.settings.length > 0 ?
                                        (
                                            device.settings.map( ( setting, index ) => (
                                                <li
                                                    key={ index }
                                                    className='text-sm text-gray-700 mb-2 border-2 rounded-lg p-2'
                                                >
                                                    <div className='flex justify-between items-center mb-2 w-full underline'>
                                                        <h3 className='font-bold'>
                                                            { setting.label }
                                                        </h3>
                                                    </div>
                                                    <div className='flex justify-between items-center mb-2'>
                                                        - { setting.feature.label } : { setting.value } { setting.feature?.unit?.symbol ?? ''}
                                                        <FaGear
                                                            onClick={ () => handleOpenPopup( setting ) }
                                                            className="cursor-pointer ml-2"
                                                        />

                                                    </div>
                                                    { selectedSetting === setting &&
                                                    (
                                                        <div className='z-30 fixed inset-0 backdrop-blur flex items-center justify-center'>
                                                            <div className="flex flex-col relative w-11/12 max-w-md rounded-2xl justify-center items-center bg-primary text-white shadow-lg">
                                                                <div className='flex flex-col w-full justify-center'>
                                                                    <div className='flex justify-end'>
                                                                        <IoClose
                                                                            size={ 20 }
                                                                            className='mr-4 mt-4 cursor-pointer'
                                                                            onClick={ () => setSelectedSetting( null ) }
                                                                        />
                                                                    </div>
                                                                    <div className='flex flex-col items-center justify-center m-4'>
                                                                        <h3 className='font-bold text-lg mb-4 text-center border-1 p-2 rounded-lg'>                                                                            
                                                                            <div>Réglages : </div>
                                                                            <div>{ device.label }</div>
                                                                        </h3>
                                                                        <SelectInterface interfaceFeature={ setting.feature } />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                </li>
                                            ))
                                        )
                                        : 
                                        (
                                            <li className='text-sm text-gray-500'>
                                                Aucun réglage
                                            </li>
                                        )}
                                    </ul>
                                )}
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