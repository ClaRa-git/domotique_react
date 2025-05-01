import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import HelloUser from '../../../components/Ui/HelloUser';
import { useDispatch, useSelector } from 'react-redux';
import { useAuthContext } from '../../../contexts/AuthContext';
import { fetchUserDetail } from '../../../store/user/userSlice';
import selectUserData from '../../../store/user/userSelector';
import { FiLogOut } from 'react-icons/fi';
import { FaRegUser } from 'react-icons/fa';
import { LuPlay } from 'react-icons/lu';
import { GoLock } from 'react-icons/go';
import { USER_INFOS } from '../../../constants/appConstant';
import PageLoader from '../../../components/Loader/PageLoader';

// Affiche le component pour déconnexion
const Logout = () => {

	// Récupération de la fonction signOut dans le contexte d'authentification
	const { signOut } = useAuthContext();

	// Récupération de la fonction navigate
	const navigate = useNavigate();

	// On crée la méthode de deconnexion
	const handleLogout = async () => {
		await signOut();

		navigate( '/' );
	}

	return (
		<div className='flex flex-col items-start justify-start' >
			<button
				onClick={ () => {
					const confirmLogout = window.confirm( 'Voulez-vous vraiment vous déconnecter ?' );
					if ( confirmLogout ) handleLogout();
				}}
				className='flex bg-secondary-orange text-white rounded-lg p-2 items-center justify-center'
			>
				<FiLogOut className='w-6 h-6 mr-2' />
				<p>
					Log out
				</p>
			</button>
		</div>
	)
}

// Affiche le component de l'utilisateur connecté
const Account = () => {

	// Récupération de l'utilisateur connecté dans le store
	const params = useParams();
	const { id } = params;

	// Récupération du dispatch
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch( fetchUserDetail( id ) );
	}, [ dispatch, id ] );

	const { loading, userDetail } = useSelector( selectUserData );

	// Récupération de l'utilisateur connecté dans le localStorage
	// const user = JSON.parse( localStorage.getItem( USER_INFOS ) );
	//const [ username ] = useState( user.username );

	return ( loading ? <PageLoader />
		:
		<div>
			<HelloUser username={ userDetail.username} />
			<div className='flex flex-col items-start justify-start w-full mb-4' >
				<Link
					to='/account/informations'
					className='flex w-full justify-between mb-4' 
				>
					<div className='flex'>
						<div className='justify-center items-center p-4' >
							<FaRegUser
								size={ 18 }
								className='text-secondary-pink'
							/>
						</div>
						<div className='flex items-center' >
							Informations utilisateur
						</div>
					</div>
					<div className='flex justify-center items-center p-4' >
						<LuPlay
							size={ 24 }
							className='font-bold'
						/>
					</div>
				</Link>
				<div className='flex w-full px-4' >
					<hr className='w-full border-t border-gray-500' />
				</div>
			</div>
			<div className='flex flex-col items-start justify-start w-full mb-4' >
				<div className='flex w-full justify-between mb-4'>
					<Link
						to='/account/password'
						className='flex w-full mb-4' 
					>
						<div className='justify-center items-center p-4' >
							<GoLock
								size={ 18 }
								className='text-secondary-pink'
							/>
						</div>
						<div className='flex items-center' >
							Mot de passe
						</div>
					</Link>
					<div className='flex justify-center items-center p-4' >
						<LuPlay
							size={ 24 }
							className='font-bold'
						/>
					</div>
				</div>
			</div>
			<div className='m-5' >
				<Logout />
			</div>
		</div>
	)
}

export default Account