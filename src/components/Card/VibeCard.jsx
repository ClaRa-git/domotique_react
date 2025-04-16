import React from 'react'
import { API_ROOT } from '../../constants/apiConstant';
import { Link } from 'react-router-dom';

const VibeCard = ({vibe}) => {
  const imgPath = vibe?.icon?.imagePath;

  const imgIcon = `${API_ROOT}/images/icons/${imgPath}`;

  return (   
      <div className='flex flex-row justify-between m-4'>
          <div className='flex flex-col justify-center items-center'>
            <div className='flex justify-center w-24 h-20 bg-offwhite rounded-t-full rounded-b-xl shadow-md mx-auto'>
                <img src={imgIcon} alt={`Icon ${vibe.icon}`} className='w-16 h-16 mb-2 mt-4' />
            </div>
            <div className='flex justify-center w-24 h-10 bg-offwhite rounded-b-3xl shadow-md mx-auto'>
                <p className='font-bold mt-2'>{vibe.label}</p>
            </div>            
          </div>
      </div>
  )
}

export default VibeCard