import React from 'react'
import useAuthCheck from './hooks/useAuthCheck';
import { Outlet } from 'react-router-dom';
import Topbar from './components/Ui/Topbar';
import Footbar from './components/Ui/Footbar';
import { USER_INFOS } from './constants/appConstant';

const App = () => {

	const user = JSON.parse( localStorage.getItem( USER_INFOS ) );
	useAuthCheck( user );

	return (
		<div className='flex flex-col h-screen overflow-hidden'>
			{/* Topbar fixe en haut — h-24 */}
			<Topbar />

			{/* Zone centrale scrollable — prend tout l'espace entre Topbar et Footbar */}
			<div className='flex-1 overflow-y-auto'>
				<Outlet />
			</div>

			{/* Footbar fixe en bas — h-20 */}
			<Footbar />
		</div>
	)
}

export default App