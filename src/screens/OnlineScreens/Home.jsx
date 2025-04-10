import React, { useState } from 'react'
import { useAuthContext } from '../../contexts/AuthContext'
import MoodCard from '../../components/Card/MoodCard';
import MenuCard from '../../components/Card/MenuCard';
import { LuMusic4 } from 'react-icons/lu';
import { TbBulbFilled } from 'react-icons/tb';
import { FaBed, FaRegCalendarCheck } from 'react-icons/fa';
import PopupMood from '../../components/Popup/PopupMood';
import MoodPie from '../../components/Mood/MoodPie';

const Home = () => {
  const { userId, username } = useAuthContext();

  const [isVisible, setIsVisible] = useState(false);
  const [moral, setMoral] = useState('Pas d\'humeur renseignée');
  const [stress, setStress] = useState(50);
  const [tonus, setTonus] = useState(50);
  const [mood, setMood] = useState(50);

  const handleClick = () => {
    setIsVisible(true);
  }

  const handleDataFromMood = (data) => {
    setMoral(data.calculatedMoral);
    setMood(data.mood);
    setTonus(data.tonus);
    setStress(data.stress);
  }

  return (
    <div className='min-h-screen flex flex-col'>
      <div className='m-4 justify-start font-bold text-[50px]'>
        <p>Hello,</p>
        <p>{username}</p>
      </div>
      <div onClick={handleClick} className='flex flex-row m-4 justify-around bg-primary rounded-lg p-4 text-white'>
        <div className='flex flex-col justify-center align-around'>
          <p className='mb-5'>Votre mood actuelle :</p>
          <MoodCard
            moral={moral}
          />
        </div>
        <MoodPie
          mood={mood}
          stress={stress}
          tonus={tonus}
        />
      </div>
      <div className='flex flex-col justify-center my-4 p-4 bg-primary rounded-t-lg flex-grow'>
        <div className='grid grid-cols-2 gap-10 p-5 grow mb-4'>
          <MenuCard
            icon={<LuMusic4 size={50} />}
            label={"Playlists"}
            link={"/playlist"}
          />
          <MenuCard
            icon={<FaBed size={50} />}
            label={"Pièces"}
            link={"/room"}
          />
          <MenuCard
            icon={<FaRegCalendarCheck size={50} />}
            label={"Planning"}
            link={"/planning"}
          />
          <MenuCard
            icon={<TbBulbFilled size={50} />}
            label={"Ambiances"}
            link={"/vibe"}
          />
        </div>
      </div>
      {isVisible &&
        <PopupMood
          data={{ mood, stress, tonus }}
          callable={() => setIsVisible(false)}
          sentToParent={handleDataFromMood}
        />
      }
    </div>
  )
}

export default Home
