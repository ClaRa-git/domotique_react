import React, { useEffect, useState } from 'react'
import MenuBar from '../../components/Ui/MenuBar'
import { useDispatch, useSelector } from 'react-redux';
import { useAuthContext } from '../../contexts/AuthContext';
import { fetchUserPlaylists } from '../../store/user/userSlice';
import selectUserData from '../../store/user/userSelector';
import PageLoader from '../../components/Loader/PageLoader';
import PlaylistCard from '../../components/Card/PlaylistCard';
import { FaPlus } from 'react-icons/fa6';
import PopupNewPlaylist from '../../components/Popup/PopupNewPlaylist';

// Page d'affichage des playlists de l'utilisateur
const Playlist = () => {
    
    // Récupération du dispatch
    const dispatch = useDispatch();

    // Récupération de l'utilisateur
    const { userId } = useAuthContext();
    
    // State de visibilité du popup
    const [ isVisible, setIsVisible ] = useState( false );

    // Récupération des playlists de l'utilisateur
    useEffect(() => {
        dispatch( fetchUserPlaylists( userId ) );
    }, [ dispatch, userId ] );

    const { loading, userPlaylists } = useSelector( selectUserData );

    // Gestion du click pour afficher le popup
    const handleClick = () => {
        setIsVisible( true );
    }

  return (
    loading ? <PageLoader />
    :
    <div>
        <MenuBar />
        <div
            onClick={ handleClick }
            className='flex flex-row justify-between bg-primary text-white m-4 px-4 py-1 rounded-lg hover:cursor-pointer'
        >
            <p>
                Créer une nouvelle playlist...
            </p>
            <FaPlus className='mt-1' />
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 mb-16' >
            { userPlaylists && 
                userPlaylists.map( ( playlist, index ) => {
                    return (
                        <div
                            key={ index }
                            className='flex justify-center items-center'
                        >
                            <PlaylistCard playlist={ playlist } />
                        </div>
                    )
            })}
        </div>
        { isVisible &&
            <PopupNewPlaylist
                callable={ () => setIsVisible( false) }
                userId={ userId }
            />
        }
    </div>
  )
}

export default Playlist