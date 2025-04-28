import React, { useState } from 'react'
import { useAuthContext } from '../../../contexts/AuthContext';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import selectUserData from '../../../store/user/userSelector';
import { fetchAllAvatars, fetchUserDetail } from '../../../store/user/userSlice';
import PageLoader from '../../../components/Loader/PageLoader';
import { API_URL, AVATAR_URL } from '../../../constants/apiConstant';
import { FaPen } from 'react-icons/fa';
import CustomInput from '../../../components/Ui/CustomInput';
import axios from 'axios';

const Information = () => {

    // Récupération de l'utilisateur connecté
    const { userId, username } = useAuthContext();

    // Récupération de dispatch
    const dispatch = useDispatch();

    // Définition des states
    const [ nickname, setNickname ] = useState( username );
    const [ path, setPath ] = useState( '' );
    const [ isEditing, setIsEditing ] = useState( false );
    const [ isEditingAvatar, setIsEditingAvatar ] = useState( false );
    const [ isSelected, setIsSelected ] = useState( false );

    useEffect(() => {
      dispatch(fetchUserDetail(userId));
    }, [dispatch, userId]);

    // Récupération des informations de l'utilisateur
    const { userDetail, loading } = useSelector(selectUserData);

    useEffect(() => {
        dispatch(fetchAllAvatars());
    }, [dispatch]);

    // Récupération de la liste des avatars
    const { allAvatars } = useSelector(selectUserData);

    console.log( 'allAvatars', allAvatars );

    // Récupération du chemin de l'avatar
    const imgAvatar = `${ AVATAR_URL }/${ userDetail.avatar?.imagePath }`;

    console.log( 'userDetail', userDetail );

    // Mettre à jour le nom de l'utilisateur
    const handleEditName = async () => {
        try {
            // Mise à jour par le patch
            axios.defaults.headers.patch[ 'Content-Type' ] = 'application/merge-patch+json';
            const response = await axios.patch( `${ API_URL }/profiles/${ userId }`, {
                username: nickname
            });

            // On met à jour le localStorage
            const userInfos = JSON.parse( localStorage.getItem( 'USER_INFOS' ) );
            userInfos.username = nickname;
            localStorage.setItem( 'USER_INFOS', JSON.stringify( userInfos ) );
    
            // Vérification de la réponse
            if ( response.status === 200 ) {
                dispatch( fetchUserDetail( userId ) );
                setIsEditing( false ); // Ferme la popup
            }
        } catch ( error ) {
            console.error( "Erreur lors de la mise à jour du nom de l'utilisateur", error );
        }
    };

    // Mettre à jour l'avatar de l'utilisateur
    const handleEditAvatar = async ( ) => {
        console.log( 'path', path );
        try {
            // Mise à jour par le patch
            axios.defaults.headers.patch[ 'Content-Type' ] = 'application/merge-patch+json';
            const response = await axios.patch( `${ API_URL }/profiles/${ userId }`, {
                avatar: path
            });
    
            // Vérification de la réponse
            if ( response.status === 200 ) {
                dispatch( fetchUserDetail( userId ) );
                setIsEditingAvatar( false ); // Ferme la popup
            }
        } catch ( error ) {
            console.error( "Erreur lors de la mise à jour de l'avatar de l'utilisateur", error );
        }
    };   

  return (
    loading ? <PageLoader />
    :
    <div className='flex flex-col items-center justify-center w-full h-full'>
        <div className='flex flex-col items-center justify-center mb-4 relative'>
            <img
                src={ imgAvatar }
                alt="Avatar"
                className='w-48 h-48 rounded-full'
            />
            <FaPen
                className='absolute top-2 right-2 bg-secondary-orange h-6 w-6 text-white rounded-sm p-1 cursor-pointer'
                onClick={() => {
                    setPath( imgAvatar );
                    setIsEditingAvatar( true );
                }}
            />
        </div>

        <div className='flex flex-row items-center justify-center mb-4 '>
            <div className='text-3xl font-bold' >
                { userDetail.username }
            </div>
            <FaPen
                className='ml-2 bg-secondary-orange h-6 w-6 text-white rounded-sm p-1 cursor-pointer'
                onClick={ () => {
                    setNickname( userDetail.username );
                    setIsEditing( true );
                }}
            />
        </div>

        { isEditing && 
        (
            <div className='z-30 absolute top-0 right-0 bottom-0 left-0 backdrop-blur flex items-center justify-center' >
                <div className='flex flex-col relative w-full text-white sm:w-2/3 lg:w-1/2 h-1/2 rounded-2xl justify-center items-center bg-primary' >
                    <h2 className='text-lg font-bold mb-4' >
                        Modifier le nom
                    </h2>
                    <div className='flex flex-row text-primary align-center' >
                        <CustomInput
                            state={ nickname }
                            label={ 'Nom' }
                            type={ 'text' }
                            callable={( e ) => setNickname( e.target.value ) }
                        />
                    </div>
                    <div className='flex flex-col text-primary justify-center items-center' >
                        <button 
                            onClick={ handleEditName } 
                            className='w-full bg-secondary-orange font-bold p-3 rounded-lg transition'
                        >
                            Sauvegarder
                        </button>
                        <button 
                            onClick={ () => setIsEditing( false ) } 
                            className='w-full bg-secondary-pink font-bold p-3 mt-2 rounded-lg transition'
                        >
                            Annuler
                        </button>
                    </div>
                </div>
            </div>
        )}
        { isEditingAvatar && 
        (
            <div className='z-30 absolute top-0 right-0 bottom-0 left-0 backdrop-blur flex items-center justify-center' >
                <div className='flex flex-col relative w-full text-white sm:w-2/3 lg:w-1/2 h-1/2 rounded-2xl justify-center items-center bg-primary' >
                    <h2 className='text-lg font-bold my-4' >
                        Modifier l'avatar
                    </h2>
                    <div className="grid grid-cols-7 gap-5 p-5 grow place-content-center">
                        {allAvatars.map((image) => (
                            <div
                                key={image.id}
                                className={`p-2 hover:bg-gray-100 cursor-pointer ${isSelected === image.id ? 'bg-secondary-orange rounded-2xl' : ''}`}
                                onClick={() => { setIsSelected(image.id); setPath(image['@id']); }}>
                                <img
                                    src={`${ AVATAR_URL }/${image.imagePath}`}
                                    alt={`Avatar ${image.id}`}
                                    className="w-12 h-12 rounded-full" />
                            </div>
                        ))}
                    </div>
                    <div className='flex flex-col text-primary justify-center items-center mb-4' >
                        <button 
                            onClick={ handleEditAvatar } 
                            className='w-full bg-secondary-orange font-bold p-3 rounded-lg transition'
                        >
                            Sauvegarder
                        </button>
                        <button 
                            onClick={ () => setIsEditingAvatar( false ) } 
                            className='w-full bg-secondary-pink font-bold p-3 mt-2 rounded-lg transition'
                        >
                            Annuler
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  )
}

export default Information