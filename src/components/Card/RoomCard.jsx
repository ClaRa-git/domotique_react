import React from 'react'
import { API_ROOT } from '../../constants/apiConstant';
import { Link } from 'react-router-dom';

// Créé un composant RoomCard qui affiche les infos d'une chambre
const RoomCard = ( { room } ) => {

	// Récupère le chemin de l'image de la chambre
	const imgPath = room?.imagePath;

	// Crée l'url complète de l'image
	const imgRoom = `${ API_ROOT }/images/rooms/${ imgPath }`;

	return (
		<Link to={ `/room/${ room.id }` } >
			<div className='flex flex-row justify-between m-4' >
				<div className='flex flex-col justify-center items-center' >
					<img
						src={ imgRoom }
						alt={ `Room ${ room.label }` }
						className='w-48 h-48 rounded-lg mb-2'
					/>
					<p className='font-bold'>
						{ room.label }
					</p>
				</div>
			</div>
		</Link>
	)
}

export default RoomCard