import React from 'react'

// Créer un composant d'input personnalisé
const CustomInput = ( { state, label, type, callable, textColor = 'text-primary' } ) => {
	
	return (
		<div className='mb-4'>
			<label 
				htmlFor={ state }
				className={`block font-bold mb-2 ${ textColor }`}
				>
				{ label }
			</label>
			<input 
				type={ type }
				className='bg-white shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline'
				value={ state }
				onChange={ callable }
			/>
		</div>
	)
}

export default CustomInput