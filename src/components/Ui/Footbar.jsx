import React from 'react'
import { BiHomeAlt } from 'react-icons/bi'
import { API_ROOT } from '../../constants/apiConstant'
import { Link } from 'react-router-dom'

// Affiche la barre de navigation en bas de la page
const Footbar = () => {
  
	// On récupère l'icône de l'IA
    const imgIa = `${ API_ROOT }/images/logo_ai.png`

    // On récupère la route du parent
    const currentPath = window.location.pathname

    return (
        <div className={ `h-20 ${
				currentPath === '/' ?
				'bg-offwhite'
				:
				'bg-primary'
				} flex justify-between items-center rounded-t-xl p-4 -mt-8` }
		>
			<Link to="/">
				<div className={ `${
					currentPath === '/' ?
					'bg-secondary-orange'
					:
					'bg-secondary-pink'
					} text-white p-2 rounded-full px-4` }
				>
					<BiHomeAlt size={ 20 } />
				</div>
			</Link>
			<Link to="/ai">
				<div className={ `flex ${
					currentPath === '/' ?
					'bg-secondary-orange'
					:
					'bg-secondary-pink'
					} text-white p-2 rounded-full px-4` }
				>
					<p className='text-xs pr-2' >
						Demander à Noctys ...
					</p>
					<img
						src={ imgIa }
						alt="logo ia"
					/>
				</div>
			</Link>
        </div>
	)
}

export default Footbar