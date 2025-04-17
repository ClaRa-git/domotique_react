import React from 'react'

// Créé une carte pour afficher l'humeur de l'utilisateur
const MoodCard = ( { moral } ) => {
	
	return (
		<div>
			<div className='flex flex-col items-center text-white justify-center h-full'>
				<p className='text-center text-xl font-bold'>
					{ moral }
				</p>
			</div>
		</div>
	)
}

export default MoodCard