import React, { useState } from 'react';
import { FaChevronDown, FaChevronRight, FaPlus } from 'react-icons/fa6';
import axios from 'axios';
import { API_URL } from '../../constants/apiConstant';

// Créer un composant DeviceDropdown qui affiche une liste d'appareils disponibles à ajouter à une pièce
const DeviceDropdown = ( { isVisible, toggleDropdown, devices, showDevices, roomId, onDeviceAdded } ) => {

    // Messages d'erreur et de succès
    const [ error, setError ] = useState( null );
    const [ success, setSuccess ] = useState( null );

    // Fonction pour ajouter un appareil à la pièce
    const handleAddDevice = async ( deviceId ) => {
        try {
            // Mettre à jour l'appareil avec l'ID de la pièce
            axios.defaults.headers.patch[ 'Content-Type' ] = 'application/merge-patch+json';
            const response = await axios.patch(`${ API_URL }/devices/${ deviceId }`, {
                room: `api/rooms/${ roomId }`
            });

            // Vérifier si la réponse est réussie
            if ( response.status === 200 ) {
                setSuccess( 'Appareil ajouté avec succès' );
                setError( null );
                // On appelle la fonction de rappel pour mettre à jour l'état parent
                onDeviceAdded();
            }
        } catch (error) {
            // Gérer les erreurs
            console.error( `Erreur lors de l'ajout de l'appareil ${ deviceId }`, error );
            setError( 'Erreur lors de l\'ajout de l\'appareil' );
            setSuccess( null );
        }
    }
    
    return (
        <div className='mb-6'>
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
            { devices && showDevices &&
                <div
                    onClick={ toggleDropdown }
                    className={`flex flex-row justify-between bg-primary text-white px-4 py-1 cursor-pointer ${ isVisible ? 'rounded-t-lg' : 'rounded-lg' }` }
                >
                    <div className='flex w-full justify-between'>
                        <div className='flex items-center'>
                            <FaPlus className='mr-2' />
                            <div className='flex items-center'>
                                Ajouter un objet connecté
                            </div>
                        </div>
                        <div className='flex items-center'>
                            { isVisible ?
                                <FaChevronDown />
                                :
                                <FaChevronRight />
                            }
                        </div>
                    </div>
                </div>
            }
            { isVisible && (
                <ul className='bg-primary px-4 py-2 rounded-b-lg' >
                    { devices.length > 0 ?
                    (
                        devices.map( ( device ) => (
                            <div key={ device.id } >
                                <li
                                    className='text-sm text-gray-800 mb-2 cursor-pointer flex items-center justify-between'
                                >
                                    { device.label }
                                    <FaPlus 
                                        size={ 16 }
                                        className='text-secondary-pink ml-2'
                                        onClick={ () => handleAddDevice( device.id ) }
                                    />
                                </li>
                                <hr className='border-t border-gray-300 my-2' />
                            </div>
                        ))
                    )
                    :
                    (
                        <li className='text-sm text-gray-500' >
                            Aucun appareil disponible
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default DeviceDropdown;
