import React, { useEffect, useState } from 'react'
import CustomInput from '../Ui/CustomInput'
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllIcons } from '../../store/icon/iconSlice';
import selectIconData from '../../store/icon/iconSelector';
import { fetchUserPlaylists } from '../../store/user/userSlice';
import selectUserData from '../../store/user/userSelector';
import { API_URL, ICON_URL } from '../../constants/apiConstant';
import axios from 'axios';
import { fetchAllVibesForUser } from '../../store/vibe/vibeSlice';
import { FaChevronDown, FaChevronRight, FaMinus, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { RiArrowLeftSFill } from 'react-icons/ri';

const PopupNewVibe = ( { callable, userId, from } ) => {

    // Récupération de dispatch
    const dispatch = useDispatch();

    // Récupération de navigate
    const navigate = useNavigate();

    useEffect(() => {
        dispatch( fetchAllIcons() );
    }, [ dispatch ] );

    const { allIcons } = useSelector( selectIconData);

    useEffect(() => {
        dispatch( fetchUserPlaylists( userId ) );
    }, [ dispatch, userId ] );

    const { userPlaylists } = useSelector( selectUserData );

    // Création des states
    const [ mood, setMood ] = useState( 50 );
    const [ stress, setStress ] = useState( 50 );
    const [ tonus, setTonus ] = useState( 50 );

    const [ label, setLabel ] = useState( '' );
    const [ iconPath, setIconPath ] = useState( '' );
    const [ playlistPath, setPlaylistPath ] = useState( '' );

    const [ openMenuId, setOpenMenuId ] = useState( null );
    const [ isSelectedPlaylist, setIsSelectedPlaylist ] = useState( null );
    const [ isSelectedIcon, setIsSelectedIcon ] = useState( null );
    const [ isLoading, setIsLoading ] = useState( false );

    const [ error, setError ] = useState( null );

    // Reset le message d'erreur après 3 secondes
    const resetMessage = () => {
        setTimeout(() => {
            setError( null );
        }, 3000);
    }

    const handleSubmit = async ( e ) => {
        // On empêche le comportement par défaut du formulaire
        e.preventDefault();

        try {
            setError( '' );

            // Vérification des champs
            if ( label.trim() === '' || iconPath === '') {
                setError( 'Veuillez remplir tous les champs' );
                resetMessage();
                return;
            }

            // On créé le critère
            const criteria = {
                mood: mood,
                stress: stress,
                tone: tonus
            }

            axios.defaults.headers.post[ 'Content-Type' ] = 'application/ld+json';
            const criteriaResponse = await axios.post( `${ API_URL }/criterias`, criteria );

            if ( criteriaResponse.status !== 201 ) {
                setError( 'Erreur lors de la création du critère' );
                resetMessage();
                return;
            }

            const criteriaId = criteriaResponse.data['@id'];

            // On créé l'ambiance
            const vibe = {
                label: label,
                criteria: criteriaId,
                playlist: playlistPath,
                profile: `api/profiles/${ userId }`,
                icon: iconPath
            };

            axios.defaults.headers.post[ 'Content-Type' ] = 'application/ld+json';
            const vibeResponse = await axios.post( `${ API_URL }/vibes`, vibe );

            if ( vibeResponse.status !== 201 ) {
                setError( 'Erreur lors de la création de l\'ambiance' );
                resetMessage();
                return;
            }

            setIsLoading( false );

            // Si from n'est pas null, on redirige vers la page room/id
            if ( from ) {
                navigate(from.pathname);
            }

            dispatch( fetchAllVibesForUser( userId ) );
            
            // On ferme la popup
            callable();

        } catch (error) {
            console.error( `Erreur lors de la création de l'ambiance : ${error}` );
            setError( 'Erreur lors de la création de l\'ambiance' );
            resetMessage();
            return;
        }

    }

  return (
    <div className="m-4 mb-16">
        <div className='flex flex-col items-center justify-center w-full h-full' >
            <div className='flex w-full justify-between' >
                <div className='flex my-4'>
                    <div
                        className='flex justify-start items-center'
                        onClick={ () => {
                                // On prévient l'utilisateur que l'on quitte sans sauvegarder
                                if ( window.confirm( 'Êtes-vous sûr de vouloir quitter sans sauvegarder ?' ) ) {
                                    if ( from ) {
                                        navigate(from.pathname);
                                    }
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
                            Création d'une ambiance
                        </h2>
                    </div>
                </div>
                <div className='flex text-white justify-center items-center' >
                    <div
                        className='w-full bg-primary font-bold p-2 rounded-lg transition mr-4 cursor-pointer'
                        onClick={ () => handleSubmit() }
                    >
                        Done
                    </div>
                </div>
            </div>
            { error &&
                <div className='flex justify-center items-center mb-4'>
                    <p className='text-red-500 font-bold' >
                        { error }
                    </p>
                </div>
            }
            <div className='flex-1 overflow-y-auto w-full flex flex-col items-center' >
                <div className='flex justify-center w-full'>
                    <CustomInput
                        state={ label }
                        label={ 'Nom de l\'ambiance' }
                        type={ 'text' }
                        callable={ ( e ) => setLabel( e.target.value ) }
                    />
                </div>
                <div
                    onClick={ () => { openMenuId == 1 ? setOpenMenuId( 0 ) : setOpenMenuId( 1 ) }}
                    className={ `flex flex-row justify-between items-center w-full p-1 cursor-pointer bg-primary text-white ${ openMenuId == 1 ? 'rounded-t-lg' : 'rounded-lg' }` }
                >
                    <h2 className='text-lg font-bold w-full px-2' >
                        Critères de l'ambiance
                    </h2>
                    { openMenuId === 1 ?
                        <FaChevronDown />
                        :
                        <FaChevronRight />
                    }
                </div>
                { openMenuId === 1 &&
                    <div className='flex flex-col justify-center items-center pt-4 bg-primary rounded-b-lg w-full text-white'>
                        <div className='flex flex-row align-center' >
                            <CustomInput
                                state={ mood }
                                label={ 'Humeur' }
                                type={'range' }
                                callable={ ( e ) => setMood( parseInt( e.target.value ) ) }
                                textColor='text-white'
                            />
                            <div className='flex items-center justify-center' >
                                <p className='font-bold mb-2 mt-4 ml-4 w-10' >
                                    { mood }
                                </p>
                            </div>
                        </div>
                        <div className='flex flex-row align-center' >
                            <CustomInput
                                state={ stress }
                                label={ 'Stress' }
                                type={ 'range' }
                                callable={ ( e ) => setStress( parseInt( e.target.value ) ) }
                            />
                            <div className='flex items-center justify-center' >
                                <p className='font-bold mb-2 mt-4 ml-4 w-10' >
                                    { stress }
                                </p>
                            </div>
                        </div>
                        <div className='flex flex-row align-center' >
                            <CustomInput
                                state={ tonus }
                                label={ 'Tonus' }
                                type={ 'range' }
                                callable={ ( e ) => setTonus( parseInt( e.target.value ) ) }
                            />
                            <div className='flex items-center justify-center' >
                                <p className='font-bold mb-2 mt-4 ml-4 w-10' >
                                    { tonus }
                                </p>
                            </div>
                        </div>
                    </div>
                }
                <div
                    onClick={ () => { openMenuId == 2 ? setOpenMenuId( 0 ) : setOpenMenuId( 2 ) }}
                    className={ `flex flex-row justify-between items-center w-full p-1 cursor-pointer mt-4 bg-primary text-white ${ openMenuId == 2 ? 'rounded-t-lg' : 'rounded-lg' }` }
                >
                <h2 className='text-lg font-bold w-full px-2' >
                    Playlists
                </h2>
                {openMenuId === 2 ? 
                    <FaChevronDown />
                    :
                    <FaChevronRight />
                }
                </div>
                { openMenuId === 2 &&
                    <div className='flex flex-col justify-center items-center p-2 rounded-b-lg w-full bg-primary text-white'>
                        { userPlaylists && userPlaylists.map( ( playlist, index ) => (
                            <div
                                key={ index }
                                onClick={ () =>
                                    {
                                        if ( isSelectedPlaylist === playlist.id ) {
                                            setIsSelectedPlaylist( null );
                                            setPlaylistPath( '' )
                                        } else {
                                            setIsSelectedPlaylist(playlist.id);
                                            setPlaylistPath( playlist['@id'] );
                                        }
                                    }
                                }
                                className={`flex flex-row justify-between items-center w-full m-1 p-1 cursor-pointer bg-offwhite rounded-lg ${ isSelectedPlaylist === playlist.id ? 'text-secondary-orange' : 'text-primary' }`}
                            >
                                <h2 className='text-lg font-bold w-full px-2' >
                                    { playlist.title }
                                </h2>
                                { isSelectedPlaylist === playlist.id ?
                                    <FaMinus
                                        size={ 20 }
                                        className='ml-2'
                                    />
                                    :
                                    <FaPlus
                                        size={ 20 }
                                        className='ml-2'
                                    />
                                }
                            </div>
                        ))}
                    </div>
                }
                <div
                    onClick={ () => { openMenuId == 3 ? setOpenMenuId( 0 ) : setOpenMenuId( 3 ) }}
                    className={ `flex flex-row justify-between items-center w-full p-1 cursor-pointer mt-4 bg-primary text-white ${ openMenuId == 3 ? 'rounded-t-lg' : 'rounded-lg' }` }
                >
                    <h2 className='text-lg font-bold w-full px-2' >
                        Icône
                    </h2>
                    { openMenuId === 3 ? 
                        <FaChevronDown />
                        :
                        <FaChevronRight />                        
                    }
                </div>
                { openMenuId === 3 &&
                    <div className='grid grid-cols-5 gap-5 p-4 place-content-center w-full rounded-b-lg bg-primary'>
                        {allIcons.map((icon) => (
                            <div
                                key={icon.id}
                                className={`flex justify-center cursor-pointer ${isSelectedIcon === icon.id ? 'bg-secondary-orange rounded-lg' : ''}`}
                                onClick={() => { setIsSelectedIcon(icon.id); setIconPath(icon['@id']); }}>
                                <img
                                    src={`${ ICON_URL }/${icon.imagePath}`}
                                    alt={`Icône ${icon.id}`}
                                    className="w-12 h-12 rounded-full" />
                            </div>
                        ))}
                    </div>
                }
            </div>
            <div className='flex justify-center w-full mt-4' >
                { isLoading ?
                (
                <ButtonLoader />
                )
                :
                (
                    <div className='flex w-full justify-between text-white'>
                        <button
                            type='button'
                            onClick={ () => {
                                    if ( window.confirm( 'Êtes-vous sûr de vouloir quitter sans sauvegarder ?' ) ) {
                                        if ( from ) {
                                            navigate(from.pathname);
                                        }
                                        callable();
                                    }
                                }
                            }
                            className='bg-secondary-orange px-4 py-2 rounded-lg transition'
                        >
                            Annuler
                        </button>
                        <button
                            type='submit'
                            className='bg-secondary-orange px-4 py-2 font-bold rounded-lg transition'
                        >
                            Ajouter
                        </button>
                    </div>								
                )}
            </div>
        </div>
    </div>
  )
}

export default PopupNewVibe