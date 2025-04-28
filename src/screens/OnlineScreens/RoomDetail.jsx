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
import { fetchDevicesWithoutRoom } from '../../store/device/deviceSlice';
import selectDeviceData from '../../store/device/deviceSelector';
import DeviceDropdown from '../../components/Ui/DeviceDropdown';
import RoomDetailTopbar from '../../components/Ui/RoomDetailTopbar';

// Affichage des détails d'une pièce
const RoomDetail = () => {

    // Récupération de l'ID de la pièce depuis l'URL
    const params = useParams();
    const { id } = params;

    // Récupération de l'ID de l'utilisateur depuis le contexte d'authentification
    const { userId } = useAuthContext();

    // Récupération du dispatch et de la navigation
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    // État pour gérer les appareils regroupés par type, de la visibilité du menu et de l'affichage des appareils
    const [ groupedDevices, setGroupedDevices ] = useState( {} );
    const [ openMenuId, setOpenMenuId ] = useState( null );
    const [ showDevices, setShowDevices ] = useState( true );

    // État pour gérer la visibilité du dropdown
    const [ isVisible, setIsVisible ] = useState( false );


    // Effet pour récupérer les détails de la pièce
    useEffect( () => {
        dispatch( fetchRoom( id ) );
    }, [ dispatch, id ] );

    const { loadingRoom, roomDetail } = useSelector( selectRoomData );

    // Effet pour récupérer les ambiances de l'utilisateur
    useEffect( () => {
        dispatch(fetchAllVibesForUser( userId ) );
    }, [ dispatch, userId ] );

    const { loadingVibe, allVibesForUser } = useSelector( selectVibeData );

    // Effet pour récupérer les appareils non assignés à une pièce
    useEffect( () => {
        dispatch( fetchDevicesWithoutRoom() );
    }, [ dispatch ] );
    
    const { loadingDevice, devicesWithoutRoom } = useSelector( selectDeviceData );

    // Effet pour regrouper les appareils par type
    useEffect(() => {
        if ( roomDetail?.devices ) {
            const grouped = roomDetail.devices.reduce( ( acc, device ) => {
                const typeLabel = device.deviceType.label;
                if ( !acc[ typeLabel ] ) {
                    acc[ typeLabel ] = [];
                }
                acc[ typeLabel ].push( device );
                return acc;
            }, {});
            setGroupedDevices( grouped );
        }
    }, [roomDetail]);    

    // Fonction pour gérer l'ouverture et la fermeture du menu
    const toggleMenu = ( id ) => {
        setOpenMenuId( ( prevId ) => ( prevId === id ? null : id ) );
    };

    // Fonction pour gérer l'affichage des appareils ou des ambiances
    const toggleView = () => {
        setShowDevices( !showDevices );
        setOpenMenuId( null ); // Ferme tout en changeant de vue
    };

    // Fonction pour naviguer vers la page de création d'ambiance
    const goToVibe = () => {
        navigate( `/vibe`, {
            state: {
                from: location,
                deviceId: null,
            },
        });
    };

    // Fonction pour rafraîchir les données de la pièce
    const refreshRoomData = () => {
        dispatch(fetchRoom(id)); // Re-fetch la room pour avoir les devices à jour
        dispatch(fetchDevicesWithoutRoom()); // Met aussi à jour la liste des devices non assignés
    };

    // Fonction pour rafraîchir les données des ambiances
    const refreshVibesData = () => {
        dispatch(fetchAllVibesForUser(userId));
    };

    return (
        loadingRoom ? <PageLoader />
        :
        <div className='flex flex-col items-center justify-center mb-4' >
            <RoomDetailTopbar roomDetail={roomDetail} />

            <div className='flex flex-col p-4 w-full' >
                <button 
                    className='flex justify-between items-center font-bold bg-primary text-xl text-white text-center p-2 rounded-lg mb-4' 
                    onClick={ toggleView }
                >
                    { showDevices ?
                        'Appareils'
                        :
                        'Ambiances'
                    }
                    <div className='flex items-center' >
                        <p className='text-sm' >
                            { showDevices ?
                                'Ambiances'
                                :
                                'Appareils'
                            }
                        </p>
                        <RiArrowRightSFill
                            size={20}
                            className='text-white'
                        />
                    </div>
                </button>

                { showDevices && 
                    <div>
                        <DeviceDropdown
                            isVisible={isVisible}
                            toggleDropdown={() => setIsVisible(!isVisible)}
                            devices={devicesWithoutRoom}
                            showDevices={showDevices}
                            roomId={id}
                            onDeviceAdded={refreshRoomData}
                        />
                    </div>
                }

                { showDevices ?
                (
                    <DeviceList
                        groupedDevices={ groupedDevices }
                        setGroupedDevices={ setGroupedDevices }
                        openMenuId={ openMenuId }
                        toggleMenu={ toggleMenu }
                        allVibesForUser={ allVibesForUser }
                        onDeviceRemoved={ refreshRoomData }
                        refreshVibes={ refreshRoomData }
                    />
                )
                :
                ( loadingVibe ?
                    <PageLoader />
                    :
                    <div>
                        { allVibesForUser.length === 0 ?
                        (
                            <div>
                                <p className='text-center mb-4' >
                                    Vous n'avez pas encore d'ambiance. Créez-en une !                                
                                </p>
                                <button 
                                    className='font-bold bg-secondary-pink text-white p-2 rounded-lg w-full'
                                    onClick={ goToVibe }
                                >
                                    Créer une Vibe
                                </button>
                            </div>
                        )
                        :
                        (
                            <VibeList
                                vibes={ allVibesForUser }
                                openMenuId={ openMenuId }
                                toggleMenu={ toggleMenu }
                                roomId={ id }
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RoomDetail;
