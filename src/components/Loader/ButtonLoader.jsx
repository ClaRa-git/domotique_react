import React from 'react'
import { RingLoader } from 'react-spinners'

// Affiche un loader de type RingLoader
// pour indiquer que le bouton est en cours de chargement
const ButtonLoader = () => {

	return (
		<RingLoader 
			size={ 50 }
			color='#f08a4f'
		/>
	)
}

export default ButtonLoader