import React, { useEffect, useState } from 'react'
import CustomInput from '../Ui/CustomInput'
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllIcons } from '../../store/icon/iconSlice';
import selectIconData from '../../store/icon/iconSelector';
import { RiArrowDownSFill, RiArrowRightSFill } from 'react-icons/ri';
import { fetchUserPlaylists } from '../../store/user/userSlice';
import selectUserData from '../../store/user/userSelector';
import { API_URL, ICON_URL } from '../../constants/apiConstant';
import axios from 'axios';
import { fetchAllVibesForUser } from '../../store/vibe/vibeSlice';

const PopupNewVibe = ( { callable, userId } ) => {

    // Récupération de dispatch
    const dispatch = useDispatch();

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
    <div className='z-30 absolute top-0 right-0 bottom-0 left-0 backdrop-blur flex items-center justify-center' >
        <div className='flex flex-col relative w-full sm:w-2/3 lg:w-1/2 h-2/3 p-4 rounded-lg bg-primary text-white' >
            <form onSubmit={ handleSubmit } >
                <h2 className='text-2xl text-center font-bold mb-4 flex-shrink-0' >
                    Créer une ambiance
                </h2>
                { error &&
                    <div className='flex justify-center items-center mb-4'>
                        <p className='text-red-500 font-bold' >
                            { error }
                        </p>
                    </div>
                }
                <div className='flex-1 overflow-y-auto w-full flex flex-col items-center' >
                    <div className='flex justify-center w-full text-primary'>
                        <CustomInput
                            state={ label }
                            label={ 'Nom de l\'ambiance' }
                            type={ 'text' }
                            callable={ ( e ) => setLabel( e.target.value ) }
                        />
                    </div>
                    <div
                        onClick={ () => { openMenuId == 1 ? setOpenMenuId( 0 ) : setOpenMenuId( 1 ) }}
                        className={ `flex flex-row justify-between items-center w-full p-1 cursor-pointer bg-white text-primary ${ openMenuId == 1 ? 'rounded-t-lg' : 'rounded-lg' }` }
                    >
                        <h2 className='text-lg font-bold w-full px-2' >
                            Critères de l'ambiance
                        </h2>
                        { openMenuId === 1 ? (
                            <RiArrowDownSFill
                                size={ 24 }
                                className='text-secondary-pink'
                            />
                        )
                        :
                        (
                            <RiArrowRightSFill
                                size={ 24 }
                                className='text-secondary-pink'
                            />
                        )}
                    </div>
                    { openMenuId === 1 &&
                        <div className='flex flex-col justify-center items-center pt-4 border-2 border-white rounded-b-lg w-full'>
                            <div className='flex flex-row align-center' >
                                <CustomInput
                                    state={ mood }
                                    label={ 'Humeur' }
                                    type={'range' }
                                    callable={ ( e ) => setMood( parseInt( e.target.value ) ) }
                                />
                                <div className='flex items-center justify-center' >
                                    <p className='text-white font-bold mb-2 mt-4 ml-4 w-10' >
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
                                    <p className='text-white font-bold mb-2 mt-4 ml-4 w-10' >
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
                                    <p className='text-white font-bold mb-2 mt-4 ml-4 w-10' >
                                        { tonus }
                                    </p>
                                </div>
                            </div>
                        </div>
                    }
                    <div
                        onClick={ () => { openMenuId == 2 ? setOpenMenuId( 0 ) : setOpenMenuId( 2 ) }}
                        className={ `flex flex-row justify-between items-center w-full p-1 cursor-pointer mt-4 bg-white text-primary ${ openMenuId == 2 ? 'rounded-t-lg' : 'rounded-lg' }` }
                    >
                    <h2 className='text-lg font-bold w-full px-2' >
                        Playlists
                    </h2>
                    {openMenuId === 2 ? (
                        <RiArrowDownSFill
                            size={ 24 }
                            className='text-secondary-pink'
                        />
                    )
                    :
                    (
                        <RiArrowRightSFill
                            size={ 24 }
                            className='text-secondary-pink'
                        />
                    )}
                    </div>
                    { openMenuId === 2 &&
                        <div className='flex flex-col justify-center items-center p-2 border-2 border-white rounded-b-lg w-full'>
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
                                    className={`flex flex-row justify-between items-center w-full m-1 p-1 cursor-pointer text-primary rounded-lg ${ isSelectedPlaylist === playlist.id ? 'bg-secondary-orange' : 'bg-white' }`}
                                >
                                    <h2 className='text-lg font-bold w-full px-2' >
                                        { playlist.title }
                                    </h2>
                                </div>
                            ))}
                        </div>
                    }
                    <div
                        onClick={ () => { openMenuId == 3 ? setOpenMenuId( 0 ) : setOpenMenuId( 3 ) }}
                        className={ `flex flex-row justify-between items-center w-full p-1 cursor-pointer mt-4 bg-white text-primary ${ openMenuId == 3 ? 'rounded-t-lg' : 'rounded-lg' }` }
                    >
                        <h2 className='text-lg font-bold w-full px-2' >
                            Icône
                        </h2>
                        { openMenuId === 3 ? (
                            <RiArrowDownSFill
                                size={ 24 }
                                className='text-secondary-pink'
                            />
                        )
                        :
                        (
                            <RiArrowRightSFill
                                size={ 24 }
                                className='text-secondary-pink'
                            />
                        )}
                    </div>
                    { openMenuId === 3 &&
                        <div className='grid grid-cols-5 gap-5 p-4 place-content-center w-full border-2 border-white rounded-b-lg'>
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
                <div className='flex justify-center mt-4' >
                    { isLoading ?
                    (
                    <ButtonLoader />
                    )
                    :
                    (
                        <div>
                            <button
                                type='submit'
                                className='w-full bg-secondary-orange font-bold py-3 rounded-lg transition'
                            >
                                Créer
                            </button>
                            <button
                                type='button'
                                onClick={ callable }
                                className='w-full bg-secondary-pink font-bold py-3 mt-2 rounded-lg transition'
                            >
                                Annuler
                            </button>
                        </div>								
                    )}
                </div>
            </form>
        </div>
    </div>
  )
}

export default PopupNewVibe