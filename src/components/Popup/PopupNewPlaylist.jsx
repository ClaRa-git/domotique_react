import React, { useEffect, useState } from 'react'
import CustomInput from '../Ui/CustomInput';
import axios from 'axios';
import { API_ROOT, API_URL } from '../../constants/apiConstant';
import ButtonLoader from '../Loader/ButtonLoader';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserPlaylists } from '../../store/user/userSlice';
import { RiArrowLeftSFill } from 'react-icons/ri';
import { fetchAllSongs } from '../../store/song/songSlice';
import selectSongData from '../../store/song/songSelector';
import SongDropdown from '../Ui/SongDropdown';
import SongCard from '../Card/SongCard';
import PageLoader from '../Loader/PageLoader';

// Afficher le popup de création d'une nouvelle playlist
const PopupNewPlaylist = ( { callable, userId } ) => {

	// Appel de dispatch
	const dispatch = useDispatch();

	// State pour le nom de la playlist
    const [ playlistName, setPlaylistName ] = useState( '' );

	// State pour le loader du bouton
    const [ isLoading, setIsLoading ] = useState( false );

	// State pour les messages d'erreur et de succès
    const [ error, setError ] = useState( '' );
    const [ success, setSuccess ] = useState( '' );

	const [ isVisible, setIsVisible ] = useState( false );
	const [ selectedSongs, setSelectedSongs ] = useState( [] );

	// Récupération des chansons
	useEffect( () => {
		dispatch( fetchAllSongs() );
	}, [ dispatch ] );

	const { loadingSongs, allSongs } = useSelector( selectSongData );

	let imgPlaylist = "";
	if ( selectedSongs.length > 0 ) {
		// On cherche la chanson qui a le même id que le premier élément de selectedSongs
		const song = allSongs.find( ( song ) => song[ '@id' ] === selectedSongs[ 0 ] );
			imgPlaylist = `${ API_ROOT }/upload/images/songs/${ song.imagePath }`;
	} else {
		imgPlaylist = `${ API_ROOT }/upload/images/songs/song.jpg`;
	}
	

	// Fonction qui gère la soumission du formulaire de création de playlist
    const handleSubmit = async ( ) => {
		
        try {
			setError( '' );
			const data = {
				title: playlistName.trim(),
				profile: `/api/profiles/${ userId }`,
				vibes: [],
				songs: selectedSongs
			}

			setIsLoading( true );

			if ( data.title === '' ) {
				setError( 'Le nom de la playlist ne peut pas être vide' );
				setSuccess( '' );
				resetMessage();
				return;
			}

			axios.defaults.headers.post[ 'Content-Type' ] = 'application/ld+json';
			const response = await axios.post( `${ API_URL }/playlists`, data );

			if ( response.status === 201 ) {
				setSuccess( 'La playlist a bien été créée' );
				setError( '' );
				setPlaylistName( '' );
				resetMessage();
				dispatch( fetchUserPlaylists( userId ) );
				callable();
			}
        } catch ( error ) {
			setError( "Une erreur est survenue lors de l'ajout de la playlist" );
			resetMessage();
			console.log( `Erreur lors de l'ajout de la playlist : ${ error }` );
        } finally {
          	setIsLoading( false );
        }
    }
    
	// Permet d'effacer les messages success et error après 3 secondes
	const resetMessage = () => {
		setTimeout( () => {
			setSuccess( '' );
			setError( '' );
		}, 3000 )
	}

	// Fonction pour ajouter une chanson au tableau des chansons sélectionnées
	const handleAddSong = async ( songsId ) => {
		setSelectedSongs( songsId );
	}

	// Fonction pour supprimer une chanson du tableau des chansons sélectionnées
	const handleDeleteSong = async ( songId ) => {
		const newSelectedSongs = selectedSongs.filter( ( song ) => song !== songId );
		setSelectedSongs( newSelectedSongs );
	}

	return ( loadingSongs ? <PageLoader />
		:
		<div className="m-4 mb-16">
			<div className='flex flex-col items-center justify-center w-full h-full' >
				<div className='flex w-full justify-between' >
					<div className='flex'>
						<div
							className='flex justify-start items-center'
							onClick={ () => {
									// On prévient l'utilisateur que l'on quitte sans sauvegarder
									if ( window.confirm( 'Êtes-vous sûr de vouloir quitter sans sauvegarder ?' ) ) {
										callable();
									}
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
								Création d'une playlist
							</h2>
						</div>
					</div>
					<div className='flex text-white justify-center items-center' >
						<div
							className='w-full bg-primary font-bold p-2 rounded-lg transition mr-4 cursor-pointer'
							onClick={ () => handleSubmit() }
						>
							Done
						</div>
					</div>
				</div>
			
				<div className='flex flex-col items-center rounded-lg w-full h-full mb-16' >
					<div className='flex mt-16'>
						<div className='flex flex-col justify-center items-center' >
							<img
								src={ imgPlaylist }
								alt={ `Image defaut playlist` }
								className='w-48 h-48 rounded-lg mb-2'
							/>
							<CustomInput
								state={ playlistName }
								label={ 'Titre' }
								type={ 'text' }
								callable={ ( e ) => setPlaylistName( e.target.value ) }
							/>
						</div>
					</div>
				</div>
			</div>
			<SongDropdown
				isVisible={ isVisible }
				toggleDropdown={ () => setIsVisible( !isVisible ) }
				addSongsToPlaylist={ handleAddSong }
				playlistSongIds={ [] }
			/>
			{ selectedSongs && selectedSongs.map( ( songId, index ) => {
				// Dans allSongs, on cherche la chanson qui a le même id que songId
				const song = allSongs.find( ( song ) => song[ '@id' ] === songId );
				return (
                    <SongCard
                        key={ index }
                        song={ song}
                        sentToParent={ handleDeleteSong }
                    />
				)
			})}
		</div>  
	)
}

export default PopupNewPlaylist