import React, { useEffect, useState } from 'react';
import { RiArrowDownSFill, RiArrowRightSFill } from 'react-icons/ri';
import { FaMusic, FaPlus } from 'react-icons/fa6';
import { fetchAllSongs } from '../../store/song/songSlice';
import { useDispatch, useSelector } from 'react-redux';
import selectSongData from '../../store/song/songSelector';
import PageLoader from '../Loader/PageLoader';
import { FaMinus } from 'react-icons/fa';

// Le composant SongDropdown permet d'afficher une liste de chansons à ajouter à une playlist
const SongDropdown = ( { isVisible, toggleDropdown, addSongsToPlaylist, playlistSongIds } ) => {

    // Récupération du dispatch
    const dispatch = useDispatch();

    // State
    const [ selectedSongs, setSelectedSongs ] = useState( [] );

    // Récupérer les chansons disponibles
    useEffect( () => {
        dispatch( fetchAllSongs() );
    }, [dispatch]);

    const { loadingSongs, allSongs } = useSelector( selectSongData );

    const handleSongClick = ( songId ) => {
        // Vérifie si la chanson est déjà sélectionnée
        if ( selectedSongs.includes( songId ) ) {
            // Si oui, on la retire de la liste
            setSelectedSongs( selectedSongs.filter( id => id !== songId ) );
        } else {
            // Sinon, on l'ajoute à la liste
            setSelectedSongs( [ ...selectedSongs, songId ] );
        }
    }

    return ( loadingSongs ? <PageLoader />
        :
        <div className='w-full p-4 mb-6' >
            <div
                className={`flex justify-between items-center w-full bg-primary cursor-pointer text-white px-4 py-1 ${isVisible ? 'rounded-t-lg' : 'rounded-lg'} transition`}
                onClick={ toggleDropdown }
            >
                <div className='flex items-center'>
                    <FaPlus className='mr-2' />
                    <div className='flex items-center'>
                        Ajouter une chanson
                    </div>
                </div>   
                { isVisible ? 
                    <RiArrowDownSFill size={ 24 } />
                    :
                    <RiArrowRightSFill
                        size={ 24 } />
                }
            </div>

            { isVisible && (
                <div className='flex flex-col w-full text-white rounded-b-2xl justify-center items-center bg-primary' >
                    <ul className='flex flex-col w-full' >
                        { allSongs.length > 0 && playlistSongIds.length !== allSongs.length ?
                        (
                            <div>
                                { allSongs.map(( song ) => (
                                        !playlistSongIds.includes( song[ '@id' ] ) && (
                                            <div
                                                key={ song.id }
                                                className='flex flex-col w-full px-4 my-4'
                                            >
                                                <li
                                                    className={`text-sm mb-2 cursor-pointer hover:underline flex items-center justify-between ${ selectedSongs.includes( song[ '@id' ] ) ? 'text-secondary-orange font-bold' : 'text-white' }`}
                                                    onClick={ () => handleSongClick( song[ '@id' ] ) }
                                                >
                                                    <div>
                                                        <p className='font-bold text-base' >
                                                            { song.title }
                                                        </p>
                                                        <p className='text-sm' >
                                                            { song.artist }
                                                        </p>
                                                    </div>
                                                    { selectedSongs.includes( song[ '@id' ] ) ?
                                                        <FaMinus
                                                            size={ 20 }
                                                            className='ml-2'
                                                        />
                                                        :
                                                        <FaPlus
                                                            size={ 20 }
                                                            className='ml-2'
                                                        />
                                                    }
                                                    
                                                </li>
                                                <hr className='border-t border-gray-300 my-2' />
                                            </div>
                                        )
                                    ))
                                }
                                <div className='flex w-full items-center justify-between p-4' >
                                    <div
                                        className='bg-secondary-orange p-3 rounded-lg transition cursor-pointer'
                                        onClick={ () => {
                                                setSelectedSongs( [] );
                                                toggleDropdown()
                                            }
                                        }
                                    >
                                        Annuler
                                    </div>
                                    <div
                                        className='bg-secondary-orange font-bold p-3 rounded-lg transition cursor-pointer'
                                        onClick={ () => {
                                            addSongsToPlaylist( selectedSongs );
                                            setSelectedSongs( [] );
                                            toggleDropdown();
                                        } }
                                    >
                                        Ajouter
                                    </div>
                                </div>
                            </div>
                        )
                        :
                        (
                            <li className='text-sm p-4' >
                                Aucune chanson disponible
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SongDropdown;
