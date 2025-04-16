import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom'
import selectVibeData from '../../store/vibe/vibeSelector';
import { fetchVibeDetail } from '../../store/vibe/vibeSlice';
import PageLoader from '../../components/Loader/PageLoader';
import VibeCard from '../../components/Card/VibeCard';
import { RiArrowLeftSFill } from 'react-icons/ri';
import { fetchAllRooms } from '../../store/room/roomSlice';
import selectRoomData from '../../store/room/roomSelector';
import axios from 'axios';
import { API_ROOT } from '../../constants/apiConstant';
import DeviceListVibe from '../../components/Ui/DeviceListVibe';

const VibeDetail = () => {
	const params = useParams();
	const { id } = params;

	const [dataDeviceVibe, setDataDeviceVibe] = useState(null);
	const [showDevices, setShowDevices] = useState(true);

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(fetchVibeDetail(id));
	}, [dispatch, id]);	
	
	const { loadingVibe, vibeDetail } = useSelector(selectVibeData);

	useEffect(() => {
	  dispatch(fetchAllRooms());
	}, [dispatch]);
	
	const { loadingRoom, allRooms } = useSelector(selectRoomData);

	const toggleView = () => {
        setShowDevices(!showDevices);
        setOpenMenuId(null); // Ferme tout en changeant de vue
    };

  return (
	loadingVibe ? <PageLoader /> :
	<div className='flex flex-col items-center justify-center mb-4'>
		<div className='flex w-full p-4 mb-4'>
			<Link to='/vibe'>
				<RiArrowLeftSFill
					size={30}
					className='text-white bg-secondary-pink rounded-lg  h-10 w-10 cursor-pointer'
				/>
			</Link>                
			<div className='flex flex-col items-center mb-4 mr-10 w-full'>
				<VibeCard vibe={vibeDetail} />
			</div>
         </div>
		 <div className='flex flex-col p-4 w-full'>
			{
				allRooms.length > 0 ? (
					allRooms.map((room, index) => (
						<div className='flex flex-col items-center' key={index}>
							<div className='flex flex-col w-full justify-center items-center font-bold bg-primary text-xl text-white text-center p-2 rounded-lg mb-4' >
								<div className='flex justify-center items-center'>
									<p className='text-xl'>{room.label}</p>
								</div>				
							</div>
								<div className='flex flex-col items-center w-full'>
									<DeviceListVibe room={room} />
								</div>
						</div>
					))
				) : (
					<p className='text-sm'>Aucune pièce disponible</p>
				)
			}
		 </div>
	</div>
  )
}

export default VibeDetail