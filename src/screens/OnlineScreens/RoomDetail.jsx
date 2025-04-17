import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import selectRoomData from '../../store/room/roomSelector';
import { API_ROOT } from '../../constants/apiConstant';
import { fetchRoomDetail as fetchRoom } from '../../store/room/roomSlice';
import { RiArrowLeftSFill, RiArrowRightSFill } from 'react-icons/ri';
import { fetchAllVibesForUser } from '../../store/vibe/vibeSlice';
import { useAuthContext } from '../../contexts/AuthContext';
import selectVibeData from '../../store/vibe/vibeSelector';
import DeviceList from '../../components/Ui/DeviceList';
import VibeList from '../../components/Ui/VibeList';
import PageLoader from '../../components/Loader/PageLoader';
import { FaPlus } from 'react-icons/fa6';

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
    const [isVisible, setIsVisible] = useState(false);

    const { loadingRoom, roomDetail } = useSelector(selectRoomData);
    const { loadingVibe, allVibesForUser } = useSelector(selectVibeData);

    useEffect(() => {
        dispatch(fetchRoom(id));
    }, [dispatch, id]);

    useEffect(() => {
        dispatch(fetchAllVibesForUser(userId));
    }, [dispatch, userId]);

    useEffect(() => {
        if (roomDetail?.devices) {
            const grouped = roomDetail.devices.reduce((acc, device) => {
                const typeLabel = device.deviceType.label;
                if (!acc[typeLabel]) {
                    acc[typeLabel] = [];
                }
                acc[typeLabel].push(device);
                return acc;
            }, {});
            setGroupedDevices(grouped);
        }
    }, [roomDetail]);    

    const imgPath = roomDetail?.imagePath;
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

    const handleClick = () => {
        setIsVisible(true);
    }    

    return (
        loadingRoom ? <PageLoader /> :
        <div className='flex flex-col items-center justify-center mb-4'>
            <div className='flex w-full p-4 mb-4'>
                <Link to='/room'>
                    <RiArrowLeftSFill
                        size={30}
                        className='text-white bg-secondary-pink rounded-lg  h-10 w-10 cursor-pointer'
                    />
                </Link>                
                <div className='flex flex-col items-center mb-4 mr-10 w-full'>
                    <img src={imgRoom} alt={`Pièce ${roomDetail?.label}`} className='w-48 h-48 rounded-lg mb-2'/>
                    <h1 className='text-2xl font-bold'>{roomDetail?.label}</h1>
                </div>
            </div>

            <div className='flex flex-col p-4 w-full'>
                <button 
                    className='flex justify-between items-center font-bold bg-primary text-xl text-white text-center p-2 rounded-lg mb-4' 
                    onClick={toggleView}
                >
                    {showDevices ? 'Appareils' : 'Ambiances'}
                    <div className='flex items-center'>
                        <p className='text-sm'>{showDevices ? 'Ambiances' : 'Appareils'}</p>
                        <RiArrowRightSFill size={20} className='text-white' />
                    </div>
                </button>

                { showDevices &&
                    <div onClick={handleClick} className='flex flex-row justify-between bg-primary text-white mb-4 px-4 py-1 rounded-lg'>
                        <p>Ajouter un appareil à la pièce</p>
                        <FaPlus className='mt-1'/>
                    </div>
                }

                {isVisible && 
                    <div>

                    </div>
                }

                {showDevices ? (
                    <DeviceList
                        groupedDevices={groupedDevices}
                        setGroupedDevices={setGroupedDevices}
                        openMenuId={openMenuId}
                        toggleMenu={toggleMenu}
                        allVibesForUser={allVibesForUser}
                    />
                ) : ( loadingVibe ? <PageLoader /> :
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
