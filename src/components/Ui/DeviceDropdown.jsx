import React from 'react';
import { RiArrowDownSFill, RiArrowRightSFill } from 'react-icons/ri';
import { FaPlus } from 'react-icons/fa6';
import axios from 'axios';
import { API_URL } from '../../constants/apiConstant';

const DeviceDropdown = ({ isVisible, toggleDropdown, devices, showDevices, roomId, onDeviceAdded }) => {

    const handleAddDevice = async (deviceId) => {
        try {
            axios.defaults.headers.patch['Content-Type'] = 'application/merge-patch+json';
            const response = await axios.patch(`${API_URL}/devices/${deviceId}`, {
                room: `api/rooms/${roomId}`
            });

            if (response.status === 200) {
                console.log("Appareil ajouté à la pièce");
                onDeviceAdded();
            }
        } catch (error) {
            console.error(`Erreur lors de l'ajout de l'appareil ${deviceId}`, error);
        }
    }
    
    return (
        <div className='mb-6'>
            { devices && showDevices &&
                <div onClick={toggleDropdown} className='flex flex-row justify-between bg-primary text-white mb-4 px-4 py-1 rounded-lg cursor-pointer'>
                    <p>Ajouter un appareil à la pièce</p>
                    <FaPlus className='mt-1'/>
                </div>
            }

            {isVisible && (
                <ul className='bg-gray-50 p-4 rounded-lg mb-2 ml-4 shadow-inner'>
                    {devices.length > 0 ? (
                        devices.map((device) => (
                            <div key={device.id}>
                                <li
                                    className='text-sm text-gray-800 mb-2 cursor-pointer flex items-center justify-between'
                                >
                                    {device.label}
                                    <FaPlus 
                                        size={16}
                                        className='text-secondary-pink ml-2'
                                        onClick={() => handleAddDevice(device.id)}
                                    />
                                </li>
                                <hr className='border-t border-gray-300 my-2' />
                            </div>
                        ))
                    ) : (
                        <li className='text-sm text-gray-500'>Aucun appareil disponible</li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default DeviceDropdown;
