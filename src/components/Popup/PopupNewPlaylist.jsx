import React, { useState } from 'react'
import CustomInput from '../Ui/CustomInput';
import axios from 'axios';
import { API_URL } from '../../constants/apiConstant';
import ButtonLoader from '../Loader/ButtonLoader';

const PopupNewPlaylist = ({callable, userId}) => {

    const [playlistName, setPlaylistName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault(); //empeche le comportement naturel du formulaire
        try {
          setError('');
          const data = {
            title: playlistName.trim(),
            profile: `/api/profiles/${userId}`,
            vibes: [],
            songs: []
          }

          setIsLoading(true);

          if (data.title === '') {
            setError('Le nom de la playlist ne peut pas être vide');
            displaySuccess();
            return;
          }

          axios.defaults.headers.post['Content-Type'] = 'application/ld+json';
          const response = await axios.post(`${API_URL}/playlists`, data)

          if (response.status === 201) {
            setSuccess('La playlist a bien été créée');
            setPlaylistName('');
            displaySuccess();
            callable();
          }
        } catch (error) {
          setError("Une erreur est survenue lors de l'ajout de la playlist");
          displaySuccess();
          console.log(`erreur lors de l'ajout de la playlist : ${error}`);
        } finally {
          setIsLoading(false);
        }
      }
    
      //permet d'effacer les messages success et error après 3 secondes
      const displaySuccess = () => {
        setTimeout(() => {
          setSuccess('');
          setError('');
        }, 3000)
      }

  return (
    <div className='z-30 absolute top-0 right-0 bottom-0 left-0 backdrop-blur flex items-center justify-center'>
        <div className="flex flex-col relative w-full sm:w-2/3 lg:w-1/2 h-1/2 rounded-2xl justify-center items-center bg-primary">
            <h2 className='m-8 text-2xl text-white font-bold'>Créer une nouvelle playlist</h2>
            <div className='flex flex-col items-center justify-center w-2/3'>
                <form onSubmit={handleSubmit}>
                    <CustomInput
                        state={playlistName}
                        label={'Nom'}
                        type={'text'}
                        callable={(e) => setPlaylistName(e.target.value)}
                    />
                    {success && <p className='text-green-500 text-center'>{success}</p>}
                    {error && <p className='text-red-500 text-center'>{error}</p>}
                    <div className='flex justify-center'>
                        {isLoading ? (
                        <ButtonLoader />
                        ) : (
                            <div>
                            <button type='submit' className='w-full bg-secondary-orange font-bold py-3 rounded-lg transition'>
                                Créer
                            </button>
                            <button type='button' onClick={callable} className='w-full bg-secondary-pink font-bold py-3 mt-2 rounded-lg transition'>
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

export default PopupNewPlaylist