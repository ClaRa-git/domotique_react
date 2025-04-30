import React from 'react';
import { RiArrowDownSFill, RiArrowRightSFill } from 'react-icons/ri';
import { FaMusic, FaPlus } from 'react-icons/fa6';

// Le composant SongDropdown permet d'afficher une liste de chansons à ajouter à une playlist
const SongDropdown = ( { isVisible, toggleDropdown, songs, addSongToPlaylist, playlistSongIds } ) => {

    return (
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
                <ul className='flex flex-col w-full text-white rounded-b-2xl justify-center items-center bg-primary' >
                    { songs.length > 0 ?
                    (
                        songs.map(( song ) => (
                            !playlistSongIds.includes( song[ '@id' ] ) && (
                                <div
                                    key={ song.id }
                                    className='flex flex-col w-full px-4 my-4'
                                >
                                    <li                                        
                                        className='text-sm mb-2 cursor-pointer hover:underline flex items-center justify-between'
                                        onClick={ () => addSongToPlaylist( song[ '@id' ] ) }
                                    >
                                        <div>
                                            <p className='font-bold text-base' >
                                                { song.title }
                                            </p>
                                            <p className='text-sm' >
                                                { song.artist }
                                            </p>
                                        </div>
                                        <FaPlus
                                            size={ 20 }
                                            className='ml-2'
                                        />
                                    </li>
                                    <hr className='border-t border-gray-300 my-2' />
                                </div>
                            )
                        ))
                    )
                    :
                    (
                        <li className='text-sm text-gray-500' >
                            Aucune chanson disponible
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default SongDropdown;
