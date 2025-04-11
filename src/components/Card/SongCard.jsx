import React from 'react'
import { API_ROOT } from '../../constants/apiConstant';
import { FaRegTrashAlt } from 'react-icons/fa';

const SongCard = ({song, sentToParent}) => {
    
    const imgPath = song.imagePath
    ? song.imagePath
    : 'song.jpg';

    const imgSong = `${API_ROOT}/upload/images/songs/${imgPath}`;

    return (
        <div className='flex flex-row justify-between text-white items-center mx-10 my-2 bg-primary rounded-lg p-2'>
            <div className='flex justify-center items-center'>
                <img src={imgSong} alt="image song" className='rounded-lg mb-2 h-20 m-4'/>
                <div>
                    <p className='font-bold'>{song.title}</p>
                    <p className='text-sm'>{song.artist}</p>
                </div>
            </div>
            <FaRegTrashAlt 
                size={30}
                className='bg-secondary-orange h-10 w-10 text-white rounded-lg p-2 mr-2 cursor-pointer'
                onClick={() => sentToParent(song['@id'])}  
            />
        </div>
    )
}

export default SongCard