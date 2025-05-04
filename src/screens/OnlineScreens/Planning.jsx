import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import MenuBar from '../../components/Ui/MenuBar';
import { FaChevronDown, FaChevronRight, FaPlus } from 'react-icons/fa6';
import SwitchToggle from '../../components/Ui/SwitchToggle';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import selectVibeData from '../../store/vibe/vibeSelector';
import selectRoomData from '../../store/room/roomSelector';
import { fetchAllVibesForUser } from '../../store/vibe/vibeSlice';
import { useAuthContext } from '../../contexts/AuthContext';
import { fetchAllRooms } from '../../store/room/roomSlice';
import axios from 'axios';
import { API_URL } from '../../constants/apiConstant';
import { fetchAllPlanningsForUser } from '../../store/planning/planningSlice';
import selectPlanningData from '../../store/planning/planningSelector';
import PlanningsByDate from '../../components/Ui/PlanningsByDate';
import PageLoader from '../../components/Loader/PageLoader';
import { IoMdArrowDropleftCircle, IoMdArrowDroprightCircle } from 'react-icons/io';
import VibeCard from '../../components/Card/VibeCard';

// Affiche la page de planning
const Planning = () => {

	// Récupération de l'utilisateur connecté
	const { userId } = useAuthContext();

	// Récupéation de location, navigate et dispatch
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	// State pour gérer l'affichage et le loading
	const [ isVisible, setIsVisible ] = useState( false );
	const [ isLoading, setIsLoading ] = useState( false );

	// State pour gérer l'affichage des ambiances et des pièces
	const [ linkVibeOpen, setLinkVibeOpen ] = useState( false );
	const [ linkRoomOpen, setLinkRoomOpen ] = useState( false );

	// State pour gérer les ambiances et les pièces sélectionnées
	const [ selectedRooms, setSelectedRooms] = useState( [] );
	const [ selectedVibe, setSelectedVibe] = useState( '' );

	// State pour gérer les données de l'évènement
	const [ eventName, setEventName ] = useState( '' );
    const [ date, setDate] = useState( new Date() );
	const [ dateStart, setDateStart ] = useState( new Date() );
	const [ dayCreation, setDayCreation ] = useState( '' );
	const [ hourStart, setHourStart ] = useState( '' );
	const [ hourEnd, setHourEnd ] = useState( '' );
	const [ recurrence, setRecurrence ] = useState( 'none' );
	const [ switchOn, setSwitchOn ] = useState( false );
	const [ allDay, setAllDay ] = useState( false );
	const [ currentMonth, setCurrentMonth ] = useState( new Date() );

	const [ dots, setDots ] = useState( [] );

	// State pour gérer les messages d'erreur et de succès
	const [ error, setError ] = useState( null );
	const [ success, setSuccess ] = useState( null );

	// Renvoie le nombre de jours de récurrence
    const recurrenceNumber = ( recurrence ) => {
        switch ( recurrence ) {
            case 'daily': return 1;
            case 'weekly': return 7;
            case 'monthly': return 30;
            case 'none': return 0;
            default: return -1;
        }
    };

	const daysOfWeek = [
        'Dimanche',
        'Lundi',
        'Mardi',
        'Mercredi',
        'Jeudi',
        'Vendredi',
        'Samedi'
    ];

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

	// Récupération des plannings de l'utilisateur
	useEffect( () => {
	  dispatch( fetchAllPlanningsForUser( userId ) );
	}, [ dispatch, userId ] );
	
	const { loadingPlanning, allPlannings } = useSelector( selectPlanningData );

	console.log( 'allPlannings : ', allPlannings );

	useEffect(() => {
		if (!allPlannings.length) return;
	
		const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
		const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
	
		const dates = new Set();
	
		allPlannings.forEach((planning) => {
			let startDate = new Date(planning.dateStart); // Créer une nouvelle instance de Date
			const recurrencePlanning = planning.recurrence;
			const nbRecurrence = recurrenceNumber(recurrencePlanning);
	
			if (nbRecurrence === 0) {
				if (startDate >= startOfMonth) {
					dates.add(startDate.toDateString());
				}
			} else {
				while (startDate <= endOfMonth) {
					if (startDate >= startOfMonth && startDate <= endOfMonth) {
						dates.add(startDate.toDateString());
					}
					startDate = new Date(startDate.getTime()); // Créer une nouvelle instance à chaque itération
					startDate.setDate(startDate.getDate() + nbRecurrence);
				}
			}
		});
	
		setDots([...dates]);
	}, [allPlannings, currentMonth]);
		

	// Gestion de la sélection des rooms
	const toggleRoomSelection = ( room ) => {
		const roomId = room[ '@id' ];
		if ( selectedRooms.includes( roomId ) ) {
			setSelectedRooms( selectedRooms.filter(r => r !== roomId ) );
		} else {
			setSelectedRooms( [ ...selectedRooms, roomId ] );
		}
	};

	// Gestion de l'affichage du calendrier (un point se rajoute si la date est déjà occupée)
    const tileContent = ( { date: d, view } ) => {
		if (view !== 'month') return null;
	
		const dateStr = d.toDateString();
	
		if (
			dots.includes( dateStr )
		) {
			return <div className="w-1 h-1 bg-orange-400 rounded-full mx-auto mt-1" />;
		}
	
		return null;
	};


	// Gestion du click pour la visibilité
    const handleClick = () => {
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

	// Gestion du formulaire d'ajout d'évènement
	const handleAddEvent = async ( e ) => {
		// Empêche le comportement par défaut du formulaire
		e.preventDefault();

		try {
			// Récupération des données du formulaire
			const data = {
				label: eventName,
				dateStart: dateStart,
				dayCreation: dayCreation,
				hourStart: !allDay ? hourStart : '00:00',
				hourEnd: !allDay ? hourEnd : '23:59',
				recurrence: recurrence,
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

			console.log( 'Données envoyées : ', data );

			// Envoi de la requête POST
			axios.defaults.headers.post[ 'Content-Type' ] = 'application/ld+json';
			const response = await axios.post( `${ API_URL }/plannings`, data );

			if ( response.status === 201 ) {
				console.log( 'L\'évènement a bien été créé' );
				setEventName( '' );
				setDateStart( new Date() );
				setDayCreation( '' );
				setRecurrence( 'none' );
				setSelectedVibe( '' );
				setSelectedRooms( [] );
				setSwitchOn( false );
				setAllDay( false );

				setIsVisible( false );

				setSuccess( 'L\'évènement a bien été créé' );
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
	  
    return ( loadingRoom || loadingPlanning || loadingVibe ? <PageLoader />
		:
        <div className='flex flex-col justify-center mb-16' >
          	<MenuBar />
          	<div>
            	<div className='flex flex-col justify-center items-center mt-4' >
              		<div className='bg-offwhite p-4 rounded-xl w-fit shadow-md' >
						<Calendar
							onActiveStartDateChange={ ( { activeStartDate } ) => setCurrentMonth( activeStartDate ) }
							onChange={ setDate }
							value={ date }
							locale="fr-FR"
							tileContent={ tileContent }
							nextLabel={ <div className=' flex justify-center'> <IoMdArrowDroprightCircle size={ 20 } /> </div> }
							prevLabel={ <div className=' flex justify-center'> <IoMdArrowDropleftCircle size={ 20 } /> </div>}
							formatShortWeekday={( locale, date ) =>
								date.toLocaleDateString( locale, { weekday: 'short' }).slice( 0, 3 )
							}
							className="REACT-CALENDAR"
						/>
              		</div>
					{ date &&
						<PlanningsByDate
							date={ date }
							callable={ setIsLoading }
						/>
					}
              		<div className='w-full' >
						<div>
							{ success && 
								<p className='text-green-500 text-center' >
									{ success }
								</p>
							}
							{ error && 
								<p className='text-red-500 text-center' >
									{ error }
								</p>
							}
						</div>
						<div
							onClick={ handleClick }
							className={`flex flex-row justify-between bg-primary text-white mt-4 mx-4 px-4 py-1 ${
								isVisible ?
								'rounded-t-lg'
								: 
								'rounded-lg' }
								`}
							>
							<div className='flex justify-between w-full items-center gap-2' >
								<div className='flex' >
									<div className='flex items-center justify-center mr-2' >
										<FaPlus size={ 10 } />
									</div>
									<div>
										Ajouter un évènement
									</div>
								</div>
								{ isVisible ?
									<FaChevronDown />
									: 
									<FaChevronRight />
								}
							</div>
						</div>
						{ isVisible &&
							<div className='flex flex-row justify-between bg-primary text-white mx-4 px-4 py-1 rounded-b-lg' >
								<div className='w-full my-4' >
									<form onSubmit={ handleAddEvent }>
										<div className='flex justify-between ml-4 sm:m-4' >
											<label htmlFor="eventName" >
												Nom de l'évènement
											</label>
											<input
												type="text"
												name="eventName"
												id="eventName"
												className='w-35 sm:w-50 bg-offwhite text-primary rounded py-2 px-3'
												onChange={ ( e ) => { setEventName( e.target.value ) } }
											/>
										</div>
										<hr />
										<div className='flex justify-between m-4' >
											<p>
												Jour entier
											</p>
											<SwitchToggle sendToParent={ handleSwitch } />
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
												Ajouter
											</button>
										</div>
									</form>
								</div>
							</div>
						}
              		</div>
            	</div>
          	</div>
        </div>
    );
};

export default Planning;
