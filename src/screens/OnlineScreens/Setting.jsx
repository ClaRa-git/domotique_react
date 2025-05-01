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

    const [ updatedSettings, setUpdatedSettings ] = useState({});

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

    // Fonction pour enregistrer les paramètres
    const handleSettingChange = (label, newValue) => {
        setUpdatedSettings(prev => ({
            ...prev,
            [label]: newValue
        }));
    };

    return ( isLoading && loadingDevice && loadingVibe ? <PageLoader />
        :
        <div className='flex flex-col items-center justify-start w-full h-full p-4' >
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
                        onClick={ () => console.log( "mise à jour des réglages" ) }
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
                                    { !(setting.value === "true" || setting.value === "false") &&
                                        <p className='text-lg text-primary mt-4 w-20 text-right' >
                                            {updatedSettings[setting.label] ?? setting.value}
                                        </p>
                                    }
                                    { setting.unit &&
                                        <p className='text-lg text-primary mt-4 ml-2' >
                                            {setting.unit}
                                        </p>
                                    }
                                </div>
                                <SelectInterface
                                    interfaceFeature={ setting }
                                    onChange={ ( newValue ) => handleSettingChange( setting.label, newValue ) }
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