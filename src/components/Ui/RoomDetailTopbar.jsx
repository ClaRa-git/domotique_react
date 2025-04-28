import React from 'react'
import { API_ROOT } from '../../constants/apiConstant';
import { RiArrowLeftSFill } from 'react-icons/ri';
import { Link } from 'react-router-dom';

const RoomDetailTopbar = ({ roomDetail }) => {

    // Récupération du chemin de l'image de la pièce
    const imgPath = roomDetail?.imagePath;
    const imgRoom = `${ API_ROOT }/images/rooms/${ imgPath }`;

  return (
    <div className='flex w-full p-4 mb-4' >
        <Link to='/room' >
            <RiArrowLeftSFill
                size={30}
                className='text-white bg-secondary-pink rounded-lg  h-10 w-10 cursor-pointer'
            />
        </Link>                
        <div className='flex flex-col items-center mb-4 mr-10 w-full' >
            <img
                src={ imgRoom }
                alt={`Pièce ${ roomDetail?.label }` }
                className='w-48 h-48 rounded-lg mb-2' />
            <h1 className='text-2xl font-bold' >
                { roomDetail?.label }
            </h1>
        </div>
    </div>
  )
}

export default RoomDetailTopbar