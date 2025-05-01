import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import selectDeviceData from '../../store/device/deviceSelector';
import { fetchDeviceDetail } from '../../store/device/deviceSlice';
import axios from 'axios';
import { API_ROOT } from '../../constants/apiConstant';
import PageLoader from '../../components/Loader/PageLoader';

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

    // Effet pour récupérer les détails de l'appareil
    useEffect( () => {
        dispatch(fetchDeviceDetail( deviceId ));
    }, [ dispatch, deviceId ]);

    const { loadingDevice, deviceDetail } = useSelector( selectDeviceData );

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
                    console.log( "Response", settingsResponse );
                    console.log( "Message", messageResponse );
                } catch (error) {
                    console.log( `Erreur lors de la récupération des settings des appareils : ${error}` );
                } finally {
                    setIsLoading( false );
                }
            }
        }

        fetchSettings();

    }, [ deviceId, vibeId, deviceDetail ]);

    console.log( "DeviceDetail", deviceDetail );  

    // Fonction pour retourner à la page précédente
    const goBack = () => {
        navigate(from.pathname);
    }

    return ( isLoading ? <PageLoader />
        :
        <div>Settings</div>
    )
}

export default Setting