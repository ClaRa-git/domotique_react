import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { fetchPlaylist } from '../../store/user/userSlice';
import selectUserData from '../../store/user/userSelector';
import { RiArrowLeftSFill } from 'react-icons/ri';
import { API_ROOT } from '../../constants/apiConstant';
import { FaPen, FaRegTrashAlt } from 'react-icons/fa';
import PageLoader from '../../components/Loader/PageLoader';

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
        {songs && songs.map((song, index) => {
            const imgPath = song.imagePath
            ? song.imagePath
            : 'song.jpg';

            const imgSong = `${API_ROOT}/upload/images/songs/${imgPath}`;

            return (
                <div key={index} className='flex flex-row justify-between text-white items-center mx-10 my-2 bg-primary rounded-lg p-2'>
                    <div className='flex justify-center items-center'>
                        <img src={imgSong} alt="image song" className='rounded-lg mb-2 h-20 m-4'/>
                        <div>
                            <p className='font-bold'>{song.title}</p>
                            <p className='text-sm'>{song.artist}</p>
                        </div>
                    </div>
                    <FaRegTrashAlt size={30} className='bg-secondary-orange h-10 w-10 text-white rounded-lg p-2 mr-2' />
                </div>
            )
        })}
    </div>
  )
}

export default PlaylistDetail