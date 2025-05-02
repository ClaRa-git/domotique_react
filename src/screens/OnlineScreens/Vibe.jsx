import React, { useEffect, useState } from 'react'
import MenuBar from '../../components/Ui/MenuBar'
import { useDispatch, useSelector } from 'react-redux';
import selectVibeData from '../../store/vibe/vibeSelector';
import { fetchAllVibesForUser } from '../../store/vibe/vibeSlice';
import PageLoader from '../../components/Loader/PageLoader';
import VibeCard from '../../components/Card/VibeCard';
import { FaChevronDown, FaChevronRight, FaPlus } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import PopupNewVibe from '../../components/Popup/PopupNewVibe';

// Page d'accueil des ambiances
const Vibe = () => {

    // Récupération de dispatch
    const dispatch = useDispatch();

    // Récupération de location.from et eltVisible s'ils existent
    const location = useLocation();
    const from = location.state?.from || null;
    const eltVisible = location.state?.eltVisible || false;

    // Récupération de l'ID de l'utilisateur via le contexte    
    const { userId } = useAuthContext();

    // Création des states
    const [ isVisible, setIsVisible ] = useState( eltVisible );

    // Récupération de toutes les ambiances de l'utilisateur
    useEffect(() => {
        dispatch( fetchAllVibesForUser( userId ) );
    }, [ dispatch, userId ] );

    const { loadingVibe, allVibesForUser } = useSelector( selectVibeData );

    // Fonction pour gérer le clic sur le bouton "Créer une nouvelle ambiance"
    const handleClick = () => {
        setIsVisible( !isVisible );
    }

    return (
        loadingVibe ? <PageLoader />
        :
        <div>
            <MenuBar />
            { isVisible ?
                <PopupNewVibe
                    callable={ () => setIsVisible( false) }
                    userId={ userId }
                    from={ from }
                />
            :
            <div>
                <div
                    onClick={ handleClick }
                    className={`flex flex-row justify-between bg-primary text-white mt-4 mx-4 px-4 py-1 ${ isVisible ? 'rounded-t-lg' : 'rounded-lg' } hover:cursor-pointer`}
                >
                    <div className='flex w-full justify-between'>
                        <div className='flex items-center'>
                            <FaPlus className='mr-2' />
                            <div className='flex items-center'>
                                Créer une nouvelle vibe
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className='grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 mb-16' >
                    { allVibesForUser && allVibesForUser.map( ( vibe, index ) => (
                        <Link
                            to={ `/vibe/${ vibe.id }` }
                            key={ index }
                        >
                            <div className='flex flex-col justify-center items-center' >
                                <VibeCard vibe={ vibe } />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            }
            
        </div>
    )
}

export default Vibe