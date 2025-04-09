import React from 'react'
import { FaSearch } from 'react-icons/fa'
import { RiAccountCircleFill } from 'react-icons/ri'
import { Link } from 'react-router-dom'
import { API_ROOT } from '../../constants/apiConstant'
import { useAuthContext } from '../../contexts/AuthContext'

const Topbar = () => {
  const imgIcon = `${API_ROOT}/images/logo.png`

  const {userId}  = useAuthContext();

  return (
    <div className='h-24 flex items-center m-6'>
      <div className='flex-1 text-white text-lg font-semibold px-4'>
            <div className='flex justify-between w-full items-center text-primary m-6'>
                <div className='justify-center items-center m-6'>
                    <Link to='/search'>
                    <FaSearch size={32}/>
                    </Link>
                </div>
                <div>
                    <Link to='/'>
                    <img src={imgIcon} alt="icone hoomy" />
                    </Link>
                </div>
                <div className='justify-center items-center m-6'>
                    <Link to={`/account/${userId}`}>
                    <RiAccountCircleFill size={32}/>
                    </Link>
                </div>
            </div>
        </div>
    </div>
    
  )
}

export default Topbar