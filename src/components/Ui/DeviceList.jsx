import React from 'react';
import { RiArrowDownSFill, RiArrowRightSFill } from 'react-icons/ri';
import { Link } from 'react-router-dom';

const DeviceList = ({ groupedDevices, openMenuId, toggleMenu, allVibesForUser }) => {
    return Object.entries(groupedDevices).map(([type, devices]) => (
        <div key={type} className='flex flex-col mb-4 w-full'>
            <h3 className='font-bold bg-secondary-orange text-white text-center p-2 rounded-lg mb-4'>{type}</h3>
            <ul>
                {devices.map((device) => (
                    <div key={device.id}>
                        <li className='relative'>
                            <div 
                                className='flex justify-between items-center bg-white p-4 rounded-lg mb-2 cursor-pointer'
                                onClick={() => toggleMenu(device.id)}
                            >
                                {device.label}
                                {openMenuId === device.id ? <RiArrowDownSFill size={24} className='text-secondary-pink' /> : <RiArrowRightSFill size={24} className='text-secondary-pink' />}
                            </div>

                            {openMenuId === device.id && (
                                <ul className='bg-gray-50 p-4 rounded-lg mb-2 ml-4'>
                                    <p className='text-sm font-semibold mb-2'>Vibes :</p>
                                    {allVibesForUser.length > 0 ? (
                                        allVibesForUser.map((vibe, index) => (
                                            <li key={index} className='text-sm hover:underline'>
                                                <Link to={`/`}>{vibe.label}</Link>
                                            </li>
                                        ))
                                    ) : (
                                        <li className='text-sm text-gray-500'>Aucune vibe</li>
                                    )}
                                </ul>
                            )}
                        </li>
                        <hr className='border-t border-gray-300 my-2' />
                    </div>
                ))}
            </ul>
        </div>
    ));
};

export default DeviceList;
