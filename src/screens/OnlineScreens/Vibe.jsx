import React, { useEffect } from 'react'
import MenuBar from '../../components/Ui/MenuBar'
import { useDispatch, useSelector } from 'react-redux';
import selectVibeData from '../../store/vibe/vibeSelector';
import { fetchAllVibesForUser } from '../../store/vibe/vibeSlice';
import PageLoader from '../../components/Loader/PageLoader';
import VibeCard from '../../components/Card/VibeCard';
import { FaPlus } from 'react-icons/fa';

const Vibe = () => {
    const dispatch = useDispatch();

    const { loadingVibe, allVibesForUser } = useSelector(selectVibeData);

    useEffect(() => {
        dispatch(fetchAllVibesForUser());
    }, [dispatch]);

    const handleClick = () => {
    }

  return (
    loadingVibe ? <PageLoader /> :
    <div>
        <MenuBar />
        <div onClick={handleClick} className='flex flex-row justify-between bg-primary text-white m-4 px-4 py-1 rounded-lg'>
            <p>Créer une nouvelle vibe...</p>
            <FaPlus className='mt-1'/>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 mb-16'>
            {allVibesForUser && allVibesForUser.map((vibe, index) => {
                return (
                    <div key={index} className='flex justify-center items-center'>
                        <VibeCard
                            vibe={vibe}
                        />
                    </div>
                )
            })}
        </div>
    </div>
  )
}

export default Vibe