import React, { useEffect, useState } from 'react'
import ProfileCard from '../../components/Card/ProfileCard';
import PopupAccount from '../../components/Popup/PopupAccount';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers } from '../../store/user/userSlice';
import selectUserData from '../../store/user/userSelector';
import PageLoader from '../../components/Loader/PageLoader';

const Login = () => {

  // définition des states
  const [isVisible, setIsVisible] = useState(false);

  const [user, setUser] = useState(null);

  const dispatch = useDispatch();

  // récupération de tous les utilisateurs
  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch])

  const { allUsers, loading } = useSelector(selectUserData);

  const handleClick = (user) => {
    setIsVisible(true);
    setUser(user);
  }

  return (
    loading ? <PageLoader /> :
      <div className="flex flex-col h-screen items-center justify-center px-6 py-10 bg-primary">
        <h1 className='text-white text-5xl text-center'>Connectez-vous !</h1>
        <div className='flex flex-wrap justify-center'>
          {allUsers && allUsers.map((user, index) => (
          <div key={index} onClick={() => handleClick(user) } className="m-4 cursor-pointer border-2 border-white rounded-2xl">
            <ProfileCard data={user}/>
          </div>
          ))}
        </div>
        {isVisible &&
          <PopupAccount
            data={user}
            callable={() => setIsVisible(false) }
          />
        }
      </div>
  )
}

export default Login