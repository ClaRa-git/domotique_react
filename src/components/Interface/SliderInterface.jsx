import React, { useState } from 'react';
import CustomInput from '../Ui/CustomInput';

const SliderInterface = ({ label = "Valeur", min = 0, max = 100, step = 1, unit = "", onChange }) => {

    const [value, setValue] = useState(min);

    const handleChange = (e) => {
        const newValue = Number(e.target.value);
        setValue(newValue);
        if (onChange) onChange(newValue);
    };

    return (
        <div className="flex items-center">            
            <CustomInput
                state={ value }
                label={ label }
                type={ 'range' }
                callable={ ( e ) => setValue( e.target.value ) }
            />
            <div className='flex ml-2 mt-2 justify-center font-bold'>                
                <div className='w-8 text-center'>{value}</div>
                <div className='w-5 ml-1'>{unit}</div>
            </div>
        </div>
    );
};

export default SliderInterface;
