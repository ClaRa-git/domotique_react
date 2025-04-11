import React, { useState } from 'react'
import { useAuthContext } from '../../contexts/AuthContext'
import MoodCard from '../../components/Card/MoodCard';
import MenuCard from '../../components/Card/MenuCard';
import { LuMusic4 } from 'react-icons/lu';
import { TbBulbFilled } from 'react-icons/tb';
import { FaBed, FaRegCalendarCheck } from 'react-icons/fa';
import PopupMood from '../../components/Popup/PopupMood';
import MoodPie from '../../components/Mood/MoodPie';
import HelloUser from '../../components/Ui/HelloUser';

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
      <HelloUser username={username} />
      <div onClick={handleClick} className='flex flex-row m-4 justify-around bg-primary rounded-lg p-4 text-white'>
        <div className='flex flex-col justify-center align-around'>
          <p className='mb-5 text-center'>Votre mood actuelle :</p>
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
        <div className='grid grid-cols-2 gap-5 p-5 grow place-content-center'>
          <MenuCard
            icon={
              <LuMusic4
                className='h-8 w-8 sm:h-12 sm:w-12'
              />
            }
            label={"Playlists"}
            link={"/playlist"}
          />
          <MenuCard
            icon={
              <FaBed
                className='h-8 w-8 sm:h-12 sm:w-12'  
              />
            }
            label={"Pièces"}
            link={"/room"}
          />
          <MenuCard
            icon={
              <FaRegCalendarCheck
                className='h-8 w-8 sm:h-12 sm:w-12'
              />
            }
            label={"Planning"}
            link={"/planning"}
          />
          <MenuCard
            icon={
              <TbBulbFilled
                className='h-8 w-8 sm:h-12 sm:w-12'
              />
            }
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
