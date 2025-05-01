import React, { useState } from 'react';
import { Box, Slider, Stack } from '@mui/material';

/// Composant SliderInterface
const SliderInterface = ( { label = "Valeur", valeur = "", mini = 0, maxi = 255, pas = 1, unite = "", onChange } ) => {

    // Valeur par défaut du slider
    const [ value, setValue ] = useState( Number ( valeur ) );

    // Fonction pour gérer le changement de valeur du slider
    const handleChange = ( e ) => {
        const newValue = Number( e.target.value );
        setValue( newValue );
        if ( onChange ) onChange( newValue );
    };

    return (
        <div className='flex w-full justify-center items-center' >
            <div className='w-8 text-center mr-4' >
                { mini }
            </div>
            <Box sx={ { width: 500 } } >
                <Stack
                    spacing={ 2 }
                    direction="row"
                    sx={{ alignItems: 'center' }}
                >
                    <Slider
                        aria-label={ label }
                        min={ mini }
                        max={ maxi }
                        step={ pas }
                        unit={ unite }
                        value={ value }
                        onChange={ handleChange }
                        valueLabelDisplay="auto"
                    />
                </Stack>
            </Box>
            <div className='w-8 text-center ml-4' >
                { maxi }
            </div>
        </div>
    );
};

export default SliderInterface;
