import React, { useState } from 'react'
import { useAuthContext } from '../../../contexts/AuthContext';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import selectUserData from '../../../store/user/userSelector';
import { fetchAllAvatars, fetchUserDetail } from '../../../store/user/userSlice';
import PageLoader from '../../../components/Loader/PageLoader';
import { API_URL, AVATAR_URL } from '../../../constants/apiConstant';
import { FaEye, FaEyeSlash, FaPen } from 'react-icons/fa';
import CustomInput from '../../../components/Ui/CustomInput';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { RiArrowLeftSFill } from 'react-icons/ri';

const Password = () => {

    // Récupération de l'utilisateur connecté
    const { userId, username } = useAuthContext();

    // Récupération de dispatch
    const dispatch = useDispatch();

    // Définition des states
    const [ password, setPassword ] = useState( '' );
    const [ isVisible, setIsVisible ] = useState( true );

    useEffect(() => {
      dispatch( fetchUserDetail( userId ) );
    }, [ dispatch, userId ] );

    // Récupération des informations de l'utilisateur
    const { userDetail, loading } = useSelector( selectUserData );

    // Mettre à jour le mot de passe de l'utilisateur
    const handleEdit = async () => {
        try {
            // Mise à jour par le patch
            axios.defaults.headers.patch[ 'Content-Type' ] = 'application/merge-patch+json';
            const response = await axios.patch( `${ API_URL }/profiles/${ userId }`, {
                password: password
            });
    
            // Vérification de la réponse
            if ( response.status === 200 ) {
                dispatch( fetchUserDetail( userId ) );
                setPassword( '' );
            }
        } catch ( error ) {
            console.error( "Erreur lors de la mise à jour du mot de passe de l'utilisateur", error );
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
                                className='ml-4'
                            >
                                <RiArrowLeftSFill
                                    size={30}
                                    className='text-white bg-secondary-pink rounded-lg h-10 w-10 cursor-pointer'
                                />
                            </Link>
                        </div>
                        <div className='flex justify-center items-center font-bold'>
                            <h2 className='ml-10 text-2xl text-primary pr-10' >
                                Modification du mot de passe
                            </h2>
                        </div>
                    </div>
                    <div className='flex text-white justify-center items-center' >
                        <button
                            onClick={ handleEdit }
                            className='w-full bg-primary font-bold p-2 rounded-lg transition mr-4 '
                        >
                            Done
                        </button>
                    </div>
                </div>
        
        <div className='flex flex-col items-center rounded-lg w-full h-full mb-16' >
            <div className='flex mt-16'>
                <CustomInput
                    state={ password }
                    label={ 'Mot de passe' }
                    type={ isVisible ? 'password' : 'text' }
                    callable={ ( e ) => setPassword( e.target.value ) }
                />
                <div className='flex justify-center items-center p-2 mt-4'>
                    { isVisible ?
                        <FaEye
                            size={ 20 }
                            onClick={ () => setIsVisible( !isVisible ) }
                        />
                        :
                        <FaEyeSlash
                            size={ 20 }
                            onClick={ () => setIsVisible( !isVisible ) }
                        />
                    }
                </div>
            </div>
        </div>
                  
    </div>
  )
}

export default Password