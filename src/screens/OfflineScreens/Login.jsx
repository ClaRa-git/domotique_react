import React, { useEffect, useState } from 'react'
import ProfileCard from '../../components/Card/ProfileCard';
import PopupAccount from '../../components/Popup/PopupAccount';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers } from '../../store/user/userSlice';
import selectUserData from '../../store/user/userSelector';
import PageLoader from '../../components/Loader/PageLoader';
import { API_ROOT } from '../../constants/apiConstant';

// Page de connexion
const Login = () => {

	// Définition des states
	const [ isVisible, setIsVisible ] = useState( false );

	// Définition du state pour l'utilisateur
	const [ user, setUser ] = useState( null );

	// Récupération de la fonction dispatch
	const dispatch = useDispatch();

	// Récupération de tous les utilisateurs
	useEffect( () => {
		dispatch( fetchAllUsers() );
	}, [ dispatch ] )

	// Récupération de tous les utilisateurs et du loading
	const { allUsers, loading } = useSelector( selectUserData );

	// Fonction pour gérer le clic sur un utilisateur
	const handleClick = ( user ) => {
		setIsVisible( true );
		setUser( user );
	}

	// Récupération de l'image du logo
	const imgLogo = `${API_ROOT}/images/logo_name.png`;

	return (
		loading ? <PageLoader />
		:
		<div className='flex flex-col h-screen items-center justify-center px-6 py-10 bg-primary' >
			<div>
				<img
					src={ imgLogo }
					alt="logo"
					className='mx-auto mb-8 mt-4'
				/>
			</div>
			<h1 className='text-white text-5xl text-center font-bold' >
				Connectez-vous !
			</h1>
			<div className='flex flex-wrap justify-center'>
				{ allUsers && allUsers.map( ( user, index ) => (
				<div
					key={ index }
					onClick={ () => handleClick( user ) }
					className='m-4 cursor-pointer border-2 border-white rounded-2xl'
				>
					<ProfileCard data={ user } />
				</div>
				))}
			</div>
			{ isVisible &&
				<PopupAccount
					data={ user }
					callable={ () => setIsVisible( false ) }
				/>
			}
		</div>
	)
}

export default Login