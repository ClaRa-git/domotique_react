import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import selectDeviceData from '../../store/device/deviceSelector';
import { fetchDeviceDetail } from '../../store/device/deviceSlice';
import axios from 'axios';
import { API_ROOT } from '../../constants/apiConstant';
import PageLoader from '../../components/Loader/PageLoader';
import { RiArrowLeftSFill } from 'react-icons/ri';
import VibeCard from '../../components/Card/VibeCard';
import { fetchVibeDetail } from '../../store/vibe/vibeSlice';
import selectVibeData from '../../store/vibe/vibeSelector';
import SelectInterface from '../../components/Interface/SelectInterface';

const Setting = ( ) => {

  // Récupération des paramètres de recherche
  const [searchParams] = useSearchParams();

  // Récupération de location
  const location = useLocation();
  const from = location.state?.from;

  // Récupération de dispatch
  const dispatch = useDispatch();

  // Récupération de navigate
  const navigate = useNavigate();

  // Récupération des id
  const vibeId = searchParams.get( 'vibeId' );
  const deviceId = searchParams.get( 'deviceId' );

  // States
    const [ settings, setSettings ] = useState( [] );
    const [ isLoading, setIsLoading ] = useState( true );
    const [ messageResponse, setMessageResponse ] = useState( "" );
    const [ settingsResponse, setSettingsResponse ] = useState( [] );

    const [ updatedSettings, setUpdatedSettings ] = useState( []);

    // Effet pour récupérer les détails de l'appareil
    useEffect( () => {
        dispatch(fetchDeviceDetail( deviceId ) );
    }, [ dispatch, deviceId ] );

    const { loadingDevice, deviceDetail } = useSelector( selectDeviceData );

    // Effet pour récupérer les détails de la vibe
    useEffect( () => {
        dispatch(fetchVibeDetail( vibeId ) );
    }, [ dispatch, vibeId ] );

    const { loadingVibe, vibeDetail } = useSelector( selectVibeData );

    // Effet pour récupérer les paramètres de l'appareil
    useEffect( () => {

        const fetchSettings = async () => {

            const deviceTypeId = deviceDetail?.deviceType?.id;
            if( deviceId && deviceTypeId && vibeId ) {
                try {
                    setIsLoading( true );
                    
                    axios.defaults.headers.post[ 'Content-Type' ] = 'application/ld+json';        
                    const response = await axios.post( `${ API_ROOT }/service-setting`, {
                        deviceId: deviceId,
                        deviceTypeId: deviceTypeId,
                        vibeId: vibeId
                    } );
        
                    setSettingsResponse( response.data.settings );
                    setMessageResponse( response.data.message );
                } catch (error) {
                    console.log( `Erreur lors de la récupération des settings des appareils : ${error}` );
                } finally {
                    setIsLoading( false );
                }
            }
        }

        fetchSettings();

    }, [ deviceId, vibeId, deviceDetail ]);

    // Fonction pour retourner à la page précédente
    const goBack = () => {
        navigate(from.pathname);
    }

    // Fonction pour enregistrer les paramètres dans un tableau
    const handleSettingChange = async (settingObject, newValue) => {

        const updatedSetting = {
            ...settingObject,
            value: String (newValue),
        };
    
        setUpdatedSettings(prev => {
            const exists = prev.find(s =>
                (s.id !== 0 && s.id === settingObject.id) ||
                (s.id === 0 &&
                 s.deviceId === settingObject.deviceId &&
                 s.featureId === settingObject.featureId &&
                 s.vibeId === settingObject.vibeId)
            );
            
            if (exists) {
                return prev.map(s =>
                    (s.id !== 0 && s.id === updatedSetting.id) ||
                    (s.id === 0 &&
                     s.deviceId === updatedSetting.deviceId &&
                     s.featureId === updatedSetting.featureId &&
                     s.vibeId === updatedSetting.vibeId)
                    ? updatedSetting
                    : s
                );
            } else {
                return [...prev, updatedSetting];
            }
        });

        // Envoi immédiat à MQTT via l'API Symfony
        try {
            await axios.post(`${API_ROOT}/test-settings`, {
                settings: [{
                    deviceAddress: updatedSetting.deviceAddress,
                    deviceRef: updatedSetting.deviceRef,
                    deviceLabel: updatedSetting.deviceLabel,
                    featureLabel: updatedSetting.featureLabel,
                    value: updatedSetting.value 
                }],
                vibeId: updatedSetting.vibeId
            });
        } catch (error) {
            console.error("Erreur lors de l'envoi en MQTT :", error);
        }
    };

    // Fonction pour enregistrer les settings
    const sendSettings = async () => {
        try {
            // Filtrer les settings sans id (id === null) non modifiés par l'utilisateur
            const nullSettingsNotModified = settingsResponse
                .filter(s => s.id === 0)  // Seulement ceux avec id = 0
                .filter(s =>
                    !updatedSettings.some(us =>
                        us.featureId === s.featureId &&
                        us.deviceId === s.deviceId &&
                        us.vibeId === s.vibeId
                    )
                )
                .map(s => ({
                    id: null,  // Pas d'id
                    value: String( s.value ),
                    featureId: s.featureId,
                    deviceId: s.deviceId,
                    vibeId: Number(vibeId)  // On ajoute le vibeId récupéré en paramètre
                }));
    
            // Construction du tableau final à envoyer
            const finalPayload = [...updatedSettings, ...nullSettingsNotModified];
    
            // Envoi des réglages à l'API
            const response = await axios.post(`${API_ROOT}/service-settings-update`, finalPayload, {
                headers: {
                    'Content-Type': 'application/ld+json'
                }
            });
    
            if (response.status === 200) {
                console.log("Réglages envoyés avec succès :", response.data);
                goBack();
            } else {
                console.log(`Erreur lors de l'envoi des réglages : ${response.status}`);
            }
    
        } catch (error) {
            console.error("Erreur lors de l'envoi des réglages :", error);
            alert("Une erreur est survenue pendant l'enregistrement.");
        }
    };

    return ( isLoading && loadingDevice && loadingVibe ? <PageLoader />
        :
        <div className='flex flex-col items-center justify-start w-full h-full p-4 mb-16' >
            <div className='flex w-full justify-between' >
                <div className='flex justify-start items-center' >
                    <button
                        onClick={ () => {
                                // On alerte que les modifications ne sont pas enregistrées
                                if ( window.confirm( "Les modifications ne sont pas enregistrées, êtes-vous sûr de vouloir quitter ?" ) ) {
                                    goBack();
                                } else {
                                    // On reste sur la page
                                    return;
                                }
                            }
                        }
                    >
                        <RiArrowLeftSFill
                            size={ 30 }
                            className='text-white bg-secondary-pink rounded-lg h-10 w-10 cursor-pointer'
                        />
                    </button>
                </div>
                <div className='flex justify-center items-center font-bold' >
                    <h2 className='ml-10 text-2xl text-primary pr-10' >
                        Modification des réglages pour :
                    </h2>
                </div>
                <div className='flex text-white justify-center items-center' >
                    <button
                        onClick={ () => sendSettings() }
                        className='w-full bg-primary font-bold p-2 rounded-lg transition mr-4 '
                    >
                        Done
                    </button>
                </div>           
            </div>
            <div className='flex flex-col w-full justify-center items-center' >
                <VibeCard vibe={ vibeDetail } />
                <div className='flex flex-col justify-center items-center' >
                    <div>
                        { deviceDetail?.label }
                    </div>
                    <div>
                        Ref. { deviceDetail?.reference }
                    </div>
                </div>
            </div>
            { settingsResponse?.length > 0 &&
                <div className='flex flex-col justify-center items-center w-full' >
                    <div className='flex w-full justify-center items-center font-bold bg-primary text-xl text-white text-center p-2 rounded-lg my-4'>
                        Réglages
                    </div>
                    <div className='flex flex-col w-full justify-center items-center' >
                        { settingsResponse?.map( ( setting, index ) => (
                            <div key={ index } className='flex flex-col w-full justify-center items-center' >
                                <div className='flex'>
                                    <p className='text-lg text-primary mt-4' >
                                        {setting.label} :
                                    </p>
                                    <p className='text-lg text-primary mt-4 w-20 text-right'>
                                        {
                                            (
                                                updatedSettings.find(s =>
                                                    (s.id !== 0 && s.id === setting.id) ||
                                                    (s.id === 0 &&
                                                    s.deviceId === setting.deviceId &&
                                                    s.featureId === setting.featureId &&
                                                    s.vibeId === setting.vibeId)
                                                )?.value ?? setting.value
                                            )
                                        }
                                    </p>
                                    { setting.unit &&
                                        <p className='text-lg text-primary mt-4 ml-2' >
                                            {setting.unit}
                                        </p>
                                    }
                                </div>
                                <SelectInterface
                                    interfaceFeature={setting}
                                    onChange={(newValue) => handleSettingChange(setting, newValue)}
                                />
                                <hr className='w-full border-t border-gray-500 my-4' />
                            </div> 
                        ) ) }
                    </div>
                </div>
            }
        </div>
    )
}

export default Setting