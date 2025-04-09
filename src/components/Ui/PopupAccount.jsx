import React, { useState } from 'react'
import { API_ROOT, IMAGE_URL } from '../../constants/apiConstant'
import { useAuthContext } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import CustomInput from './CustomInput';
import axios from 'axios';
import ButtonLoader from '../Loader/ButtonLoader';

const PopupAccount = ({data, callable}) => {
  const imgAvatar = `${IMAGE_URL}/avatars/${data.avatar.imagePath}`;

  const [user, setUser] = useState(null);
  const [username, setUsername] = useState(data.username);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { signIn } = useAuthContext();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_ROOT}/login-react`, {username, password});

      if(response.data.success === false) {
        setError(response.data.message);
      } else {
        const loggingUser = {
          userId: response.data.user.id,
          username: response.data.user.username
        };
        signIn(loggingUser);
        setUser(loggingUser);
        callable();
        // on réactualise la page
        window.location.reload();
      }
    } catch (error) {
       console.log(`Erreur lors de la connexion : ${error}`);
       setError('Erreur lors de la connexion');
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <div className='z-30 absolute top-0 right-0 bottom-0 left-0 backdrop-blur flex items-center justify-center'>
        <div className="flex relative w-full sm:w-2/3 lg:w-1/2 h-1/2 rounded-2xl justify-center items-center bg-gray-800 border-2 border-white">
          <div className='flex flex-col w-1/3 m-6 justify-center items-center'>
            <img src={imgAvatar} alt="avatar" className='w-full h-full object-cover rounded-full border-2 border-white' />
            <h1 className='text-2xl font-bold text-white'>{data.username}</h1>
          </div>
          <div className='flex flex-col items-center justify-center w-2/3 h-full'>
            <form onSubmit={handleSubmit}>
              <CustomInput
                state={password}
                label={'Mot de passe'}
                type={'password'}
                callable={(e) => setPassword(e.target.value)}
              />
              {error && <p className='text-red-500 text-sm'>{error}</p>}
              <div className='flex justify-center'>
                {isLoading ? (
                  <ButtonLoader />
                  ) : (
                    <div>
                      <button type='submit' className='w-full bg-white font-bold py-3 rounded-lg transition'>
                        Se connecter
                      </button>
                      <button type='button' onClick={callable} className='w-full bg-gray-500 font-bold py-3 mt-2 rounded-lg transition'>
                        Annuler
                      </button>
                    </div>
                    
                  )}
              </div>
            </form>
          </div>
        </div>
    </div>
  )
}

export default PopupAccount