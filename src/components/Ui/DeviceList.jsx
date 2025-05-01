import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaChevronDown, FaChevronRight, FaPlus, FaRegTrashAlt } from 'react-icons/fa';
import { RiArrowDownSFill, RiArrowRightSFill } from 'react-icons/ri';
import { API_URL } from '../../constants/apiConstant';
import { FaGear } from 'react-icons/fa6';
import selectDeviceData from '../../store/device/deviceSelector';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDefaultSettingsForDevices } from '../../store/device/deviceSlice';
import VibeCard from '../Card/VibeCard';
import { Link, useLocation, useNavigate } from 'react-router-dom';

// Affiche la liste des appareils
const DeviceList = ( { groupedDevices, setGroupedDevices, openMenuId, toggleMenu, allVibesForUser, onDeviceRemoved, refreshVibes } ) => {
    
    console.log( "groupedDevices", groupedDevices )
    // Messages d'erreur et de succès
    const [ error, setError ] = useState( null );
    const [ success, setSuccess ] = useState( null );

    // Récupération de dispatch
    const dispatch = useDispatch();

    // Récupération de location
    const location = useLocation();

    // Récupération de navigate
    const navigate = useNavigate();

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

    // Fonction pour naviguer vers la page de création d'ambiance
    const goToSettings = ( vibeId, deviceId, roomId ) => {
        navigate( `/setting?vibeId=${vibeId}&deviceId=${deviceId}`, {
            state: {
                from: location,
                roomId: roomId,
            },
        });
    };


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
                                        className='bg-primary h-8 w-8 text-white rounded-lg p-2 mr-2 cursor-pointer'
                                        onClick={ () => deleteFromRoom( device.id ) }
                                    />
                                    { openMenuId === device.id ? 
                                        <FaChevronDown />
                                        :
                                        <FaChevronRight />
                                    }
                                </div>
                            </div>
                            { openMenuId === device.id && (
                                <div className='flex items-center justify-center mx-4' >
                                    <div className='flex flex-col w-full bg-primary text-white rounded-2xl justify-center items-center' >  
                                        <div className='flex w-full justify-start items-center py-2 pl-4'>
                                            Liste des vibes
                                        </div>  
                                        <div className='w-full p-4'>
                                            <div className='w-full '>
                                                <hr />
                                            </div>
                                        </div>        
                                        <div className="grid grid-cols-5 gap-5 p-5 grow place-content-center">
                                            { allVibesForUser.map( ( vibe, index ) => (
                                                <div
                                                    key={ index }
                                                    onClick={ () => goToSettings( vibe.id, device.id ) }
                                                >
                                                    <VibeCard
                                                        vibe={ vibe }
                                                    />
                                                </div>
                                            ))}
                                        </div>                        
                                    </div>
                                </div>
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
