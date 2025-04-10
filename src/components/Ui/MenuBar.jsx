import React from 'react'
import { Link } from 'react-router-dom';

const MenuBar = () => {
    // on récupère le chemin de la page
    const location = window.location.pathname;
    
  return (
    <div className='flex flex-row justify-around font-bold my-4'>
        <Link
            to="/playlist">
            <div className={`${location === '/playlist' ? 'bg-secondary-pink text-white py-1 px-4 font-normal rounded-lg' : ''}`}>Playlists</div>
        </Link>
        <Link
            to="/room">
            <div className={`${location === '/room' ? 'bg-secondary-pink text-white py-1 px-4 font-normal rounded-lg' : ''}`}>Pièces</div>
        </Link>
        <Link
            to="/vibe">
            <div className={`${location === '/vibe' ? 'bg-secondary-pink text-white py-1 px-4 font-normal rounded-lg' : ''}`}>Ambiances</div>
        </Link>
        <Link
            to="/planning">
            <div className={`${location === '/planning' ? 'bg-secondary-pink text-white py-1 px-4 font-normal rounded-lg' : ''}`}>Planning</div>
        </Link>
    </div>
  )
}

export default MenuBar