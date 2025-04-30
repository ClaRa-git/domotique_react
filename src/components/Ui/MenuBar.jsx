import React from 'react'
import { Link } from 'react-router-dom';

// Le composant MenuBar permet d'afficher le menu de navigation de l'application
const MenuBar = () => {
    // On récupère le chemin de la page
    const location = window.location.pathname;
    
  return (
    <div className='flex justify-around my-4 items-center flex-row' >
        <Link to="/playlist" >
            <div className={ `${
                location === '/playlist' ?
                'bg-secondary-pink text-white font-normal rounded-lg'
                :
                ''
                } py-1 px-2 ` }
            >
                Playlists
            </div>
        </Link>
        <Link to="/room" >
            <div className={ `${
                location === '/room' ?
                'bg-secondary-pink text-white font-normal rounded-lg'
                :
                ''
                } py-1 px-2 ` }
            >
                Pièces
            </div>
        </Link>
        <Link to="/vibe" >
            <div className={ `${
                location === '/vibe' ?
                'bg-secondary-pink text-white font-normal rounded-lg'
                :
                ''
                } py-1 px-2 ` }
            >
                Ambiances
            </div>
        </Link>
        <Link to="/planning" >
            <div className={ `${
                location === '/planning' ?
                'bg-secondary-pink text-white font-normal rounded-lg'
                :
                ''
                } py-1 px-2 ` }
            >
                Planning
            </div>
        </Link>
    </div>
  )
}

export default MenuBar