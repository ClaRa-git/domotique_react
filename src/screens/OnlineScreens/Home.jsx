import React, { useEffect, useState } from 'react'
import { useAuthContext } from '../../contexts/AuthContext'
import MoodCard from '../../components/Card/MoodCard';
import MenuCard from '../../components/Card/MenuCard';
import { LuMusic4 } from 'react-icons/lu';
import { TbBulbFilled } from 'react-icons/tb';
import { FaBed, FaRegCalendarCheck } from 'react-icons/fa';
import PopupMood from '../../components/Popup/PopupMood';
import MoodPie from '../../components/Mood/MoodPie';
import HelloUser from '../../components/Ui/HelloUser';
import { USER_INFOS, USER_MOOD } from '../../constants/appConstant';
import PageLoader from '../../components/Loader/PageLoader';
import VibeLocalStorage from '../../components/Ui/VibeStorage';
import { fetchAllVibesPlaying } from '../../store/vibe/vibeSlice';
import selectVibeData from '../../store/vibe/vibeSelector';
import { useDispatch, useSelector } from 'react-redux';

// Page d'accueil
const Home = () => {

	// Récupération du dispatch
	const dispatch = useDispatch();

	// Récupération de l'utilisateur connecté dans le localStorage
	const user = JSON.parse( localStorage.getItem( USER_INFOS ) );

	const [ username ] = useState( user.username );
	
	// Définition des states
	const [ isVisible, setIsVisible] = useState( false );

	const [ moral, setMoral ] = useState( 'Pas d\'humeur renseignée' );
	const [ stress, setStress ] = useState( 50 );
	const [ tonus, setTonus ] = useState( 50 );
	const [ mood, setMood ] = useState( 50 );

	// useEffect pour récupérer les données de l'humeur, du stress et du tonus depuis le localStorage
	useEffect(() => {
		const savedMoodData = JSON.parse( localStorage.getItem( USER_MOOD ) );
		if ( savedMoodData ) {
		setMood( savedMoodData.mood || 50 );
		setStress( savedMoodData.stress || 50 );
		setTonus( savedMoodData.tonus || 50 );
		setMoral( savedMoodData.calculatedMoral || 'Pas d\'humeur renseignée');
		}
	}, []);

    useEffect(() => {
        dispatch( fetchAllVibesPlaying() );
    }, [ dispatch ] );

    const { loadingVibe, allVibesPlaying } = useSelector( selectVibeData );
	
	// Fonction pour afficher / cacher le popup
	const handleClick = () => {
		setIsVisible( true );
	}

	// Fonction pour gérer les données envoyées par le popup
	const handleDataFromMood = ( data ) => {
		setMoral( data.calculatedMoral );
		setMood( data.mood );
		setTonus( data.tonus );
		setStress( data.stress );
	}

	return ( loadingVibe ? <PageLoader />
		:
		<div className='p-4'>
			{ isVisible ?
				<PopupMood
					data={ { mood, stress, tonus } }
					callable={ () => setIsVisible( false ) }
					sentToParent={ handleDataFromMood }
					userId={ user.userId }
				/>
			:
				<div className='min-h-screen flex flex-col' >
					<HelloUser username = { username } />
					<VibeLocalStorage
						allVibesPlaying={ allVibesPlaying }
					/>
					<div
						onClick={ handleClick }
						className='flex flex-row m-4 justify-around bg-primary rounded-lg p-4 text-white cursor-pointer'
					>
						<div className='flex flex-col justify-center align-around' >
						<p className='mb-5 text-center' >
							Votre mood actuelle :
						</p>
						<MoodCard
							moral={ moral }
						/>
						</div>
						<MoodPie
							mood={ mood }
							stress={ stress }
							tonus={ tonus }
						/>
					</div>
					<div className='flex flex-col justify-center my-4 p-4 bg-primary rounded-t-[50px] flex-grow shadow-[0_-8px_0_rgba(194,133,140,1)]' >
						<div className='grid grid-cols-2 gap-5 p-5 grow place-content-center' >
							<MenuCard
								icon={ <LuMusic4 className='h-8 w-8 sm:h-12 sm:w-12' /> }
								label={ "Playlists" }
								link={ "/playlist" }
							/>
							<MenuCard
								icon={ <FaBed className='h-8 w-8 sm:h-12 sm:w-12' /> }
								label={ "Pièces" }
								link={ "/room" }
							/>
							<MenuCard
								icon={ <FaRegCalendarCheck className='h-8 w-8 sm:h-12 sm:w-12' /> }
								label={ "Planning" }
								link={ "/planning" }
							/>
							<MenuCard
								icon={ <TbBulbFilled className='h-8 w-8 sm:h-12 sm:w-12' /> }
								label={ "Ambiances" }
								link={ "/vibe" }
							/>
						</div>
					</div>
				</div>
			}
		</div>
	)
}

export default Home
