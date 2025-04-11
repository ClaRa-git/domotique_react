import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { fetchPlaylist } from '../../store/user/userSlice';
import selectUserData from '../../store/user/userSelector';
import { RiArrowLeftSFill } from 'react-icons/ri';
import { API_ROOT, API_URL } from '../../constants/apiConstant';
import { FaPen, FaRegTrashAlt } from 'react-icons/fa';
import PageLoader from '../../components/Loader/PageLoader';
import SongCard from '../../components/Card/SongCard';
import axios from 'axios';

const PlaylistDetail = () => {

    const params = useParams();
    const { id } = params;

    const navigate = useNavigate();

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

    const handleDeleteSong = async (id) => {
        const confirm = window.confirm('Voulez-vous vraiment supprimer cette musique ?');

        if (!confirm) return;

        try {
            //on doit récupérer le tableau d'ids de la playlist
            // ['/api/songs/1', '/api/songs/2', '/api/songs/3']
            const songIds = playlist?.songs && playlist?.songs?.map(song => song['@id']);
            //on va enlever du tableau l'id recu en paramètre
            const idSong = `/api/songs/${id}`;
            const newSongIds = songIds.filter(songId => songId !== idSong);
            //on va mettre a jour la playlist dans la bdd
            axios.defaults.headers.patch['Content-Type'] = 'application/merge-patch+json';
            const response = await axios.patch(`${API_URL}/playlists/${playlist.id}`, {
                songs: newSongIds
        });

        if(response.status === 200){
            //on va mettre à jour le store
            dispatch(fetchPlaylist(playlist.id));
        }
        } catch (error) {
            console.log(`erreur lors de la suppression de la chanson ${id}`, error);
        }
    }

    const handleDeletePlaylist = async () => {
        const confirm = window.confirm('Voulez-vous vraiment supprimer cette playlist ?');

        if (!confirm) return;

        try {
            const response = await axios.delete(`${API_URL}/playlists/${playlist.id}`);

            if(response.status === 204){
                //on va rediriger vers la page des playlists
                navigate('/playlist');
            }
        } catch (error) {
            console.log(`erreur lors de la suppression de la playlist ${playlist.id}`, error);
        }
    }

  return (
    loading ? <PageLoader /> :
    <div>
        <div className='flex justify-between m-10'>
            <Link to='/playlist'>
                <RiArrowLeftSFill
                    size={30}
                    className='text-white bg-secondary-pink rounded-lg  h-10 w-10 cursor-pointer'
                />
            </Link>
            <div className='flex flex-col justify-center items-center mx-4'>
                <img src={imgPlaylist} alt="image song" className='rounded-lg mb-2'/>
                <p className='font-bold'>{playlist.title}</p>
            </div>
            <div className='flex flex-col justify-start'>
                <FaRegTrashAlt
                    size={30}
                    className='bg-secondary-orange h-10 w-10 text-white rounded-lg p-2 cursor-pointer'
                    onClick={handleDeletePlaylist}
                />
                <FaPen size={30} className='mt-5 bg-secondary-orange h-10 w-10 text-white rounded-lg p-2 cursor-pointer' />
            </div>
        </div>
        {songs && songs.map((song, index) => (
            <SongCard
                key={index}
                song={song}
                sentToParent={handleDeleteSong}
            />
        ))}
    </div>
  )
}

export default PlaylistDetail