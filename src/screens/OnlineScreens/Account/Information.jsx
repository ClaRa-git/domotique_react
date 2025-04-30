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
import { Link } from 'react-router-dom';
import { RiArrowLeftSFill } from 'react-icons/ri';
import { FaChevronDown, FaChevronRight, FaPlus } from 'react-icons/fa6';

const Information = () => {

    // Récupération de l'utilisateur connecté
    const { userId, username } = useAuthContext();

    // Récupération de dispatch
    const dispatch = useDispatch();

    // Définition des states
    const [ nickname, setNickname ] = useState( username );
    const [ path, setPath ] = useState( '' );
    const [ isEditingAvatar, setIsEditingAvatar ] = useState( false );
    const [ isSelected, setIsSelected ] = useState( false );

    useEffect(() => {
        try {
            dispatch( fetchUserDetail( userId ) );
        } catch ( error ) {
            console.log( `Erreur lors de la récupération des informations de l'utilisateur : ${ error }` );
        }
    }, [ dispatch, userId ] );

    // Récupération des informations de l'utilisateur
    const { userDetail, loading } = useSelector(selectUserData);


    useEffect(() => {
        try {
            dispatch(fetchAllAvatars());         
        } catch ( error ) {
            console.log( `Erreur lors de la récupération des avatars : ${ error }` );
        }
    }, [ dispatch ] );

    // Récupération de la liste des avatars
    const { allAvatars } = useSelector(selectUserData);

    // Récupération du chemin de l'avatar
    const imgAvatar = `${ AVATAR_URL }/${ userDetail.avatar?.imagePath }`;

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
            }
        } catch ( error ) {
            console.error( "Erreur lors de la mise à jour du nom de l'utilisateur", error );
        }
    };

    // Mettre à jour l'avatar de l'utilisateur
    const handleEditAvatar = async ( ) => {
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
    <div className='flex flex-col items-center justify-center w-full h-full' >
        <div className='flex w-full justify-between' >
            <div className='flex'>
                <div className='flex justify-start items-center' >
                    <Link
                        to={`/account/${userId}`}
                        onClick={ () => setIsEditingAvatar( false ) }
                        className='ml-4'
                    >
                        <RiArrowLeftSFill
                            size={30}
                            className='text-white bg-secondary-pink rounded-lg h-10 w-10 cursor-pointer'
                        />
                    </Link>
                </div>
                <div className='flex justify-center items-center font-bold'>
                    <h2 className='ml-10 text-xl text-primary pr-10' >
                        Modification du profil
                    </h2>
                </div>
            </div>
            <div className='flex text-white justify-center items-center' >
                <button
                    onClick={ handleEditAvatar }
                    className='w-full bg-primary font-bold p-2 rounded-lg transition mr-4 '
                >
                    Done
                </button>
            </div>
            </div>
        
        <div className='flex flex-col rounded-lg w-full h-full mb-16' >
            <div className='flex mt-8 justify-center' >
                <img
                    src={ imgAvatar }
                    alt="Avatar"
                    className='w-48 h-48 rounded-lg border-2 border-primary'
                />
            </div>
            <div className='flex flex-row items-center justify-center '>
                <div className='flex flex-row text-primary align-center mb-4' >
                    <CustomInput
                        state={ nickname }
                        label={ 'Nom' }
                        type={ 'text' }
                        callable={( e ) => setNickname( e.target.value ) }
                    />
                </div>
            </div>
            <div className='w-full px-4'>
                <div
                    className={`flex justify-between items-center w-full bg-primary cursor-pointer text-white font-bold p-2 ${isEditingAvatar ? 'rounded-t-lg' : 'rounded-lg'} transition`}
                    onClick={ () => { setIsEditingAvatar( !isEditingAvatar ); } }
                >
                    <div className='flex'>
                        <div className='flex items-center justify-center mr-2' >
                            <FaPlus size={10} />
                        </div>
                        <div className='text-lg font-bold' >
                            Modifier l'avatar
                        </div>
                    </div>
                    { isEditingAvatar ?
                        <FaChevronDown />
                        : 
                        <FaChevronRight />
                    }
                </div>
            </div>
            { isEditingAvatar &&
            (
                <div className='flex items-center justify-center mx-4' >
                    <div className='flex flex-col w-full text-white rounded-b-2xl justify-center items-center bg-primary' >
                        
                        <div className="grid grid-cols-7 gap-5 p-5 grow place-content-center">
                            {allAvatars.map((image) => (
                                <div
                                    key={image.id}
                                    className={`p-2 cursor-pointer ${isSelected === image.id ? 'bg-secondary-orange rounded-2xl' : ''}`}
                                    onClick={() => {
                                        setIsSelected( image.id );
                                        setPath(image['@id']); 
                                    }}>
                                    <img
                                        src={`${ AVATAR_URL }/${image.imagePath}`}
                                        alt={`Avatar ${image.id}`}
                                        className="w-12 h-12 rounded-full" />
                                </div>
                            ))}
                        </div>
                        
                    </div>
                </div>
            )}
        </div>
    </div>
  )
}

export default Information