import React from 'react'
import { API_ROOT } from '../../constants/apiConstant';

// Créé un composant VibeCard qui affiche les infos d'une vibe
const VibeCard = ( { vibe }  ) => {

	// Récupère le chemin de l'image de la vibe ou une image par défaut
	const imgPath = vibe?.icon?.imagePath;

	// Construit l'URL de l'image de la vibe
	const imgIcon = `${ API_ROOT }/images/icons/${ imgPath }`;

	return (   
		<div className='flex flex-row justify-between m-4' >
			<div className='flex flex-col justify-center items-center' >
				<div className='flex justify-center w-24 h-20 bg-[#E8E0DB] rounded-t-full rounded-b-xl shadow-md mx-auto border-t-1 border-x-1 border-primary' >
					<img
						src={ imgIcon }
						alt={ `Icon ${ vibe?.icon }` }
						className='w-16 h-16 mb-3 mt-3'
					/>
				</div>
				<div className='flex justify-center w-24 h-10 bg-offwhite text-primary rounded-b-3xl shadow-md border-b-1 border-x-1 border-primary mx-auto' >
					<p className='font-bold mt-2' >
						{ vibe?.label }
					</p>
				</div>            
			</div>
		</div>
	)
}

export default VibeCard