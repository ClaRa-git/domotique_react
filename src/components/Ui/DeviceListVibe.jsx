import React, { useState } from 'react'
import { FaGear } from 'react-icons/fa6';

const DeviceListVibe = (room) => {

	const [openMenuId, setOpenMenuId] = useState(null);

    const devices = room?.room.devices || [];

    const groupedDevices = devices.reduce((acc, device) => {
        const typeLabel = device.deviceType.label;
        if (!acc[typeLabel]) {
        acc[typeLabel] = [];
        }
        acc[typeLabel].push(device);
        return acc;
    }, {});

    console.log('devices', devices)
    console.log('groupedDevices', groupedDevices)

  return (
    <div className='flex flex-col items-center justify-center w-full mb-4'>
        {Object.entries(groupedDevices).map(([type, devices]) => (
            <div key={type} className='flex flex-col mb-4 w-full'>
                <h3 className='font-bold bg-secondary-orange text-white text-center p-2 rounded-lg mb-4'>{type}</h3>
                <ul>
                    {devices.map((device) => (
                        <div key={device.id}>
                            <li className='relative'>
                            <div 
                                className='flex justify-between items-center bg-white p-4 rounded-lg mb-2 cursor-pointer'
                                onClick={() => setOpenMenuId(device.id)}
                            >
                                {device.label}
                            </div>
                            {openMenuId === device.id && (
                                <ul className='bg-gray-50 p-4 rounded-lg mb-2 ml-4'>
                                    <p className='text-sm font-semibold mb-2'>Réglages :</p>
                                    {device.settings.map((setting, index) => (
                                        <li key={index} className='text-sm text-gray-700 mb-2 border-2 rounded-lg p-2'>
                                            <div className='flex justify-between items-center mb-2 w-full underline'>
                                                <h3 className='font-bold'>{setting.label}</h3>
                                            </div>
                                            <div className='flex justify-between items-center mb-2'>
                                            - {setting.feature.label} : {setting.value} {setting.feature.unit.symbol ?? ''}
                                            <FaGear />
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            </li>
                            <hr className='border-t border-gray-300 my-2' />
                        </div>
                    ))}
                </ul>
            </div>
        ))}
    </div>
  )
}

export default DeviceListVibe