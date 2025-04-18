import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import MenuBar from '../../components/Ui/MenuBar';
import { FaChevronDown, FaChevronRight, FaPlus } from 'react-icons/fa6';
import SwitchToggle from '../../components/Ui/SwitchToggle';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
	const [ dateEnd, setDateEnd ] = useState( new Date() );
	const [ recurrence, setRecurrence ] = useState( 'none' );
	const [ switchOn, setSwitchOn ] = useState( false );
	const [ allDay, setAllDay ] = useState( false );

	// State pour gérer les messages d'erreur et de succès
	const [ error, setError ] = useState( null );
	const [ success, setSuccess ] = useState( null );

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

	// Gestion de la sélection des rooms
	const toggleRoomSelection = ( room ) => {
		const roomId = room[ '@id' ];
		if ( selectedRooms.includes( roomId )) {
			setSelectedRooms( selectedRooms.filter(r => r !== roomId ) );
		} else {
			setSelectedRooms( [ ...selectedRooms, roomId ] );
		}
	};

	// Gestion de l'affichage du calendrier (un point se rajoute si la date est déjà occupée)
    const tileContent = ( { date: d, view } ) => {
        const dots = [];
        return view === 'month' && dots.includes( d.getDate() ) ?
		(
            <div className="w-1 h-1 bg-orange-400 rounded-full mx-auto mt-1" />
        )
		:
		null;
    };

	// Gestion du click pour la visibilité
    const handleClick = () => {
		setIsVisible( !isVisible );
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

	// Fonction pour permettre de naviguer puis revenir à la page
	const goToVibe = () => {
        navigate( `/vibe`, {
            state: {
                from: location,
                deviceId: null,
            },
        });
    };

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
				dateEnd: dateEnd,
				recurrence: recurrence,
				vibe: selectedVibe,
				room: selectedRooms
			}

			// Loading
			setIsLoading( true );

			// Gestion de champs vides
			if ( !eventName || !dateStart || !dateEnd ) {
				console.log( 'Veuillez remplir tous les champs' );
				setError( 'Veuillez remplir tous les champs' );
				setSuccess( null);
				resetMessage();
				return;
			}

			// Envoi de la requête POST
			axios.defaults.headers.post[ 'Content-Type' ] = 'application/ld+json';
			const response = await axios.post( `${ API_URL }/plannings`, data );

			if ( response.status === 201 ) {
				console.log( 'L\'évènement a bien été créé' );
				setEventName( '' );
				setDateStart( new Date() );
				setDateEnd( new Date() );
				setRecurrence( 'none' );
				setSelectedVibe( '' );
				setSelectedRooms( [] );
				setSwitchOn( false );
				setAllDay( false );

				setIsVisible( false );

				setSuccess( 'L\'évènement a bien été créé' );
				setError( null );
				resetMessage();
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

    return (
        <div className='flex flex-col justify-center mb-16' >
          	<MenuBar />
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
          	<div>
            	<div className='flex flex-col justify-center items-center mt-4' >
              		<div className='bg-[#eee4df] p-4 rounded-xl w-fit shadow-md' >
						<Calendar
							onChange={ setDate }
							value={ date }
							locale="fr-FR"
							tileContent={ tileContent }
							nextLabel="▶"
							prevLabel="◀"
							formatShortWeekday={( locale, date ) =>
								date.toLocaleDateString( locale, { weekday: 'short' }).slice( 0, 3 )
							}
							className="REACT-CALENDAR"
						/>
              		</div>
              		<div className='w-full' >
						<div>
							<p className='text-center text-primary font-bold text-2xl mt-4' >
								Evènements
							</p>
							{ allPlannings.map( ( event, index ) => (
								<Link
									to={ `/planning/${ event.id }` }
									key={ index }
								>
									<div className='bg-offwhite text-primary mt-4 mx-2 px-4 py-2 rounded-lg' >
										<div className='flex justify-between' >
											<p className='text-lg font-bold' >
												{ event.label }
											</p>
										</div>
									</div>
								</Link>
							))}
						</div>
						<div
							onClick={ handleClick }
							className={`flex flex-row justify-between bg-primary text-white mt-4 mx-4 px-4 py-4 ${
								isVisible ?
								'rounded-t-lg'
								: 
								'rounded-lg' }
								`}
							>
							<p>
								Créer un nouvel évènement...
							</p>
							<FaPlus className='mt-1' />
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
												onChange={( e ) => { setEventName( e.target.value ) } }
											/>
										</div>
										<div className='flex justify-between m-4' >
											<p>
												Jour entier
											</p>
											<SwitchToggle sendToParent={ handleSwitch } />
										</div>
										<hr />
										{ allDay ?
											<div>
												<div className='flex justify-between m-4' >
													<label htmlFor="dateStart" >
														Date
													</label>
													<input
														type="date"
														name="dateStart"
														id="dateStart"
														onChange={ ( e ) => {
															setDateStart( e.target.value );
															setDateEnd( e.target.value ) }
														}
													/>
												</div>
											</div>
											:
											<div>
												<div className='flex justify-between m-4' >
													<label htmlFor="dateStart" >
														Début
													</label>
													<input
														type="datetime-local"
														name="dateStart"
														id="dateStart"
														onChange={ ( e ) => { setDateStart( e.target.value ) } }
													/>
												</div>
												<div className='flex justify-between m-4' >
													<label htmlFor="dateEnd">
														Fin
													</label>
													<input
														type="datetime-local"
														name="dateEnd"
														id="dateEnd"
														onChange={ ( e ) => { setDateEnd( e.target.value ) } }
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
												onChange={( e ) => { setRecurrence( e.target.value ) } }
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
												<option value="monthly" >
													Mensuel
												</option>
											</select>
										</div>
										{/* Lier à une ambiance */}
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
												<div>
													<div className='mt-2 pl-2 text-sm' >
														<label
															htmlFor="vibeSelect"
															className='block mb-2 text-sm'
														>
																Choisir une ambiance
														</label>
														<select
															id="vibeSelect"
															value={ selectedVibe[ '@id' ] }
															onChange={ ( e ) => setSelectedVibe( e.target.value ) }
															className="w-full p-2 rounded bg-white text-primary border border-primary"
														>
															<option value="" >
																-- Sélectionner --
															</option>
															{ allVibesForUser.map( ( vibe, index ) => (
																<option
																	key={index}
																	value={ vibe[ '@id' ] }
																>
																	{ vibe.label }
																</option>
															))}
														</select>
													</div>
													<button
														type="button"
														className='mt-2 text-sm underline text-primary hover:text-secondary-orange transition'
														onClick={ goToVibe }
													>
														Créer une nouvelle ambiance
													</button>
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
												<div className='mt-2 pl-2 text-sm' >
													{ allRooms.map( ( room, index ) => (
														<div
															key={index}
															className='flex items-center gap-2 mb-1'
														>
															<input
																type="checkbox"
																id={ `room-${ index }` }
																checked={ selectedRooms.includes( room[ '@id' ] ) }
																onChange={ () => toggleRoomSelection( room ) }
															/>
															<label htmlFor={ `room-${ index }` } >
																{ room.label }
															</label>
														</div>
													))}
												</div>
											)}
										</div>

										<div className='flex items-center justify-between p-4' >
											<button
												type='submit'
												className='bg-secondary-orange font-bold p-3 rounded-lg transition'
											>
												Ajouter
											</button>
											<button
												type='button'
												className='bg-secondary-pink p-3 mt-2 rounded-lg transition'
											>
												Annuler
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
