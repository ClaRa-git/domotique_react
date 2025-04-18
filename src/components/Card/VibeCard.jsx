import React from 'react'
import { API_ROOT } from '../../constants/apiConstant';

// Créé un composant VibeCard qui affiche les infos d'une vibe
const VibeCard = ( { vibe}  ) => {

	// Récupère le chemin de l'image de la vibe ou une image par défaut
	const imgPath = vibe?.icon?.imagePath;

	// Construit l'URL de l'image de la vibe
	const imgIcon = `${ API_ROOT }/images/icons/${ imgPath }`;

	return (   
		<div className='flex flex-row justify-between m-4' >
			<div className='flex flex-col justify-center items-center' >
				<div className='flex justify-center w-24 h-20 bg-offwhite rounded-t-full rounded-b-xl shadow-md mx-auto' >
					<img
						src={ imgIcon }
						alt={ `Icon ${ vibe.icon }` }
						className='w-16 h-16 mb-2 mt-4'
					/>
				</div>
				<div className='flex justify-center w-24 h-10 bg-offwhite rounded-b-3xl shadow-md mx-auto' >
					<p className='font-bold mt-2' >
						{ vibe.label }
					</p>
				</div>            
			</div>
		</div>
	)
}

export default VibeCard