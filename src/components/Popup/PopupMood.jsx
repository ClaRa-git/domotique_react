import React, { useState, useEffect } from 'react';
import CustomInput from '../Ui/CustomInput';
import ButtonLoader from '../Loader/ButtonLoader';
import { API_ROOT } from '../../constants/apiConstant';
import axios from 'axios';
import { RiArrowLeftSFill } from 'react-icons/ri';
import VibeCard from '../Card/VibeCard';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRoomsAvailable, fetchRoomsUnavailable } from '../../store/room/roomSlice';
import selectRoomData from '../../store/room/roomSelector';
import PageLoader from '../Loader/PageLoader';
import RoomCard from '../Card/RoomCard';
import { fetchAllVibesPlaying } from '../../store/vibe/vibeSlice';

// Afficher le popup de l'humeur
const PopupMood = ( { data, callable, sentToParent, userId } ) => {

    // Récupération des données de l'utilisateur si elles existent
    const [ mood, setMood ] = useState( data.mood || 50 );
    const [ stress, setStress ] = useState( data.stress || 50 );
    const [ tonus, setTonus ] = useState( data.tonus || 50 );

    // State pour les vibes recommandées
    const [ recommendedVibes, setRecommendedVibes ] = useState( [] );

    // State pour la vibe et la room sélectionnées
    const [ selectedVibe, setSelectedVibe ] = useState( null );
    const [ selectedRoom, setSelectedRoom ] = useState( null );

    // State pour le loader du bouton
    const [ isLoading, setIsLoading ] = useState( false );

    // State pour le message d'erreur
    const [ error, setError ] = useState( null );

    // State pour les rooms dans la vibe
    const [ filteredRooms, setFilteredRooms ] = useState( [] );

    // Récupération du dispatch
    const dispatch = useDispatch();

    useEffect(() => {
      dispatch( fetchRoomsAvailable() );
    }, [ dispatch ] );

    const { loadingRoom, roomsAvailable } = useSelector( selectRoomData );

    useEffect(() => {
        dispatch( fetchRoomsUnavailable() );
      }, [ dispatch ] );
  
      const { roomsUnavailable } = useSelector( selectRoomData );


    // Fonction qui calcule l'humeur
    const determineMood = ( mood, tonus, stress ) => {
        mood = parseInt( mood, 10 );
        tonus = parseInt( tonus, 10 );
        stress = parseInt( stress, 10 );

        let score = ( mood + tonus - stress );

        // Calcul du moral en fonction du score
        let result = '';
        if ( score >= 200 ) {
            result = "Excellente humeur";
        } else if ( score >= 150 ) {
            result = "Bonne humeur";
        } else if ( score >= 100 ) {
            result = "Humeur neutre";
        } else if ( score >= 50 ) {
            result = "Fatigué";
        } else if ( score >= 0 ) {
            result = "Triste";
        } else {
            result = "Très stressé";
        }

        return result;  // On retourne directement le résultat
    };

    // Gère la soumission du formulaire pour l'humeur
    const handleSubmit = async ( e ) => {
        // On empêche le comportement par défaut du formulaire
        e.preventDefault();

        // Appeler la fonction de calcul et obtenir le moral
        const calculatedMoral = determineMood( mood, tonus, stress );

        // Passer directement la donnée au parent via sentToParent
        sentToParent(
            {
                calculatedMoral,
                mood,
                tonus,
                stress
            }
        );

        // On récupère les vibes recommandées
        getRecommendedVibes();

        // Appeler la fonction callable pour fermer la popup
        //callable();
    };

    // Fonction pour charger les données du localStorage quand le composant se monte
    useEffect(  () => {
        const savedMoodData = JSON.parse(localStorage.getItem( 'userMood' ) );
        if ( savedMoodData ) {
            setMood( savedMoodData.mood || 50 );
            setStress( savedMoodData.stress || 50 );
            setTonus( savedMoodData.tonus || 50 );
        }
    }, []);

    const getRecommendedVibes = async () => {
        try {
            setIsLoading( true );

            const $data = {
                userId: userId,
                mood: mood,
                tone: tonus,
                stress: stress
            };

            console.log( 'data', $data );

            axios.defaults.headers.post[ 'Content-Type' ] = 'application/ld+json';        
            const response = await axios.post( `${ API_ROOT }/service-vibe-recommended`, $data );

            const vibes = response.data.vibes;

            setRecommendedVibes(vibes);
        } catch ( error ) {
            console.log ( `Erreur lors de la récupération des vibes recommandées : ${ error }` );
            setError( 'Erreur lors de la récupération des vibes recommandées' );
        } finally {
            setIsLoading( false );
        }          
    }

    // Fonction pour donner les rooms pour la vibe
    const getRoomsForVibe = async ( vibe ) => {
        // On récupère les rooms présentes dans la vibe
        const rooms = [ ...new Set(vibe.settings.map( ( setting ) => setting.roomId ) ) ];

        // On filtre allRooms pour ne garder que les rooms présentes dans la vibe
        const filter = roomsAvailable.filter(( room ) => rooms.includes( room.id ) );
        setFilteredRooms(filter);
    }

    // Reset le message d'erreur après 3 secondes
    const resetMessage = () => {
        setTimeout(() => {
            if ( error ) {
                setError( null );
            }
            if ( success ) {
                setSuccess( null );
            }
        }, 3000);
    }

    // Fonction pour jouer la vibe
    const playVibe = async ( vibe, roomId ) => {
        const settings = vibe.settings.filter( setting => setting.roomId === roomId );

        if ( !selectedVibe || !selectedRoom ) {
            setError( 'Veuillez sélectionner une vibe et une room' );
            resetMessage();
            return;
        }
    
        const data = {
            vibeId: vibe.id,
            settings: settings,
            roomId: roomId
        }

        try {
            setIsLoading( true );

            axios.defaults.headers.post[ 'Content-Type' ] = 'application/ld+json';
            const response = await axios.post( `${ API_ROOT }/send-vibe`, {
                vibeId: vibe.id,
                settings: settings,
                roomId: roomId
            } );

            if ( response.status === 200 ) {
                console.log( 'Vibe jouée avec succès' );
            }
            else {
                console.log( 'Erreur lors de l\'envoi de la vibe' );
            }

        } catch (error) {
            console.log( `Erreur lors de l'envoi de la vibe : ${ error }` );
        } finally {
            setIsLoading( false );
        }

        dispatch( fetchAllVibesPlaying() );

        // On ferme la popup
        callable();
    };    

    return ( loadingRoom ? <PageLoader />
        :
		<div className="m-4 mb-16">
			<div className='flex flex-col items-center justify-center w-full h-full' >
                <div className='flex w-full justify-between' >
                    <div className='flex'>
                        <div
                            className='flex justify-start items-center'
                            onClick={ () => {
                                    // On prévient l'utilisateur que l'on quitte sans sauvegarder
                                    if ( window.confirm( 'Êtes-vous sûr de vouloir quitter sans sauvegarder ?' ) ) {
                                        callable();
                                    }
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
                                Calcul de l'humeur
                            </h2>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col w-full items-center justify-center' >
                    <h2 className='text-3xl my-6 font-bold'>Quelle est votre humeur ?</h2>
                    <form
                        className='flex flex-col justify-center w-full bg-primary text-white p-4 rounded-lg'
                        onSubmit={handleSubmit}
                    >
                        <div className='flex justify-center' >
                            <CustomInput
                                state={ mood }
                                label={ 'Humeur' }
                                type={'range' }
                                callable={ ( e ) => setMood( e.target.value ) }
                                textColor='text-white'
                            />
                            <div className='flex items-center justify-center' >
                                <p className='text-white font-bold mb-2 mt-4 ml-4 w-10' >
                                    { mood }
                                </p>
                            </div>
                        </div>
                        <div className='flex justify-center' >
                            <CustomInput
                                state={ stress }
                                label={ 'Stress' }
                                type={ 'range' }
                                callable={ ( e ) => setStress( e.target.value ) }
                                textColor='text-white'
                            />
                            <div className='flex items-center justify-center' >
                                <p className='text-white font-bold mb-2 mt-4 ml-4 w-10' >
                                    { stress }
                                </p>
                            </div>
                        </div>
                        <div className='flex justify-center' >
                            <CustomInput
                                state={ tonus }
                                label={ 'Tonus' }
                                type={ 'range' }
                                callable={ ( e ) => setTonus( e.target.value ) }
                                textColor='text-white'
                            />
                            <div className='flex items-center justify-center' >
                                <p className='text-white font-bold mb-2 mt-4 ml-4 w-10' >
                                    { tonus }
                                </p>
                            </div>
                        </div>
                        { error && 
                            <p className='text-red-500 text-center text-sm m-4' >
                                { error }
                            </p>
                        }
                        <div className='flex justify-center' >
                            {isLoading ?
                            (
                                <ButtonLoader />
                            )
                            :
                            (
                                <div className='flex w-full justify-center'>
                                    <button
                                        type='submit'
                                        className='bg-secondary-orange font-bold p-3 rounded-lg transition'
                                    >
                                        Valider
                                    </button>
                                </div>
                            )}
                        </div>
                    </form>
                </div>
            </div>
            { recommendedVibes.length > 0 && 
                <div className='flex flex-col items-center justify-center w-full h-full' >
                    <h2 className='text-3xl my-6 font-bold'>Vibes recommandées</h2>
                    <div className={`flex flex-col items-center justify-center w-full bg-primary text-white p-4 ${selectedVibe ? 'rounded-t-lg' : 'mb-4 rounded-lg' } `} >
                        { recommendedVibes.map( ( vibe, index ) => (
                            <div 
                                className={ `cursor-pointer ${ selectedVibe?.id == vibe.id ? 'bg-secondary-orange rounded-lg' : '' } `}
                                key={ index }
                                onClick={ () => {
                                        if ( selectedVibe?.id == vibe.id ) {
                                            setSelectedVibe( null );
                                            setFilteredRooms( [] );
                                        }
                                        else {
                                            setSelectedVibe( vibe );
                                            getRoomsForVibe( vibe );
                                        }
                                    }
                                }
                            >
                                <VibeCard
                                    vibe={ vibe }
                                />
                            </div>
                        ))}
                    </div>
                    {
                        selectedVibe ?
                            filteredRooms.length > 0 ?
                            <div className='flex flex-col items-center justify-between w-full bg-primary text-white p-4 rounded-b-lg'>
                                <h2 className='text-3xl my-6 font-bold'>Rooms disponibles</h2>
                                { roomsUnavailable.length > 0 &&
                                    <div className='flex flex-col items-center justify-between'>
                                        <div>Rooms occupées (vibe déjà en cours) : </div>
                                        <div className='mx-2-'>
                                            { roomsUnavailable.map( ( room, index ) => (
                                                <div
                                                    className='mx-4 cursor-pointer'
                                                    key={ index }
                                                >
                                                    { room.label }
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                }

                                <div className='flex flex-col'>
                                    <div className='flex mb-4'>
                                        { filteredRooms.map( ( room, index ) => (
                                            <div
                                                className={`mx-4 cursor-pointer ${ selectedRoom == room.id ? 'bg-secondary-orange rounded-lg' : '' } `}
                                                key={ index }
                                                onClick={ () => {
                                                        if ( selectedRoom == room.id ) {
                                                            setSelectedRoom( null );
                                                        }
                                                        else {
                                                            setSelectedRoom( room.id );
                                                        }
                                                    }
                                                }
                                            >
                                                <RoomCard room={room} />
                                            </div>
                                        ))}
                                    </div>
                                    {isLoading ?
                                    (
                                        <ButtonLoader />
                                    )
                                    :
                                    (
                                        <div className='flex w-full justify-center'>
                                            <button
                                                type='button'
                                                onClick={ () => playVibe( selectedVibe, selectedRoom ) }
                                                className='bg-secondary-orange font-bold p-3 rounded-lg transition'
                                            >
                                                Valider
                                            </button>
                                        </div>
                                    )}
                                        </div>
                                    </div>
                            :
                            <div className='flex flex-col items-center justify-center w-full bg-primary text-white p-4 rounded-lg'>
                                <h2 className='text-3xl my-6 font-bold'>Aucune room disponible</h2>
                            </div>
                        :
                            <div></div>
                    }
                </div>
            }
        </div>
    )
};

export default PopupMood;
