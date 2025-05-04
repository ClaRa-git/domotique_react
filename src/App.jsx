import React from 'react'
import useAuthCheck from './hooks/useAuthCheck';
import { Outlet } from 'react-router-dom';
import Topbar from './components/Ui/Topbar';
import Footbar from './components/Ui/Footbar';
import { USER_INFOS } from './constants/appConstant';

const App = () => {

	// Récupération des informations de l'utilisateur depuis le localStorage
	const user = JSON.parse( localStorage.getItem( USER_INFOS ) );

	// Vérification que l'utilisateur en session est bien le bon
	useAuthCheck( user );

	return (
		<div className='relative flex flex-col h-screen'>
			<div className='flex-1 flex flex-col'>
				<Topbar />
					<div className='flex-1'>
						<Outlet />
					</div>
				<Footbar />
			</div>
		</div>
	)
}

export default App