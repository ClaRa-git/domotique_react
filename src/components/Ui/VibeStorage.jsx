import React, { useEffect, useState } from 'react'
import { API_ROOT } from '../../constants/apiConstant';
import axios from 'axios';
import { useDispatch  } from 'react-redux';
import PageLoader from '../Loader/PageLoader';
import { fetchAllVibesPlaying } from '../../store/vibe/vibeSlice';

const VibeLocalStrorage = ( { allVibesPlaying } ) => {

    // Récupération du dispatch
    const dispatch = useDispatch();

    const [ isLoading, setIsLoading ] = useState( false );

    const stopVibe = async ( vibeId, roomId, vibePlayingId ) => {

        // On avertit l'utilisateur que cela va arrêter la vibe dans toutes les rooms
        if ( !window.confirm( 'Voulez-vous vraiment arrêter cette vibe ?' ) ) {
            return;
        }
        
        try {
            setIsLoading( true );

            console.log( `Arrêt de la vibe : ${vibeId} dans la room : ${roomId}` );
            axios.defaults.headers.post[ 'Content-Type' ] = 'application/ld+json';
            const response = await axios.post(`${API_ROOT}/stop-vibe`, {
                vibeId: vibeId,
                roomId: roomId,
                vibePlayingId: vibePlayingId
            });

        } catch (error) {
            console.log( `Erreur lors de l'arrêt de la vibe : ${error}` );
        } finally {
            setIsLoading( false );
        }

        dispatch( fetchAllVibesPlaying() );
    }

    return ( isLoading ? <PageLoader />
        :
        allVibesPlaying && allVibesPlaying.length > 0 &&
            <div className='w-full p-4'>
                <div className='flex flex-col w-full justify-between items-center text-center bg-primary rounded-lg p-4 text-white'>
                    {allVibesPlaying.map(( vibe, index ) => (
                        <div
                            key={index}
                            className='flex w-full mb-2 justify-between items-center'
                        >
                            <p>
                                "{ vibe.vibe.label }" de { vibe.profile.username } en cours dans : {vibe.rooms[0].label}
                            </p>
                            <div
                                className='p-3 bg-secondary-orange rounded-lg cursor-pointer'
                                onClick={ () => { stopVibe( vibe.vibe.id, vibe.rooms[0].id, vibe.id ) }
                            }
                            >
                                Arrêter
                            </div>
                        </div>
                    ))}
                </div>
            </div>
    )
}

export default VibeLocalStrorage