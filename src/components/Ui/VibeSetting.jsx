import React, { useEffect, useState } from 'react'
import PageLoader from '../Loader/PageLoader';
import { API_ROOT } from '../../constants/apiConstant';
import { RiArrowDownSFill, RiArrowRightSFill } from 'react-icons/ri';
import axios from 'axios';
import { FaGear } from 'react-icons/fa6';

// Le composant VibeSetting permet d'afficher les réglages d'une ambiance
const VibeSetting = ( { vibe, openMenuId, toggleMenu , roomId } ) => {

    // State pour gérer les données
    const [ dataDeviceVibe, setDataDeviceVibe ] = useState( null );

    // State pour gérer le chargement des données
    const [ isLoading, setIsLoading ] = useState( true );

    useEffect( () => {      
        // Mise à jour du loading  
        setIsLoading( true );
        // Fonction pour récupérer les données des devices
        const fetchData = async () => {
            const data = {
                roomId: roomId,
                vibeId: vibe.id
            };

            // Appel de l'API pour récupérer les données
            try {
                const response = await axios.post( `${ API_ROOT }/service-device`, data, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
        
                // Mise à jour des données dans le state
                setDataDeviceVibe( response.data );
            } catch ( error ) {
                console.error( `Erreur lors de la récupération des données : ${ error }` );
            } finally {
                // Fin du chargement
                setIsLoading( false );
            }
        }

        fetchData();
    }, [ roomId, vibe.id ] );

  return (
    isLoading ? <PageLoader />
    :
    <div>
        <li className='relative' >
            <div 
                className='flex justify-between items-center bg-white p-4 rounded-lg mb-2 cursor-pointer'
                onClick={ () => toggleMenu( vibe.id ) }
            >
                <img
                    src={ `${ API_ROOT }/images/icons/${ vibe.icon.imagePath }` }
                    alt="icone"
            />
                { vibe.label }
                { openMenuId === vibe.id ?
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

            { openMenuId === vibe.id && (
                <ul className='bg-gray-50 p-4 rounded-lg mb-2 ml-4' >
                    <p className='text-sm font-semibold mb-2' >
                        Réglages :
                    </p>
                    { dataDeviceVibe?.map( ( setting, index ) => (
                        <li
                            key={ index }
                            className='text-sm text-gray-700 mb-2 border-2 rounded-lg p-2'
                        >
                            <div className='flex justify-between items-center mb-2 w-full underline' >
                                <h3 className='font-bold' >
                                    { setting.deviceLabel }
                                </h3>
                                <FaGear />
                            </div>
                            - { setting.label } : { setting.value } { setting.symbol ?? '' }
                        </li>
                    ))}
                </ul>
            )}
        </li>
        <hr className='border-t border-gray-300 my-2' />
    </div>
  )
}

export default VibeSetting