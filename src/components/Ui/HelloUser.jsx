import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useAuthContext } from '../../contexts/AuthContext';
import { fetchUserDetail } from '../../store/user/userSlice';
import selectUserData from '../../store/user/userSelector';
import PageLoader from '../Loader/PageLoader';

const HelloUser = ( { username } ) => {
	
	return (
		<div className='m-4 justify-start font-bold text-[50px]' >
			<p>
				Hello,
			</p>
			<p>
				{ username }
			</p>
		</div>
	)
}

export default HelloUser