import React, { useEffect } from 'react'
import MenuBar from '../../components/Ui/MenuBar'
import { useDispatch, useSelector } from 'react-redux';
import selectVibeData from '../../store/vibe/vibeSelector';
import { fetchAllVibesForUser } from '../../store/vibe/vibeSlice';
import PageLoader from '../../components/Loader/PageLoader';
import VibeCard from '../../components/Card/VibeCard';
import { FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';

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
        <div className='grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 mb-16'>
            { allVibesForUser && allVibesForUser.map((vibe, index) => (
                <Link to={`/vibe/${vibe.id}`} key={index}>
                    <div className='flex flex-col justify-center items-center'>
                        <VibeCard vibe={vibe} />
                    </div>
                </Link>
            ))}
        </div>
    </div>
  )
}

export default Vibe