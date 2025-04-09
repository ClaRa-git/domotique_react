import React from 'react'
import { BiHomeAlt } from 'react-icons/bi'
import { API_ROOT } from '../../constants/apiConstant'
import { Link } from 'react-router-dom'

const Footbar = () => {
    const imgIa = `${API_ROOT}/images/logo_ai.png`

  return (
    <div className='absolute bottom-0 left-0 w-full h-20 bg-offwhite flex justify-between items-center rounded-t-xl p-4'>
        <Link to="/">
            <div className='bg-secondary-orange text-white p-2 rounded-full px-4'>
                <BiHomeAlt size={20}/>
            </div>
        </Link>
        <Link to="/ai">
            <div className=' flex bg-secondary-orange text-white p-2 rounded-full px-4'>
                <p className='text-xs pr-2'>ask something to Noctys ...</p>
                <img src={imgIa} alt="logo ia"/>
            </div>
        </Link>
    </div>
  )
}

export default Footbar