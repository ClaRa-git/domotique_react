import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { fetchPlaylist } from '../../store/user/userSlice';
import selectUserData from '../../store/user/userSelector';
import { RiArrowLeftSFill } from 'react-icons/ri';
import { API_ROOT } from '../../constants/apiConstant';
import { FaPen, FaRegTrashAlt } from 'react-icons/fa';
import PageLoader from '../../components/Loader/PageLoader';
import SongCard from '../../components/Card/SongCard';

const PlaylistDetail = () => {

    const params = useParams();
    const { id } = params;

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchPlaylist(id));
    }, [dispatch, id]);

    const { loading, playlist } = useSelector(selectUserData);

    const imgPath = playlist?.songs?.length > 0 ?
    playlist?.songs[0]?.imagePath
    : 'song.jpg';
    
    const imgPlaylist = `${API_ROOT}/upload/images/songs/${imgPath}`;

    const songs = playlist?.songs;

  return (
    loading ? <PageLoader /> :
    <div>
        <div className='flex justify-between m-10'>
            <Link to='/playlist'>
                <RiArrowLeftSFill
                    size={30}
                    className='text-white bg-secondary-pink rounded-lg  h-10 w-10 '
                />
            </Link>
            <div className='flex flex-col justify-center items-center mx-4'>
                <img src={imgPlaylist} alt="image song" className='rounded-lg mb-2'/>
                <p className='font-bold'>{playlist.title}</p>
            </div>
            <div className='flex flex-col justify-start'>
                <FaRegTrashAlt size={30} className='bg-secondary-orange h-10 w-10 text-white rounded-lg p-2' />
                <FaPen size={30} className='mt-5 bg-secondary-orange h-10 w-10 text-white rounded-lg p-2' />
            </div>
        </div>
        {songs && songs.map((song, index) => (
            <SongCard
                key={index}
                song={song}
            />
        ))}
    </div>
  )
}

export default PlaylistDetail