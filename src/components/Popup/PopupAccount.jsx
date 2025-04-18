import React, { useState } from 'react'
import { API_ROOT, IMAGE_URL } from '../../constants/apiConstant'
import { useAuthContext } from '../../contexts/AuthContext';
import CustomInput from '../Ui/CustomInput';
import axios from 'axios';
import ButtonLoader from '../Loader/ButtonLoader';

// Afficher le popup de connexion
const PopupAccount = ( { data, callable } ) => {

	// Récupérartion de l'avatar
	const imgAvatar = `${ IMAGE_URL }/avatars/${ data.avatar.imagePath }`;

	// States
	const [ user, setUser ] = useState( null );
	const [ username, setUsername ] = useState( data.username );
	const [ password, setPassword ] = useState( '' );

	// State pour le loader du bouton
	const [ isLoading, setIsLoading ] = useState( false );

	// State pour le message d'erreur
	const [ error, setError ] = useState( null );

	// Récupération de la fonction signIn du contexte
	const { signIn } = useAuthContext();

	// Gérer la soumission du formulaire pour la connexion
	const handleSubmit = async ( e ) => {
		// On empêche le comportement par défaut du formulaire
		e.preventDefault();
		// On met le state isLoading à true pour afficher le loader du bouton
		setIsLoading( true );
		// Mise à null du messgae d'erreur
		setError( null );

		try {
		// On envoie une requête POST à l'API pour se connecter
		const response = await axios.post( `${API_ROOT}/login-react`, { username, password } );

		// On vérifie si la réponse est un succès ou non
		if ( response.data.success === false ) {
			// Si la réponse est un échec, on met à jour le state error avec le message d'erreur
			setError( response.data.message );
		} else {
			// Si la réponse est un succès, on met à jour le state user avec les données de l'utilisateur
			const loggingUser = {
			userId: response.data.user.id,
			username: response.data.user.username
			};

			// En cas de succès, on connnecte l'utilisateur
			// On met à jour le state user avec les données de l'utilisateur
			signIn( loggingUser );
			setUser( loggingUser );
			// On renvoit le state callable pour fermer le popup
			callable();
			// On réactualise la page
			window.location.reload();
		}
		} catch ( error ) {
			// En cas d'erreur, on affiche un message d'erreur
		console.log( `Erreur lors de la connexion : ${ error }` );
		setError( 'Erreur lors de la connexion' );
		} finally {
			// On met le state isLoading à false pour masquer le loader du bouton
			setIsLoading( false );
		}
	}

	return (
		<div className='z-30 absolute top-0 right-0 bottom-0 left-0 backdrop-blur flex items-center justify-center' >
			<div className='flex relative w-full sm:w-2/3 lg:w-1/2 h-1/2 rounded-2xl justify-center items-center bg-gray-800 border-2 border-white' >
				<div className='flex flex-col w-1/3 m-6 justify-center items-center' >
					<img
						src={ imgAvatar }
						alt="avatar"
						className='w-full h-full object-cover rounded-full border-2 border-white'
						/>
					<h1 className='text-2xl font-bold text-white' >
						{ data.username }
					</h1>
				</div>
				<div className='flex flex-col items-center justify-center w-2/3 h-full' >
					<form onSubmit={ handleSubmit } >
						<CustomInput
							state={ password }
							label={ 'Mot de passe' }
							type={ 'password' }
							callable={ ( e ) => setPassword( e.target.value ) }
						/>
						{ error &&
							<p className='text-red-500 text-center text-sm m-4' >
								{ error }
							</p>
						}
						<div className='flex justify-center' >
							{isLoading ?
							(
								<ButtonLoader />
							)
							:
							(
								<div>
									<button
										type='submit'
										className='w-full bg-secondary-orange font-bold py-3 rounded-lg transition'
									>
										Se connecter
									</button>
									<button
										type='button'
										onClick={ callable }
										className='w-full bg-secondary-pink font-bold py-3 mt-2 rounded-lg transition'
									>
										Annuler
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

export default PopupAccount