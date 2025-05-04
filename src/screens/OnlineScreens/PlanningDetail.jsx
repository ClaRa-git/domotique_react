import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom'
import { fetchAllPlanningsForUser, fetchPlanningDetail } from '../../store/planning/planningSlice';
import selectPlanningData from '../../store/planning/planningSelector';
import PageLoader from '../../components/Loader/PageLoader';
import { RiArrowLeftSFill } from 'react-icons/ri';
import { FaChevronDown, FaChevronRight, FaPen, FaRegTrashAlt } from 'react-icons/fa';
import VibeCard from '../../components/Card/VibeCard';
import RoomCard from '../../components/Card/RoomCard';
import SwitchToggle from '../../components/Ui/SwitchToggle';
import { fetchAllVibesForUser } from '../../store/vibe/vibeSlice';
import { fetchAllRooms } from '../../store/room/roomSlice';
import { USER_INFOS } from '../../constants/appConstant';
import selectVibeData from '../../store/vibe/vibeSelector';
import selectRoomData from '../../store/room/roomSelector';
import axios from 'axios';
import { API_URL } from '../../constants/apiConstant';

const PlanningDetail = () => {

	// Récupèration de l'ID du planning dans l'URL
	const param = useParams();
	const { id } = param;

	// Récupération de l'utilisateur connecté dans le localStorage
	const user = JSON.parse( localStorage.getItem( USER_INFOS ) );
	const userId = user.userId;

	// Récupération du dispatch
	const dispatch = useDispatch();

	// Récupération du navigate
	const navigate = useNavigate();

	// State
	const [ isVisible, setIsVisible ] = useState( false );
	const [ isEditing, setIsEditing ] = useState( false );
	const [ isLoading, setIsLoading ] = useState( false );

	// State pour gérer l'affichage des ambiances et des pièces
	const [ linkVibeOpen, setLinkVibeOpen ] = useState( false );
	const [ linkRoomOpen, setLinkRoomOpen ] = useState( false );

	// State pour gérer les ambiances et les pièces sélectionnées
	const [ selectedRooms, setSelectedRooms] = useState( [] );
	const [ selectedVibe, setSelectedVibe] = useState( '' );

	useEffect(() => {
		dispatch(fetchPlanningDetail( id ));
	}, [ dispatch, id ]);

		// Récupération des vibes de l'utilisateur
		useEffect( () => {
		  dispatch( fetchAllVibesForUser( userId ) );
		}, [ dispatch, userId ] );
	
		const { loadingVibe, allVibesForUser } = useSelector( selectVibeData );
	
		// Récupération des pièces
		useEffect( () => {
		  dispatch( fetchAllRooms() );
		}, [ dispatch, userId ] );
	
		const { loadingRoom, allRooms } = useSelector( selectRoomData );
  
	const { loadingPlanning, planningDetail } = useSelector( selectPlanningData );

	// State pour gérer les données de l'évènement
	const [ eventName, setEventName ] = useState( '' );
	const [ dateStart, setDateStart ] = useState( '' );
	const [ dayCreation, setDayCreation ] = useState( '' );
	const [ hourStart, setHourStart ] = useState( '' );
	const [ hourEnd, setHourEnd ] = useState( '' );
	const [ recurrence, setRecurrence ] = useState( '' );
	const [ switchOn, setSwitchOn ] = useState( false );
	const [ allDay, setAllDay ] = useState( false );


	// State pour gérer les messages d'erreur et de succès
	const [ error, setError ] = useState( null );
	const [ success, setSuccess ] = useState( null );

	const handleEditPlanning = ( id ) => {
		setIsVisible( !isVisible );
	}

	// Suppression de l'évènement
	const handleDeletePlanning = async () => {
        const confirm = window.confirm( 'Voulez-vous vraiment supprimer ce planning?' );

        if ( !confirm ) return;

        try {
            const response = await axios.delete( `${ API_URL }/plannings/${ id }` );

            if( response.status === 204 ){
                // On va rediriger vers la page des plannings
                setSuccess( 'Le planning a bien été supprimé' );
                setError( '' );
                resetMessage();
                navigate( '/planning' );
            }
        } catch ( error ) {
            console.log( `Erreur lors de la suppression du planning ${ id }`, error );
            setError( "Une erreur est survenue lors de la suppression du planning" );
            setSuccess( '' );
            resetMessage();
        }
    }

	// Fonction utilitaire : formate une date au format YYYY-MM-DD
    const toLocalDDMMYYYY = (dateInput) => {
        const date = new Date(dateInput); // accepte un Date ou une string
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${day}-${month}-${year}`;
    }; 

	// Fonction utilitaire : donne journalier, hebdomadaire, mensuel
	const getRecurrence = ( recurrence ) => {
		switch ( recurrence ) {
			case 'none':
				return 'Ponctuel';
			case 'daily':
				return 'Journalier';
			case 'weekly':
				return 'Hebdomadaire';
			case 'monthly':
				return 'Mensuel';
			default:
				return '';
		}
	}

	// Gestion de la sélection des rooms
	const toggleRoomSelection = ( room ) => {
		const roomId = room[ '@id' ];
		if ( selectedRooms.includes( roomId ) ) {
			setSelectedRooms( selectedRooms.filter(r => r !== roomId ) );
		} else {
			setSelectedRooms( [ ...selectedRooms, roomId ] );
		}
	};
	console.log("planningDetail", planningDetail);

	// Gestion du formulaire d'ajout d'évènement
	const handleEditEvent = async ( e ) => {
		// Empêche le comportement par défaut du formulaire
		e.preventDefault();

		try {
			// Récupération des données du formulaire
			const data = {
				label: eventName ? eventName : planningDetail.label,
				dateStart: dateStart ? dateStart : planningDetail.dateStart,
				dayCreation: dayCreation ? dayCreation : planningDetail.dayCreation,
				hourStart: !allDay ? (hourStart ? hourStart : planningDetail.hourStart) : '00:00',
				hourEnd: !allDay ? (hourEnd ? hourEnd : planningDetail.hourEnd) : '23:59',
				recurrence: recurrence ? recurrence : planningDetail.recurrence,
				vibe: selectedVibe,
				rooms: selectedRooms,
				profile: `/api/profiles/${ userId }`
			}

			// Loading
			setIsLoading( true );

			// Gestion de champs vides
			if ( !eventName || !dateStart ) {
				console.log( 'Veuillez remplir tous les champs' );
				setError( 'Veuillez remplir tous les champs' );
				setSuccess( null);
				resetMessage();
				return;
			}

			// Envoi de la requête PATCH
            axios.defaults.headers.patch[ 'Content-Type' ] = 'application/merge-patch+json';
			const response = await axios.patch( `${ API_URL }/plannings/${id}`, data );

			if ( response.status === 200 ) {
				console.log( 'L\'évènement a bien été modifié' );
				setEventName( '' );
				setDateStart( new Date() );
				setDayCreation( '' );
				setRecurrence( 'none' );
				setSelectedVibe( '' );
				setSelectedRooms( [] );
				setSwitchOn( false );
				setAllDay( false );

				setIsVisible( false );

				setSuccess( 'L\'évènement a bien été modifié' );
				setError( null );
				resetMessage();

				dispatch( fetchAllPlanningsForUser( userId ) );
			} 

		} catch ( error ) {
			console.log( `Erreur lors de l'ajout de l'évènement : ${error}` );
			setError( "Une erreur est survenue lors de l'ajout de l'évènement" );
			setSuccess( null );
			resetMessage();
		} finally {
			setIsLoading( false );
		}
	}

	// Gestion du click pour la visibilité
	const handleClick = () => {
		if ( !window.confirm( 'Voulez-vous vraiment annuler ?' ) ) {
			return;
		}

		setIsVisible( !isVisible );
		if ( isVisible === false ) {
			setAllDay( false );
			setRecurrence( 'none' );
			setEventName( '' );
			setDateStart( new Date() );
			setDayCreation( '' );
			setHourStart( '' );
			setHourEnd( '' );
			setSelectedVibe( '' );
			setSelectedRooms( [] );
			setSwitchOn( false );
			setLinkVibeOpen( false );
			setLinkRoomOpen( false );
			setError( null );
			setSuccess( null );
		} 
	}

	// Gestion de l'affichage du switch pour le jour entier
	const handleSwitch = ( data ) => {
		setSwitchOn( data );
		if ( data ) {
			setAllDay( true );
		} else {
			setAllDay( false );
		}
	}

	// Fonction pour réinitialiser les messages d'erreur et de succès
	const resetMessage = () => {
		setTimeout( () => {
			setSuccess( null );
			setError( null );
		}, 3000 );
	}

	// Fonction utilitaire : formate une date au format YYYY-MM-DD
    const toLocalYYYYMMDD = (dateInput) => {
        const date = new Date(dateInput); // accepte un Date ou une string
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }; 

	useEffect(() => {
		if ( !loadingPlanning ) {
			setSelectedVibe( planningDetail.vibe[ '@id' ] );
			setSelectedRooms( planningDetail.rooms.map( room => room[ '@id' ] ) );
			setEventName( planningDetail.label );
			setDateStart( planningDetail.dateStart );
			setDayCreation( planningDetail.dayCreation );
			setHourStart( planningDetail.hourStart );
			setHourEnd( planningDetail.hourEnd );
			setRecurrence( planningDetail.recurrence );
			setAllDay( planningDetail.recurrence === 'none' && planningDetail.hourStart === '00:00' && planningDetail.hourEnd === '23:59' );
			setSwitchOn( planningDetail.recurrence === 'none' && planningDetail.hourStart === '00:00' && planningDetail.hourEnd === '23:59' );
			setLinkVibeOpen( false );
			setLinkRoomOpen( false );
		}
	}
	, [ planningDetail ] );
  
  return ( loadingRoom || loadingVibe || isLoading || loadingPlanning ? <PageLoader /> 
	:
    <div className='mb-16'>
		{ isVisible ?
			<div className='m-4'>
				<div className='flex m-4'>
					<div
						className='flex justify-start items-center'
						onClick={ () => {
								handleClick();
							}
						}
					>
						<RiArrowLeftSFill
							size={30}
							className='text-white bg-secondary-pink rounded-lg h-10 w-10 cursor-pointer'
						/>
					</div>
					<div className='flex justify-center items-center font-bold'>
						<h2 className='ml-10 text-2xl text-primary pr-10' >
							Modification du planning
						</h2>
					</div>
				</div>
				<div className='flex flex-row justify-between bg-primary text-white mx-4 px-4 py-1 rounded-lg' >
					<div className='w-full my-4' >
						<form onSubmit={ handleEditEvent }>
							<div className='flex justify-between ml-4 sm:m-4' >
								<label htmlFor="eventName" >
									Nom de l'évènement
								</label>
								<input
									type="text"
									name="eventName"
									id="eventName"
									className='w-35 sm:w-50 bg-offwhite text-primary rounded py-2 px-3'
									value={ eventName }
									onChange={ ( e ) => { setEventName( e.target.value ) } }
								/>
							</div>
							<hr />
							<div className='flex justify-between m-4' >
								<p>
									Jour entier
								</p>
								<SwitchToggle
									sendToParent={ handleSwitch }
									isOn={ true }
								/>
							</div>
							<hr />
							<div className='flex justify-between m-4' >
								<label htmlFor="dateStart" >
									Date de l'évènement
								</label>
								<input
									type="date"
									name="dateStart"
									id="dateStart"
									value={ toLocalYYYYMMDD( planningDetail.dateStart ) }
									onChange={ ( e ) => {
											setDateStart( e.target.value );
											setDayCreation( daysOfWeek[ new Date( e.target.value ).getDay() ] );
										}
									}
								/>
							</div>
							<hr />
							{ !allDay &&
								<div>
									<div className='flex justify-between m-4' >
										<label htmlFor="hourStart" >
											Heure de début
										</label>
										<input
											type="time"
											name="hourStart"
											id="hourStart"
											value={ planningDetail.hourStart }
											onChange={ ( e ) => { setHourStart( e.target.value ) } }
										/>
									</div>
									<div className='flex justify-between m-4' >
										<label htmlFor="hourEnd">
											Heure de fin
										</label>
										<input
											type="time"
											name="hourEnd"
											id="hourEnd"
											value={ planningDetail.hourEnd }
											onChange={ ( e ) => { setHourEnd( e.target.value ) } }
										/>
									</div>
								</div>
							}
							<hr />
							<div className='flex justify-between items-center m-4' >
								<label htmlFor="recurrence" >
									Récurrence
								</label>
								<select
									name="recurrence"
									id="recurrence"
									className='bg-primary rounded py-2 px-3'
									onChange={  ( e ) => { setRecurrence( e.target.value ) } }
									value={ planningDetail.recurrence }
								>
									<option value="none" >
										Aucune
									</option>
									<option value="daily" >
										Quotidien
									</option>
									<option value="weekly" >
										Hebdomadaire
									</option>
								</select>
							</div>
							<hr />
							<div className='bg-offwhite text-primary mt-4 mx-2 px-4 py-2 rounded-lg cursor-pointer' >
								<div
									onClick={ () => setLinkVibeOpen( !linkVibeOpen ) }
									className='flex items-center justify-between'
								>
									<p>
										Lier l'évènement à une ambiance...
									</p>
									{ linkVibeOpen ?
										<FaChevronDown />
										:
										<FaChevronRight />
									}
								</div>
								{ linkVibeOpen &&
								(
									<div className='flex items-center justify-center mx-4' >
										<div className='flex flex-col w-full text-white rounded-b-2xl justify-center items-center' >
											<div className="grid grid-cols-5 gap-5 p-5 grow place-content-center">
												{ allVibesForUser.map( ( vibe, index ) => (
													<div
														key={ index }
														className={ `p-2 cursor-pointer ${ selectedVibe === vibe[ '@id' ] ? 'bg-secondary-orange rounded-lg' : '' }` }
														onClick={ () => {
															setSelectedVibe( vibe[ '@id' ] );
														}}
													>
														<VibeCard
															key={ index }
															vibe={ vibe }
														/>
													</div>
												))}
											</div>
										</div>
									</div>
								)}
							</div>
							<div className='bg-offwhite text-primary mt-4 mx-2 px-4 py-2 rounded-lg cursor-pointer' >
								<div
									onClick={ () => setLinkRoomOpen( !linkRoomOpen ) }
									className='flex items-center justify-between'
								>
									<p >Lier l'évènement à une pièce...</p>
									{ linkRoomOpen ?
										<FaChevronDown />
										:
										<FaChevronRight />
									}
								</div>
								{ linkRoomOpen && (
									<div className='flex flex-col mt-2 p-2 text-sm'>
										{allRooms.map( ( room, index ) => {
											const isSelected = selectedRooms.includes( room[ '@id' ] );
											return (
												<button
													type='button'
													key={ index }
													onClick={ () => toggleRoomSelection( room ) }
													className={ `p-2 rounded-md mb-1 mr-2 font-bold ${ isSelected ? 'bg-secondary-orange text-white' : 'bg-primary text-white' }` }
												>
													{ room.label }
												</button>
											);
										})}
									</div>
				
								)}
							</div>
							<div className='flex items-center justify-between p-4' >
								<button
									type='button'
									className='bg-secondary-orange p-3 mt-2 rounded-lg transition'
									onClick={ handleClick }
								>
									Annuler
								</button>
								<button
									type='submit'
									className='bg-secondary-orange font-bold p-3 rounded-lg transition'
								>
									Modifier
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		:
			<div>
				<div className='flex justify-between m-10' >
					<Link to='/planning' >
						<RiArrowLeftSFill
							size={ 30 }
							className='text-white bg-secondary-pink rounded-lg  h-10 w-10 cursor-pointer'
						/>
					</Link>
					<div className='flex flex-col justify-center items-center mx-4' >
						<p className='font-bold text-3xl flex justify-center items-center' >
							{ planningDetail.label }
						</p>
					</div>
					<div className='flex flex-col justify-start mr-4' >
						<FaRegTrashAlt
							size={ 30 }
							className='bg-secondary-orange h-10 w-10 text-white rounded-lg p-2 cursor-pointer'
							onClick={ () => handleDeletePlanning( id ) }
						/>
						<FaPen
							size={ 30 }
							className='bg-secondary-orange h-10 w-10 text-white rounded-lg p-2 cursor-pointer mt-4'
							onClick={ () => handleEditPlanning( id ) }
						/>
					</div>
				</div>
				<div className='flex flex-row justify-between bg-primary text-white mx-4 px-4 py-1 rounded-lg' >
					<div className='w-full my-4' >
						<div>
							<div className='flex justify-between m-4' >
								<p>
									Jour entier
								</p>
								<div>
									{ allDay ? 'Oui' : 'Non' }
								</div>
							</div>
							<hr />
							<div className='flex justify-between m-4' >
								<label htmlFor="dateStart" >
									Date de l'évènement
								</label>
								<div>
									{ toLocalDDMMYYYY( planningDetail.dateStart ) }
								</div>
							</div>
							<hr />
							{ !allDay &&
								<div>
									<div className='flex justify-between m-4' >
										<label htmlFor="hourStart" >
											Heure de début
										</label>
										<div>
											{ planningDetail.hourStart }
										</div>
									</div>
									<div className='flex justify-between m-4' >
										<label htmlFor="hourEnd">
											Heure de fin
										</label>
										<div>
											{ planningDetail.hourEnd }
										</div>
									</div>
								</div>
							}
							<hr />
							<div className='flex justify-between items-center m-4' >
								<label htmlFor="recurrence" >
									Récurrence
								</label>
								<div>
									{ getRecurrence( planningDetail.recurrence ) }
								</div>
							</div>
							<hr />
							<div className='bg-offwhite text-primary mt-4 mx-2 px-4 py-2 rounded-lg' >
								<div 
									onClick={ () => setLinkVibeOpen( !linkVibeOpen ) }
									className='flex items-center justify-between'
								>
									<p>
										Evènement lié à l'ambiance :
									</p>
								</div>
								<div className='flex justify-center items-center' >
									<VibeCard vibe={planningDetail.vibe} />
								</div>
							</div>
							<div className='bg-offwhite text-primary mt-4 mx-2 px-4 py-2 rounded-lg' >
								<div 
									onClick={ () => setLinkRoomOpen( !linkRoomOpen ) }
									className='flex items-center justify-between'
								>
									<p >Evènement lié à : </p>
								</div>
								<div>
									{
										planningDetail.rooms.map( ( room ) => (
											<div 
												key={ room.id } 
												className='flex justify-center items-center'
											>
												<RoomCard room={ room } />
											</div>
										))
									}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		}
    </div>
  )
}

export default PlanningDetail