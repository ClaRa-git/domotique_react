import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import selectRoomData from '../../store/room/roomSelector';
import { API_ROOT } from '../../constants/apiConstant';
import { fetchRoomDetail as fetchRoom } from '../../store/room/roomSlice';
import { RiArrowDownSFill, RiArrowRightSFill } from 'react-icons/ri';
import { fetchAllVibesForUser } from '../../store/vibe/vibeSlice';
import { useAuthContext } from '../../contexts/AuthContext';
import selectVibeData from '../../store/vibe/vibeSelector';
import axios from 'axios';
import { FaGear } from 'react-icons/fa6';

const RoomDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { userId } = useAuthContext();
    const navigate = useNavigate();
    const location = useLocation();

    const [groupedDevices, setGroupedDevices] = useState({});
    const [openMenuId, setOpenMenuId] = useState(null);
    const [showDevices, setShowDevices] = useState(true);
    const [données, setDonnées] = useState(null);

    const { loadingRoom, roomDetail: room } = useSelector(selectRoomData);
    const { loadingVibe, allVibesForUser } = useSelector(selectVibeData);

    useEffect(() => {
        dispatch(fetchRoom(id));
    }, [dispatch, id]);

    useEffect(() => {
        dispatch(fetchAllVibesForUser(userId));
    }, [dispatch, userId]);

    useEffect(() => {
        if (room?.devices) {
            const grouped = room.devices.reduce((acc, device) => {
                const typeLabel = device.deviceType.label;
                if (!acc[typeLabel]) {
                    acc[typeLabel] = [];
                }
                acc[typeLabel].push(device);
                return acc;
            }, {});
            setGroupedDevices(grouped);
        }
    }, [room]);    

    const imgPath = room?.imagePath;
    const imgRoom = `${API_ROOT}/images/rooms/${imgPath}`;

    const toggleMenu = (id) => {
        setOpenMenuId((prevId) => (prevId === id ? null : id));
    };

    const toggleView = () => {
        setShowDevices(!showDevices);
        setOpenMenuId(null); // Ferme tout en changeant de vue
    };

    const goToVibe = () => {
        navigate(`/vibe`, {
            state: {
                from: location,
                deviceId: null,
            },
        });
    };

    const handleData = async (roomId, vibeId) => {
        const logdata = {
            roomId: roomId,
            vibeId: vibeId
        };
    
        try {
            const response = await axios.post(`${API_ROOT}/service-device`, logdata, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            setDonnées(response.data);
            console.log('données', response.data);
        } catch (error) {
            console.error('Erreur lors de l’envoi des données :', error);
        }
    };
    

    return (
        <div className='flex flex-col items-center justify-center mb-4'>
            <div className='flex flex-col items-center mb-4'>
                <img src={imgRoom} alt={`Pièce ${room?.label}`} className='w-48 h-48 rounded-lg mb-2'/>
                <h1 className='text-2xl font-bold'>{room?.label}</h1>
            </div>

            <div className='flex flex-col p-4 w-full'>
                <button 
                    className='flex justify-between items-center font-bold bg-primary text-xl text-white text-center p-2 rounded-lg mb-4' 
                    onClick={toggleView}
                >
                    {showDevices ? 'Appareils' : 'Ambiances'}
                    <RiArrowRightSFill size={20} className='text-white ml-2' />
                </button>

                {showDevices ? (
                    Object.entries(groupedDevices).map(([type, devices]) => (
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
                                                <RiArrowDownSFill size={24} className='text-secondary-pink' />
                                            </div>

                                            {openMenuId === device.id && (
                                                <ul className='bg-gray-50 p-4 rounded-lg mb-2 ml-4'>
                                                    <p className='text-sm font-semibold mb-2'>Vibes :</p>
                                                    {allVibesForUser && allVibesForUser.map((vibe, index) => (
                                                        allVibesForUser.length > 0
                                                        ?
                                                            <li key={index} className='text-sm hover:underline'>
                                                                <Link to={`/`}>{vibe.label}</Link>
                                                            </li>
                                                        :
                                                            <li key={index} className='text-sm text-gray-500'>Aucune vibe</li>
                                                        ))
                                                    }
                                                </ul>
                                            )}
                                        </li>
                                        <hr className='border-t border-gray-300 my-2' />
                                    </div>
                                ))}
                            </ul>
                        </div>
                    ))
                ) : (
                    <div>
                        {allVibesForUser.length === 0 ? (
                            <div>
                                <p className='text-center mb-4'>Vous n'avez pas encore d'ambiance. Créez-en une !</p>
                                <button 
                                    className='font-bold bg-secondary-pink text-white p-2 rounded-lg w-full'
                                    onClick={goToVibe}
                                >
                                    Créer une Vibe
                                </button>
                            </div>
                        ) : (
                            <ul>
                                {allVibesForUser.map((vibe) => (
                                    <div key={vibe.id}>
                                        <li className='relative'>
                                            <div 
                                                className='flex justify-between items-center bg-white p-4 rounded-lg mb-2 cursor-pointer'
                                                onClick={() => toggleMenu(vibe.id)}
                                            >
                                                {vibe.label}
                                                <RiArrowDownSFill size={24} className='text-secondary-pink' onClick={() => handleData(id, vibe.id)} />
                                            </div>

                                            {openMenuId === vibe.id && (
                                                <ul className='bg-gray-50 p-4 rounded-lg mb-2 ml-4'>
                                                    <p className='text-sm font-semibold mb-2'>Réglages :</p>
                                                    {données && données.map((setting, index) => {
                                                        return (
                                                        <li key={index} className='text-sm text-gray-700 mb-2 border-2 rounded-lg p-2'>
                                                            <div className='flex justify-between items-center mb-2 w-full underline'>
                                                                <h3 className='font-bold'>{setting.deviceLabel}</h3>
                                                                <FaGear />
                                                            </div>
                                                            - {setting.label}: {setting.value} {setting.symbol ?? ''}
                                                        </li>)
                                    })}
                                                </ul>
                                            )}
                                        </li>
                                        <hr className='border-t border-gray-300 my-2' />
                                    </div>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RoomDetail;
