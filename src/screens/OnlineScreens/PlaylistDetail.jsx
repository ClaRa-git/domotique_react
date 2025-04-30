import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { fetchPlaylist } from '../../store/user/userSlice';
import selectUserData from '../../store/user/userSelector';
import { RiArrowLeftSFill } from 'react-icons/ri';
import { API_ROOT, API_URL } from '../../constants/apiConstant';
import { FaPen, FaRegTrashAlt } from 'react-icons/fa';
import PageLoader from '../../components/Loader/PageLoader';
import SongCard from '../../components/Card/SongCard';
import axios from 'axios';
import SongDropdown from '../../components/Ui/SongDropdown';
import CustomInput from '../../components/Ui/CustomInput';

// Page de détails d'une playlist
const PlaylistDetail = () => {

    // Récupérer l'id de la playlist dans l'url
    const params = useParams();
    const { id } = params;

    // States
    const [ availableSongs, setAvailableSongs ] = useState( [] );
    const [ isEditing, setIsEditing ] = useState( false );
    const [ newTitle, setNewTitle ] = useState( '' );

    // State pour afficher ou non le menu
    const [ isVisible, setIsVisible ] = useState( false );
    const [ isLoading, setIsLoading ] = useState( false );

    // State pour les messages d'erreur et de succès
    const [ error, setError ] = useState( null );
    const [ success, setSuccess ] = useState( null );

    // Récupérer le navigate
    const navigate = useNavigate();

    // Récupérer le dispatch
    const dispatch = useDispatch();

    // Récupérer la playlist dans le store
    useEffect( () => {
        dispatch( fetchPlaylist( id ) );
    }, [ dispatch, id ] );

    const { loading, playlist } = useSelector( selectUserData );

    // Récupérer les chansons disponibles
    useEffect( () => {
        const fetchSongs = async () => {
            try {
                const response = await axios.get( `${ API_URL }/songs` );
                setAvailableSongs( response.data.member );
            } catch ( error ) {
                console.error( 'Erreur lors du chargement des chansons', error );
            }
        };

        fetchSongs();
    }, []);

    // Récupérer l'image de la playlist
    const imgPath = playlist?.songs?.length > 0 ?
    playlist?.songs[ 0 ]?.imagePath
    : 'song.jpg';
    
    const imgPlaylist = `${ API_ROOT }/upload/images/songs/${ imgPath }`;

    // Récupérer les chansons de la playlist
    const songs = playlist?.songs;

    // Remettre à zéro les messages d'erreur et de succès après 3 secondes
    const resetMessage = () => {
		setTimeout( () => {
			setSuccess( '' );
			setError( '' );
		}, 3000 )
	}

    // Supprimer une chanson de la playlist
    const handleDeleteSong = async ( idSong ) => {
        const confirm = window.confirm( 'Voulez-vous vraiment supprimer cette musique ?' );

        if ( !confirm ) return;

        try {
            // On doit récupérer le tableau d'ids de la playlist
            const songIds = playlist?.songs && playlist?.songs?.map( song => song[ '@id' ] );
            // On va enlever du tableau l'id recu en paramètre
            const newSongIds = songIds.filter( songId => songId !== idSong );
            
            // On va mettre a jour la playlist dans la bdd
            axios.defaults.headers.patch[ 'Content-Type' ] = 'application/merge-patch+json';
            const response = await axios.patch( `${ API_URL }/playlists/${ playlist.id }`, {
                songs: newSongIds
            });

            if( response.status === 200 ){
                // On va mettre à jour le store
                dispatch( fetchPlaylist( playlist.id ) );
                setSuccess( 'La chanson a bien été supprimée de la playlist' );
                setError( '' );
                resetMessage();
            }
        } catch ( error ) {
            console.log( `Erreur lors de la suppression de la chanson ${ id }`, error );
            setError( "Une erreur est survenue lors de la suppression de la chanson" );
            setSuccess( '' );
            resetMessage();
        }
    }

    // Supprimer la playlist
    const handleDeletePlaylist = async () => {
        const confirm = window.confirm( 'Voulez-vous vraiment supprimer cette playlist ?' );

        if ( !confirm ) return;

        try {
            const response = await axios.delete( `${ API_URL }/playlists/${ playlist.id }` );

            if( response.status === 204 ){
                // On va rediriger vers la page des playlists
                setSuccess( 'La playlist a bien été supprimée' );
                setError( '' );
                resetMessage();
                navigate( '/playlist' );
            }
        } catch ( error ) {
            console.log( `Erreur lors de la suppression de la playlist ${ playlist.id }`, error );
            setError( "Une erreur est survenue lors de la suppression de la playlist" );
            setSuccess( '' );
            resetMessage();
        }
    }

    const handleAddSong = async ( songId ) => {
        try {
            const currentSongIds = playlist?.songs.map( song => song[ '@id' ] );
            const newSongId = `${ songId }`;
            
            if ( currentSongIds.includes( newSongId ) ) {
                alert( "Cette chanson est déjà dans la playlist." );
                return;
            } else {
                // on ajoute le nouvel id de chanson à la playlist
                currentSongIds.push( newSongId );
            }
    
            axios.defaults.headers.patch[ 'Content-Type' ] = 'application/merge-patch+json';
            const response = await axios.patch( `${ API_URL }/playlists/${ playlist.id }`, {
                songs: currentSongIds
            });
    
            if ( response.status === 200 ) {
                dispatch( fetchPlaylist( playlist.id ) );
                setIsVisible( false ); // Fermer le menu
                setSuccess( 'La chanson a bien été ajoutée à la playlist' );
                setError( '' );
                resetMessage();
            }
        } catch (error) {
            console.error( "Erreur lors de l'ajout de la chanson", error );
        }
    }

    // Mettre à jour le titre de la playlist
    const handleEditTitle = async () => {
        try {
            // Mise à jour par le patch
            axios.defaults.headers.patch[ 'Content-Type' ] = 'application/merge-patch+json';
            const response = await axios.patch( `${ API_URL }/playlists/${ playlist.id }`, {
                title: newTitle
            });
    
            if ( response.status === 200 ) {
                dispatch( fetchPlaylist( playlist.id ) );
                setIsEditing( false ); // Ferme la popup
            }
        } catch ( error ) {
            console.error( "Erreur lors de la mise à jour du titre de la playlist", error );
        }
    };    

  return (
    loading ? <PageLoader />
    :
    <div className='mb-16' >
        { !isEditing ?
            <div>
                <div className='flex justify-between m-4' >
                    <Link to='/playlist' >
                        <RiArrowLeftSFill
                            size={ 30 }
                            className='text-white bg-secondary-pink rounded-lg  h-10 w-10 cursor-pointer'
                        />
                    </Link>
                    <div className='flex flex-col justify-center items-center mx-4' >
                        <img
                            src={ imgPlaylist }
                            alt="image song"
                            className='rounded-lg mb-2 sm:h-52 sm:w-52'
                        />
                        <p className='font-bold flex justify-center items-center' >
                            { playlist.title }
                            <FaPen
                                className='ml-2 bg-secondary-orange h-4 w-4 text-white rounded-sm p-1 cursor-pointer'
                                onClick={ () => {
                                    setNewTitle( playlist.title );
                                    setIsEditing( true );
                                }}
                            />
                        </p>
                    </div>
                    <div className='flex flex-col justify-start' >
                        <FaRegTrashAlt
                            size={ 30 }
                            className='bg-primary h-10 w-10 text-white rounded-lg p-2 cursor-pointer'
                            onClick={ handleDeletePlaylist }
                        />
                    </div>
                </div>
                <SongDropdown
                    isVisible={ isVisible }
                    toggleDropdown={ () => setIsVisible( !isVisible ) }
                    songs={ availableSongs }
                    addSongToPlaylist={ handleAddSong }
                    playlistSongIds={ playlist?.songs?.map( song => song[ '@id' ] ) || [] }
                />
                { songs && songs.map( ( song, index ) => (
                    <SongCard
                        key={ index }
                        song={ song }
                        sentToParent={ handleDeleteSong }
                    />
                ))}
            </div>
        :
            <div className="m-4">
                <div className='flex flex-col items-center justify-center w-full h-full' >
                    <div className='flex w-full justify-between' >
                        <div className='flex'>
                            <div
                                className='flex justify-start items-center'
                                onClick={ () => {
                                        setIsEditing( false );
                                        setNewTitle( playlist.title );
                                    }
                                }
                            >
                                <RiArrowLeftSFill
                                    size={30}
                                    className='text-white bg-secondary-pink rounded-lg h-10 w-10 cursor-pointer'
                                />
                            </div>
                            <div className='flex justify-center items-center font-bold'>
                                <h2 className='ml-10 text-2xl text-primary pr-10' >
                                    Modification du titre de la playlist
                                </h2>
                            </div>
                        </div>
                        <div className='flex text-white justify-center items-center' >
                            <button
                                onClick={ handleEditTitle }
                                className='w-full bg-primary font-bold p-2 rounded-lg transition mr-4 '
                            >
                                Done
                            </button>
                        </div>
                    </div>
                
                    <div className='flex flex-col items-center rounded-lg w-full h-full mb-16' >
                        <div className='flex mt-16'>
                            <CustomInput
                                state={ newTitle }
                                label={ 'Titre' }
                                type={ 'text' }
                                callable={ ( e ) => setNewTitle( e.target.value ) }
                            />
                        </div>
                    </div>
                </div>
            </div>      
        }
    </div>
  )
}

export default PlaylistDetail