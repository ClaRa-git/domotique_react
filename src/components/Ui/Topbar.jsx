import React from 'react'
import { FaSearch } from 'react-icons/fa'
import { RiAccountCircleFill } from 'react-icons/ri'
import { Link } from 'react-router-dom'
import { API_ROOT } from '../../constants/apiConstant'
import { useAuthContext } from '../../contexts/AuthContext'

// Le composant Topbar permet d'afficher la barre de navigation en haut de la page
const Topbar = () => {

	// On récupèrele chemin de l'icône de l'application
	const imgIcon = `${ API_ROOT }/images/logo.png`

	// On récupère l'id de l'utilisateur connecté
	const { userId }  = useAuthContext();

	return (
		<div className='h-24 flex items-center m-4'>
			<div className='flex-1 text-white text-lg font-semibold px-4'>
				<div className='flex justify-between w-full items-center text-primary p-2'>
					<Link to='/search'>
						<div className='justify-center items-center p-4'>
							<FaSearch size={ 32 }/>
						</div>
					</Link>
					<Link to='/'>
						<div>
							<img
								src={ imgIcon }
								alt="icone hoomy"
							/>
						</div>
					</Link>
					<Link to={ `/account/${ userId }` }>
						<div className='justify-center items-center p-4'>
							<RiAccountCircleFill size={ 32 }/>
						</div>
					</Link>
				</div>
			</div>
		</div>
	)
}

export default Topbar