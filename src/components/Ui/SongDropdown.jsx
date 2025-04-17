import React from 'react';
import { RiArrowDownSFill, RiArrowRightSFill } from 'react-icons/ri';
import { FaMusic, FaPlus } from 'react-icons/fa6';

// Le composant SongDropdown permet d'afficher une liste de chansons à ajouter à une playlist
const SongDropdown = ( { isVisible, toggleDropdown, songs, addSongToPlaylist, playlistSongIds } ) => {

    return (
        <div className='mb-6'>
            <div
                className='flex justify-between items-center bg-primary text-white font-bold text-lg px-4 py-3 m-4 rounded-lg mb-2 cursor-pointer shadow-md'
                onClick={ toggleDropdown }
            >
                <p>
                    Ajouter une chanson
                </p>
                { isVisible ? 
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

            { isVisible && (
                <ul className='bg-gray-50 p-4 rounded-lg mb-2 ml-4 shadow-inner'>
                    { songs.length > 0 ? (
                        songs.map(( song ) => (
                            !playlistSongIds.includes( song[ '@id' ] ) && (
                                <div key={ song.id }>
                                    <li                                        
                                        className='text-sm text-gray-800 mb-2 cursor-pointer hover:underline flex items-center justify-between'
                                        onClick={ () => addSongToPlaylist( song[ '@id' ] ) }
                                    >
                                        { song.title }
                                        <FaPlus
                                            size={ 20 }
                                            className='text-secondary-pink ml-2'
                                        />
                                    </li>
                                    <hr className='border-t border-gray-300 my-2' />
                                </div>
                            )
                        ))
                    ) : (
                        <li className='text-sm text-gray-500'>
                            Aucune chanson disponible
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default SongDropdown;
