import React from 'react'
import { API_ROOT } from '../../constants/apiConstant';
import { Link } from 'react-router-dom';

const RoomCard = ({room}) => {
  const imgPath = room?.imagePath;

  const imgRoom = `${API_ROOT}/images/rooms/${imgPath}`;

  return (
    <Link to={`/room/${room.id}`}>
      <div className='flex flex-row justify-between m-4'>
          <div className='flex flex-col justify-center items-center'>
              <img src={imgRoom} alt={`Room ${room.label}`} className='w-48 h-48 rounded-lg mb-2' />
              <p className='font-bold'>{room.label}</p>
          </div>
      </div>
    </Link>
  )
}

export default RoomCard