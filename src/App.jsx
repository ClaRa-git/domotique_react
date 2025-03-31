import React from 'react'
import useAuthCheck from './hooks/useAuthCheck';
import { Outlet } from 'react-router-dom';

const App = () => {
  // récupération des informations de l'utilisateur depuis le localStorage
  const user = JSON.parse(localStorage.getItem('USER_INFOS'));

  // vérification que l'utilisateur en session est bien le bon
  useAuthCheck(user);

  return (
    <div>
      <Outlet />
    </div>
  )
}

export default App