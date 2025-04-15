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
import DeviceList from '../../components/Ui/DeviceList';
import VibeList from '../../components/Ui/VibeList';

const RoomDetail = () => {

    const params = useParams();
    const { id } = params;

    const dispatch = useDispatch();
    const { userId } = useAuthContext();
    const navigate = useNavigate();
    const location = useLocation();

    const [groupedDevices, setGroupedDevices] = useState({});
    const [openMenuId, setOpenMenuId] = useState(null);
    const [showDevices, setShowDevices] = useState(true);
    const [dataDeviceVibe, setDataDeviceVibe] = useState(null);

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
        const data = {
            roomId: roomId,
            vibeId: vibeId
        };
    
        try {
            const response = await axios.post(`${API_ROOT}/service-device`, data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            setDataDeviceVibe(response.data);
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
                    <DeviceList
                        groupedDevices={groupedDevices}
                        openMenuId={openMenuId}
                        toggleMenu={toggleMenu}
                        allVibesForUser={allVibesForUser}
                    />
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
                            <VibeList
                                vibes={allVibesForUser}
                                openMenuId={openMenuId}
                                toggleMenu={toggleMenu}
                                handleData={handleData}
                                dataDeviceVibe={dataDeviceVibe}
                                roomId={id}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RoomDetail;
