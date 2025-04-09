import React, { useState } from 'react'
import { useAuthContext } from '../../contexts/AuthContext'
import MoodCard from '../../components/Card/MoodCard';
import MenuCard from '../../components/Card/MenuCard';
import { LuMusic4 } from 'react-icons/lu';
import { TbBulbFilled } from 'react-icons/tb';
import { FaBed, FaRegCalendarCheck } from 'react-icons/fa';
import PopupMood from '../../components/Ui/PopupMood';

const Home = () => {
  const { userId, username } = useAuthContext();

  const [isVisible, setIsVisible] = useState(false);

  const handleClick = () => {
	setIsVisible(true);
  }

  return (
    <div className='min-h-screen flex flex-col'>
      <div className='m-4 justify-start font-bold text-[50px]'>
        <p>Hello,</p>
        <p>{username}</p>
      </div>
      <div onClick={handleClick} className='m-4 justify-center bg-primary rounded-lg p-4 text-white'>
        <MoodCard />
      </div>
      <div className='flex flex-col justify-center my-4 p-4 bg-primary rounded-t-lg flex-grow'>
        <div className='grid grid-cols-2 gap-10 p-5 grow'>
          <MenuCard
            icon={<LuMusic4 size={50} />}
            label={"Playlist"}
			link={"/"}
          />
          <MenuCard 
            icon={<FaBed size={50} />}
            label={"Pièces"}
			link={"/"}
          />
          <MenuCard 
            icon={<FaRegCalendarCheck size={50} />}
            label={"Planning"}
			link={"/"}
          />
          <MenuCard 
            icon={<TbBulbFilled size={50} />}
            label={"Ambiances"}
			link={"/"}
          />
        </div>
      </div>
	  {isVisible &&
	  	<PopupMood 
			callable={() => setIsVisible(false)}
		/>
	  }
    </div>
  )
}

export default Home
