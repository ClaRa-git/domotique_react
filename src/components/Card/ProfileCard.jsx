import React from 'react'
import { AVATAR_URL } from '../../constants/apiConstant';

const ProfileCard = ({data}) => {

    const imgAvatar = `${AVATAR_URL}/${data?.avatar?.imagePath}`;
    const username = data?.username;

  return (
    <div className="card text-white">
        <img src={imgAvatar} alt="Avatar" className="card-img-top max-h-48 max-w-48 rounded-full m-6 cursor-pointer border-2 border-white hover:border-4 hover:border-amber-600" />
        <div className="card-body">
            <h5 className="card-title text-center">{username}</h5>
        </div>
    </div>
  )
}

export default ProfileCard