import React from 'react'
import { API_ROOT } from '../../constants/apiConstant';
import { Link } from 'react-router-dom';

const PlaylistCard = ({playlist}) => {

  const imgPath = playlist?.songs?.length > 0
  ? playlist?.songs[0]?.imagePath
  : 'song.jpg';

  const imgPlaylist = `${API_ROOT}/upload/images/songs/${imgPath}`;

  return (
    <Link to={`/playlist/${playlist.id}`}>
      <div className='flex flex-row justify-between m-4'>
          <div className='flex flex-col justify-center items-center'>
              <img src={imgPlaylist} alt={`Playlist ${playlist.title}`} className='w-48 h-48 rounded-lg mb-2' />
              <p className='font-bold'>{playlist.title}</p>
          </div>
      </div>
    </Link>
  )
}

export default PlaylistCard