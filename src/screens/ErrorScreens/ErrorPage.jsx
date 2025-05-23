import React from 'react'
import { FaExclamationTriangle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'

// Le composant ErrorPage permet d'afficher une page d'erreur 404
const ErrorPage = () => {

	// Utilisation de useNavigate pour la redirection
    const navigate = useNavigate();

	// Fonction pour rediriger vers la page d'accueil
    const handleRedirect = () => {
        navigate('/');
    }

	return (
		<div className='flex flex-col items-center justify-center min-h-screen' >
			<FaExclamationTriangle className='text-red-500 text-6xl mb-4' />
			<h1 className='text-4xl font-bold mb-4' >
				Page non trouvée
			</h1>
			<p className='text-lg mb-6' >
				La page que vous recherchez n'existe pas
			</p>
			<button
				className='px-4 py-2 rounded-lg'
				onClick={ () => handleRedirect() }
			>
				Retour à l'accueil
			</button>
		</div>
	)
}

export default ErrorPage