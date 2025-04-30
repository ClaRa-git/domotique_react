import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom'
import selectVibeData from '../../store/vibe/vibeSelector';
import { fetchPlanningsForVibe, fetchSettingsForVibe, fetchVibeDetail } from '../../store/vibe/vibeSlice';
import PageLoader from '../../components/Loader/PageLoader';
import VibeCard from '../../components/Card/VibeCard';
import { RiArrowLeftSFill } from 'react-icons/ri';
import { fetchAllRooms } from '../../store/room/roomSlice';
import selectRoomData from '../../store/room/roomSelector';
import DeviceListVibe from '../../components/Ui/DeviceListVibe';
import { FaPen, FaRegTrashAlt } from 'react-icons/fa';
import axios from 'axios';
import { API_URL } from '../../constants/apiConstant';
import PopupEditVibe from '../../components/Popup/PopupEditVibe';

// Page de détails d'une ambiance
const VibeDetail = () => {

	// Récupération de l'ID de l'ambiance depuis l'URL
	const params = useParams();
	const { id } = params;

	// States
	const [ showDevices, setShowDevices ] = useState( true );
	const [ isVisible, setIsVisible ] = useState( false );

	// Récupération de dispatch et navigate
	const dispatch = useDispatch();
	const navigate = useNavigate();

	// Récupération des détails de l'ambiance
	useEffect( () => {
		dispatch( fetchVibeDetail( id ) );
	}, [ dispatch, id ] );	
	
	const { loadingVibe, vibeDetail } = useSelector( selectVibeData );

	useEffect(() => {
	  dispatch( fetchSettingsForVibe( id ) );
	}, [ dispatch, id ] );

	const { settingsForVibe } = useSelector( selectVibeData );
	
	console.log( 'settingsForVibe', settingsForVibe );

	// Récupération des pièces
	useEffect(() => {
	  dispatch(fetchAllRooms());
	}, [dispatch]);
	
	const { loadingRoom, allRooms } = useSelector( selectRoomData );

	useEffect(() => {
	  dispatch( fetchPlanningsForVibe( id ) );
	}, [ dispatch, id ] );

	const { planningsForVibe } = useSelector( selectVibeData );

	console.log( 'vibeDetail', vibeDetail );
	console.log( 'settingsForVibe', settingsForVibe );
	console.log( 'planningsForVibe', planningsForVibe );

	const handleDeleteVibe = async ( id ) => {
		const confirm = window.confirm( 'Voulez-vous vraiment supprimer cette vibe ?' );
        if ( !confirm ) return;

		const paramConfirm = window.confirm('Attention, la suppression de l\'ambiance supprimera tous les réglages liés à cette ambiance. Voulez-vous continuer ?');
		if ( !paramConfirm ) return;

		const planningConfirm = window.confirm('Attention, la suppression de l\'ambiance supprimera tous les plannings liés à cette ambiance. Voulez-vous continuer ?');
		if ( !planningConfirm ) return;

		try {
			// Récupération de l'id du critère
		const criteriaId = vibeDetail.criteria.id;

		// Suppression des plannings liés à l'ambiance
		for ( let i = 0; i < planningsForVibe.length; i++ ) {
			const planning = planningsForVibe[ i ];
			const planningResponse = await axios.delete( `${ API_URL }/plannings/${ planning.id }` );

			if ( planningResponse.status !== 200 ) {
				console.error( 'Erreur lors de la suppression des plannings de l\'ambiance' );
				return;
			}
		}

			// Suppression de l'ambiance
			const response = await axios.delete( `${ API_URL }/vibes/${ id }` );

			if ( response.status === 204 ) {
				console.log( 'Ambiance supprimée avec succès' );
				navigate( '/vibe' );
			} else {
				console.error( 'Erreur lors de la suppression de l\'ambiance' );
			}
		} catch (error) {
			console.error( 'Erreur lors de la suppression de l\'ambiance :', error );
		}
	}

	// Fonction pour gérer le clic sur le bouton "Modifier l'ambiance"
	const handleEditVibe = () => {
		setIsVisible( true );
	}

  return (
	loadingVibe && loadingRoom ? <PageLoader />
	:
	<div className='flex flex-col items-center justify-center mb-4' >        
		<div className='flex w-full justify-between m-10' >
					<Link to='/vibe' >
						<RiArrowLeftSFill
							size={ 30 }
							className='text-white bg-secondary-pink rounded-lg h-10 w-10 ml-4 cursor-pointer'
						/>
					</Link>
					<div className='flex flex-col items-center justify-center' >
						<div className='flex flex-col items-center mb-4 w-full' >
							<VibeCard vibe={ vibeDetail } />
						</div>
						<div className='flex flex-col justify-center items-center' >
							<div>Humeur : {vibeDetail?.criteria?.mood}</div>
							<div>Stress : {vibeDetail?.criteria?.stress}</div>
							<div>Tonus : {vibeDetail?.criteria?.tone}</div>
						</div>
					</div>
					<div className='flex flex-col justify-start mr-4' >
						<FaRegTrashAlt
							size={ 30 }
							className='bg-secondary-orange h-10 w-10 text-white rounded-lg p-2 cursor-pointer'
							onClick={ () => handleDeleteVibe( id ) }
						/>
						<FaPen
							size={ 30 }
							className='bg-secondary-orange h-10 w-10 text-white rounded-lg p-2 cursor-pointer mt-4'
							onClick={ () => handleEditVibe( id ) }
						/>
					</div>
				</div>
		 <div className='flex flex-col p-4 w-full' >
			{
				allRooms.length > 0 ?
				(
					allRooms.map(( room, index ) => (
						<div
							className='flex flex-col items-center'
							key={ index }
						>
							<div className='flex flex-col w-full justify-center items-center font-bold bg-primary text-xl text-white text-center p-2 rounded-lg mb-4' >
								<div className='flex justify-center items-center' >
									<p className='text-xl'>
										{ room.label }
									</p>
								</div>				
							</div>
								<div className='flex flex-col items-center w-full' >
									<DeviceListVibe room={ room } />
								</div>
						</div>
					))
				) : (
					<p className='text-sm' >
						Aucune pièce disponible
					</p>
				)
			}
		 </div>
		 { isVisible &&
		 	<PopupEditVibe
				callable={ () => setIsVisible( false ) }
				vibeDetail={ vibeDetail }
			/>
		 }
	</div>
  )
}

export default VibeDetail