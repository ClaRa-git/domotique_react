import React from 'react'
import { API_ROOT } from '../../constants/apiConstant';
import { FaRegTrashAlt } from 'react-icons/fa';

// Créé un composant SongCard qui affiche les infos d'une chanson
// Le composant prend en paramètre une chanson et une fonction pour renvoyer l'id de la chanson à supprimer
const SongCard = ( { song, sentToParent } ) => {
    
    // Récupère le chemin de l'image de la chanson ou une image par défaut
    const imgPath = song.imagePath
    ? song.imagePath
    : 'song.jpg';

    // Construit l'URL de l'image de la chanson
    const imgSong = `${ API_ROOT }/upload/images/songs/${ imgPath }`;

    return (
        <div className='flex flex-row justify-between items-center mx-4 my-2 rounded-lg' >
            <div className='flex justify-center items-center' >
                <img
                    src={ imgSong }
                    alt="image song"
                    className='rounded-lg mb-2 h-20 mr-4'
                />
                <div>
                    <p className='font-bold text-base' >
                        { song.title }
                    </p>
                    <p className='text-sm' >
                        { song.artist }
                    </p>
                </div>
            </div>
            <FaRegTrashAlt 
                size={ 30 }
                className='bg-primary h-10 w-10 text-white rounded-lg p-2 mr-2 cursor-pointer'
                onClick={ () => sentToParent( song[ '@id' ] ) }  
            />
        </div>
    )
}

export default SongCard