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
import SongDropdown from '../../components/Ui/SongDropdown';

const PlaylistDetail = () => {

    const params = useParams();
    const { id } = params;

    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [availableSongs, setAvailableSongs] = useState([]);

    const { loading, playlist } = useSelector(selectUserData);

    const navigate = useNavigate();

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchPlaylist(id));
    }, [dispatch, id]);

    // Récupérer les chansons disponibles
    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const response = await axios.get(`${API_URL}/songs`);
                setAvailableSongs(response.data.member);
            } catch (error) {
                console.error('Erreur lors du chargement des chansons', error);
            }
        };

        fetchSongs();
    }, []);

    const imgPath = playlist?.songs?.length > 0 ?
    playlist?.songs[0]?.imagePath
    : 'song.jpg';
    
    const imgPlaylist = `${API_ROOT}/upload/images/songs/${imgPath}`;

    const songs = playlist?.songs;

    const handleDeleteSong = async (idSong) => {
        const confirm = window.confirm('Voulez-vous vraiment supprimer cette musique ?');

        if (!confirm) return;

        try {
            //on doit récupérer le tableau d'ids de la playlist
            // ['/api/songs/1', '/api/songs/2', '/api/songs/3']
            const songIds = playlist?.songs && playlist?.songs?.map(song => song['@id']);
            //on va enlever du tableau l'id recu en paramètre
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

    const handleAddSong = async (songId) => {
        try {
            const currentSongIds = playlist?.songs.map(song => song['@id']);
            const newSongId = `${songId}`;
            
            if (currentSongIds.includes(newSongId)) {
                alert("Cette chanson est déjà dans la playlist.");
                return;
            } else {
                // on ajoute le nouvel id de chanson à la playlist
                currentSongIds.push(newSongId);
            }
    
            axios.defaults.headers.patch['Content-Type'] = 'application/merge-patch+json';
            const response = await axios.patch(`${API_URL}/playlists/${playlist.id}`, {
                songs: currentSongIds
            });
    
            if (response.status === 200) {
                dispatch(fetchPlaylist(playlist.id));
                setIsVisible(false); // Fermer le menu
            }
        } catch (error) {
            console.error("Erreur lors de l'ajout de la chanson", error);
        }
    }

  return (
    loading ? <PageLoader /> :
    <div className='mb-16'>
        <div className='flex justify-between m-10'>
            <Link to='/playlist'>
                <RiArrowLeftSFill
                    size={30}
                    className='text-white bg-secondary-pink rounded-lg  h-10 w-10 cursor-pointer'
                />
            </Link>
            <div className='flex flex-col justify-center items-center mx-4'>
                <img src={imgPlaylist} alt="image song" className='rounded-lg mb-2 h-52 w-52'/>
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
        <SongDropdown
            isVisible={isVisible}
            toggleDropdown={() => setIsVisible(!isVisible)}
            songs={availableSongs}
            addSongToPlaylist={handleAddSong}
            playlistSongIds={playlist?.songs?.map(song => song['@id']) || []}
        />
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