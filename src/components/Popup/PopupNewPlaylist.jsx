import React, { useState } from 'react'
import CustomInput from '../Ui/CustomInput';
import axios from 'axios';
import { API_URL } from '../../constants/apiConstant';
import ButtonLoader from '../Loader/ButtonLoader';
import { useDispatch } from 'react-redux';
import { fetchUserPlaylists } from '../../store/user/userSlice';

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

	// Fonction qui gère la soumission du formulaire de création de playlist
    const handleSubmit = async ( e ) => {
		// On empêche le comportement par défaut du formulaire
        e.preventDefault();
        try {
			setError( '' );
			const data = {
				title: playlistName.trim(),
				profile: `/api/profiles/${ userId }`,
				vibes: [],
				songs: []
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

	return (
		<div className='flex items-center justify-center px-4' >
			<div className='flex flex-col relative w-full rounded-b-2xl justify-center items-center bg-primary' >
				<div className='flex flex-col items-center justify-center w-full' >
					<form 
						onSubmit={ handleSubmit } 
						className='flex flex-col items-center justify-center w-full p-4'
					>
						<CustomInput
							state={ playlistName }
							label={ 'Nom' }
							type={ 'text' }
							callable={ ( e ) => setPlaylistName( e.target.value ) }
							textColor='text-white'
						/>
						{ success && 
							<p className='text-green-500 text-center' >
								{ success }
							</p>
						}
						{ error && 
							<p className='text-red-500 text-center' >
								{ error }
							</p>
						}
						<div className='flex justify-center w-full' >
							{ isLoading ?
							(
							<ButtonLoader />
							)
							:
							(
								<div className='flex w-full justify-between text-white'>
									<button
										type='button'
										onClick={ callable }
										className='bg-secondary-orange px-4 py-2 rounded-lg transition'
									>
										Annuler
									</button>
									<button
										type='submit'
										className='bg-secondary-orange px-4 py-2 font-bold rounded-lg transition'
									>
										Ajouter
									</button>
								</div>								
							)}
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}

export default PopupNewPlaylist