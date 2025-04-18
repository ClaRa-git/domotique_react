import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa6';
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
            { devices && showDevices &&
                <div
                    onClick={ toggleDropdown }
                    className='flex flex-row justify-between bg-primary text-white mb-4 px-4 py-1 rounded-lg cursor-pointer'
                >
                    Ajouter un appareil à la pièce
                    <FaPlus className='mt-1'/>
                </div>
            }
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
            { isVisible && (
                <ul className='bg-gray-50 p-4 rounded-lg mb-2 ml-4 shadow-inner' >
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
