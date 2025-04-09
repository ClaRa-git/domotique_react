import React from 'react'
import useAuthCheck from './hooks/useAuthCheck';
import { Outlet } from 'react-router-dom';
import Topbar from './components/Ui/Topbar';

const App = () => {
  // récupération des informations de l'utilisateur depuis le localStorage
  const user = JSON.parse(localStorage.getItem('USER_INFOS'));

  // vérification que l'utilisateur en session est bien le bon
  useAuthCheck(user);

  return (
    <div className='relative flex'>
    <div className='flex-1 flex flex-col'>
      <Topbar />
      <div className='flex-1 h-fit pb-40 text-white'>
        <Outlet />
      </div>
    </div>
  </div>
  )
}

export default App