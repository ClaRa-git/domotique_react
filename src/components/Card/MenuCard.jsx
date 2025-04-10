import React from 'react'
import { MdArrowForwardIos } from 'react-icons/md'
import { Link } from 'react-router-dom'

const MenuCard = ({icon, label, link}) => {
  return (
    <div className='p-4 rounded-lg bg-white text-primary w-full h-full shadow-[0_0_5px_3px_rgba(254,254,254,0.1)] shadow-offwhite m'>
        <div className='flex flex-col items-start justify-between h-full'>
            <div className='rounded-full p-4 text-secondary-orange'>
                {icon}
            </div>
            <div className='flex flex-row w-full justify-between items-center'>
                <p className='text-center text-xl font-bold'>{label}</p>
                <Link to={link}>
                    <div className='p-2 rounded-full px-4 flex items-center justify-center'>
                    <MdArrowForwardIos size={24} />
                    </div>
                </Link>
            </div>
        </div>
    </div>
  )
}

export default MenuCard