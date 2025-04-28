import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaPlus, FaRegTrashAlt } from 'react-icons/fa';
import { RiArrowDownSFill, RiArrowRightSFill } from 'react-icons/ri';
import { API_URL } from '../../constants/apiConstant';
import { FaGear } from 'react-icons/fa6';
import selectDeviceData from '../../store/device/deviceSelector';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDefaultSettingsForDevices } from '../../store/device/deviceSlice';

// Affiche la liste des appareils
const DeviceList = ( { groupedDevices, setGroupedDevices, openMenuId, toggleMenu, allVibesForUser, onDeviceRemoved, refreshVibes } ) => {
    
    console.log( "groupedDevices", groupedDevices )
    // Messages d'erreur et de succès
    const [ error, setError ] = useState( null );
    const [ success, setSuccess ] = useState( null );

    // Récupération de dispatch
    const dispatch = useDispatch();

    // Affiche la visibilité des réglages
    const [ showSettings, setShowSettings ] = useState( false );

    // Récupération des settings par défaut de tous les devices
    const { loadingDevice, defaultSettingsForDevices } = useSelector( selectDeviceData );

    console.log( "defaultSettingsForDevices", defaultSettingsForDevices );

    useEffect( () => {
        try {
            dispatch( fetchDefaultSettingsForDevices() );
        } catch (error) {
            console.log( "Erreur lors de la récupération des settings par défaut", error );
            setError( "Une erreur est survenue lors de la récupération des settings par défaut" );
            setSuccess( null );
            resetMessage();            
        }
    }, []);

    // Supprime un objet d'une pièce
    const deleteFromRoom = async ( deviceId ) => {
        const confirm = window.confirm( 'Voulez-vous vraiment supprimer cet appareil de cette pièce ?' );

        if ( !confirm ) return;

            const confirmSetting = window.confirm( 'Voulez-vous vraiment supprimer tous les réglages de cet appareil ? Attention cela supprimera tous les réglages de tous les utilisateurs' );

            if ( !confirmSetting ) return;

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

    // Fonction pour ajouter une ambiance à un appareil
    const handleAddVibe = async ( deviceId, vibeId ) => {
        const confirm = window.confirm( 'Voulez-vous vraiment ajouter cette ambiance à cet appareil ?' );

        if ( !confirm ) return;

        const deviceSettings = [];
        defaultSettingsForDevices.forEach(setting => {
            if ( setting.device.id === deviceId ) {
                deviceSettings.push( setting );
            }
        });

        // On va tenter de remplir la base de données pour chaque setting
        for ( const setting of deviceSettings ) {
            try {
                const data = {
                    device: `/api/devices/${ deviceId }`,
                    vibe: `/api/vibes/${ vibeId }`,
                    feature: `/api/features/${ setting.feature.id }`,
                    value: setting.value
                };

                console.log( "data", data );

                axios.defaults.headers.post[ 'Content-Type' ] = 'application/ld+json';                
                const response = await axios.post( `${ API_URL }/settings?page=1&device.id=${deviceId}`, data );

                if ( response.status === 200 ){
                    console.log( "Réglage ajouté à l'appareil" )
                    setSuccess( 'Réglage ajouté à l\'appareil' );
                    setError( null );
                    resetMessage();
                }
            } catch ( error ) {
                console.log( `Erreur lors de l'ajout du réglage ${ setting.feature.label } à l'appareil ${ deviceId }`, error );
                setError( "Une erreur est survenue lors de l'ajout du réglage à l'appareil" );
                setSuccess( null );
                resetMessage();
            }
        }

        if (refreshVibes) {
            refreshVibes();
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
                                            console.log("vibe", vibe)

                                            // On récupère les settings du device
                                            const deviceSettings = vibe.settings.filter(setting => setting.device.id === device.id);

                                            return (
                                                <li key={index} className='border-2 rounded-lg p-2 mb-2' >
                                                    <div
                                                        onClick={() => setShowSettings(prev => prev === vibe.id ? null : vibe.id)}
                                                        className='cursor-pointer text-sm font-semibold'
                                                    >
                                                        {vibe.label}
                                                    </div>

                                                    {showSettings === vibe.id && (
                                                        console.log("viiiibe", vibe),
                                                        <div className='ml-2 mt-2' >
                                                            {deviceSettings.length > 0 ?
                                                            (
                                                                deviceSettings.map((setting, i) => (
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
                                                                <div>
                                                                    <p className='text-xs text-gray-400 italic' >
                                                                        Aucun réglage
                                                                    </p>
                                                                    <div className='flex items-center text-xs text-gray-600 mt-2' >
                                                                        Associer à cette vibe
                                                                        <FaPlus
                                                                            className='ml-2 cursor-pointer'
                                                                            onClick={() => handleAddVibe(device.id, vibe.id)}
                                                                        />
                                                                    </div>
                                                                </div>
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
