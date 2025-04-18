import axios from 'axios';
import React, { useState } from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';
import { RiArrowDownSFill, RiArrowRightSFill } from 'react-icons/ri';
import { API_URL } from '../../constants/apiConstant';
import { FaGear } from 'react-icons/fa6';

// Affiche la liste des appareils
const DeviceList = ( { groupedDevices, setGroupedDevices, openMenuId, toggleMenu, allVibesForUser, onDeviceRemoved } ) => {
    
    console.log( "groupedDevices", groupedDevices )
    // Messages d'erreur et de succès
    const [ error, setError ] = useState( null );
    const [ success, setSuccess ] = useState( null );

    // Affiche la visibilité des réglages
    const [ showSettings, setShowSettings ] = useState( false );

    // Supprime un objet d'une pièce
    const deleteFromRoom = async ( deviceId ) => {
        const confirm = window.confirm( 'Voulez-vous vraiment supprimer cet appareil de cette pièce ?' );

        if ( !confirm ) return;

        const confirmSetting = window.confirm( 'Voulez-vous vraiment supprimer tous les réglages de cet appareil ? Attention cela supprimera tous les réglages de tous les utilisateurs' );

        try {
            // On va supprimer les settings de ce device
            // On récupère tous les settings
            const responseSetting = await axios.get( `${ API_URL }/settings?page=1&device.id=${ deviceId }` );
            const settings = responseSetting.data.member;
            // On va les supprimer un par un
            for ( const setting of settings ) {
                const responseDeleteSetting = await axios.delete( `${ API_URL }/settings/${ setting.id }` );
                if( responseDeleteSetting.status === 204 ){
                    console.log( "Réglage supprimé" )
                }
            }

            // On va détacher le device de la room en mettant l'id de la room à null
            axios.defaults.headers.patch[ 'Content-Type' ] = 'application/merge-patch+json';
            const response = await axios.patch( `${ API_URL }/devices/${ deviceId }`, {
                room: null
            });

            if ( response.status === 200 ){
                console.log( "Appareil supprimé de la pièce" )
                setSuccess( 'Appareil supprimé de la pièce' );
                setError( null );
                resetMessage();
                
                // On met à jour groupedDevices
                const updatedGroupedDevices = { ...groupedDevices };
                // On va supprimer le device de la liste
                const deviceType = Object.keys( updatedGroupedDevices ).find( type => updatedGroupedDevices[ type ].some( device => device.id === deviceId ));
                if ( deviceType ) {
                    updatedGroupedDevices[ deviceType ] = updatedGroupedDevices[ deviceType ].filter( device => device.id !== deviceId );
                    // Si le tableau est vide, on supprime la clé
                    if ( updatedGroupedDevices[ deviceType ].length === 0 ) {
                        delete updatedGroupedDevices[ deviceType ];
                    }
                }

                // On renvoie les données au parent
                setGroupedDevices( updatedGroupedDevices );

                // On rafraîchit les devices sans room
                if ( typeof onDeviceRemoved === 'function' ) {
                    onDeviceRemoved();
                }
            }
        } catch ( error ) {
            console.log( `Erreur lors de la suppression de l'appareil ${ deviceId }`, error );
            setError( "Une erreur est survenue lors de la suppression de l'appareil" );
            setSuccess( null );
            resetMessage();
        }
    }

    // Permet d'effacer les messages success et error après 3 secondes
	const resetMessage = () => {
		setTimeout( () => {
			setSuccess( '' );
			setError( '' );
		}, 3000 )
	}

    return Object.entries( groupedDevices ).map( ( [ type, devices ] ) => (
        <div
            key={ type }
            className='flex flex-col mb-4 w-full'
        >
            <h3 className='font-bold bg-secondary-orange text-white text-center p-2 rounded-lg mb-4' >
                { type }
            </h3>
            { error && 
                <p className='text-red-500 text-center text-sm m-4' >
                    { error }
                </p>
            }
            { success && 
                <p className='text-green-500 text-center text-sm m-4' >
                    { success }
                </p>
            }
            <ul>
                { devices.map( ( device ) => (
                    console.log( "device", device ),
                    <div key={ device.id } >
                        <li className='relative' >
                            <div 
                                className='flex justify-between items-center bg-white p-4 rounded-lg mb-2 cursor-pointer'
                                onClick={ () => toggleMenu( device.id ) }
                            >
                                { device.label }
                                <div className='flex items-center' >
                                    <FaRegTrashAlt
                                        size={ 20} 
                                        className='bg-secondary-orange h-8 w-8 text-white rounded-lg p-2 mr-2 cursor-pointer'
                                        onClick={ () => deleteFromRoom( device.id ) }
                                    />
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
                            </div>
                            { openMenuId === device.id && (
                                <ul className='bg-gray-50 p-4 rounded-lg mb-2 ml-4' >
                                    <p className='font-semibold mb-2' >
                                        Vibes :
                                    </p>
                                    {allVibesForUser.length > 0 ?
                                    (
                                        allVibesForUser.map((vibe, index) => {
                                            // Filtrer les réglages liés à cette vibe
                                            const vibeSettings = device.settings?.filter(setting => setting.vibe?.id === vibe.id) || [];

                                            return (
                                                <li key={index} className='border-2 rounded-lg p-2 mb-2' >
                                                    <div
                                                        onClick={() => setShowSettings(prev => prev === vibe.id ? null : vibe.id)}
                                                        className='cursor-pointer text-sm font-semibold'
                                                    >
                                                        {vibe.label}
                                                    </div>

                                                    {showSettings === vibe.id && (
                                                        <div className='ml-2 mt-2' >
                                                            {vibeSettings.length > 0 ?
                                                            (
                                                                vibeSettings.map((setting, i) => (
                                                                    <div
                                                                        className='flex items-center justify-between text-xs text-gray-600 mb-1'
                                                                        key={i}
                                                                    >
                                                                        <span>
                                                                            - {setting.feature.label} : {setting.value} {setting.feature.unit?.symbol}
                                                                        </span>
                                                                        <FaGear className='ml-2' />
                                                                    </div>
                                                                ))
                                                            )
                                                            :
                                                            (
                                                                <p className='text-xs text-gray-400 italic' >
                                                                    Aucun réglage
                                                                </p>
                                                            )}
                                                        </div>
                                                    )}
                                                </li>
                                            );
                                        })
                                    ) : (
                                        <li className='text-sm text-gray-500' >
                                            Aucune vibe
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
    ));
};

export default DeviceList;
