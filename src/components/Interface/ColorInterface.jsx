import React, { useState } from 'react'
import { CirclePicker } from 'react-color'

const ColorInterface = ( { valeur = "#aaaaaa", onChange } ) => {
  
    // Valeur par défaut de la couleur
    const [ color, setColor ] = useState( valeur );

    // Fonction pour gérer le changement de couleur
    const handleChange = ( color ) => {
        setColor( color.hex );
        if ( onChange ) onChange( color.hex );
    };

    return (
    <div className='flex w-full justify-center items-center mt-4' >
        <CirclePicker 
            color={ color }
            onChangeComplete={ handleChange }
            width={ 200 }
            circleSize={ 30 }
            circleSpacing={ 10 }
        />
    </div>
  )
}

export default ColorInterface