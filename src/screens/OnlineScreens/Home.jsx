import React from 'react'
import { useAuthContext } from '../../contexts/AuthContext'
import MoodCard from '../../components/Card/MoodCard';
import MenuCard from '../../components/Card/MenuCard';

const Home = () => {
  const { userId, username } = useAuthContext();

  return (
    <div className='min-h-screen flex flex-col'>
      <div className='m-4 justify-start font-bold text-[50px]'>
        <p>Hello,</p>
        <p>{username}</p>
      </div>
      <div className='m-4 justify-center bg-primary rounded-lg p-4 text-white'>
        <MoodCard />
      </div>
      <div className='flex flex-col justify-center mt-4 p-4 bg-primary rounded-t-lg flex-grow'>
        <div className='grid grid-cols-2 gap-4 p-4 grow'>
          <MenuCard />
          <MenuCard />
          <MenuCard />
          <MenuCard />
        </div>
      </div>
    </div>
  )
}

export default Home
