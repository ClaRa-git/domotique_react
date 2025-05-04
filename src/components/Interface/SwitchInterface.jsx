import React, { useState } from 'react';
import Switch from '@mui/material/Switch';

const SwitchInterface = ({ label = "Switch", valeur = "false", onChange }) => {
    const labelInterface = { inputProps: { 'aria-label': label } };

    // Initialise en fonction de la valeur string
    const [checked, setChecked] = useState(valeur === "true");

    const handleChange = () => {
        const newValue = !checked;
        setChecked(newValue);
        if (onChange) onChange(newValue ? "true" : "false"); // <- renvoie une string
    };

    return (
        <div>
            <Switch
                {...label}
                checked={checked}
                onChange={handleChange}
            />
        </div>
    );
};

export default SwitchInterface;
