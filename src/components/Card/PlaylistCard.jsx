import React from 'react'
import { API_ROOT } from '../../constants/apiConstant';
import { Link } from 'react-router-dom';

// Créé un composant PlaylistCard qui affiche les infos d'une playlist
const PlaylistCard = ( { playlist } ) => {

	// Récupère le chemin de l'image de la playlist ou une image par défaut
	const imgPath = playlist?.songs?.length > 0
	? playlist?.songs[ 0 ]?.imagePath
	: 'song.jpg';

	// Construit l'URL de l'image de la playlist
	const imgPlaylist = `${ API_ROOT }/upload/images/songs/${ imgPath }`;

	return (
		<Link to={ `/playlist/${ playlist.id }` } >
			<div className='flex flex-row justify-between m-4' >
				<div className='flex flex-col justify-center items-center' >
					<img
						src={ imgPlaylist }
						alt={ `Playlist ${ playlist.title }` }
						className='w-48 h-48 rounded-lg mb-2' />
					<p className='font-bold' >
						{ playlist.title }
					</p>
				</div>
			</div>
		</Link>
	)
}

export default PlaylistCard