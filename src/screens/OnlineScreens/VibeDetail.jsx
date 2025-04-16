import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom'
import selectVibeData from '../../store/vibe/vibeSelector';
import { fetchVibeDetail } from '../../store/vibe/vibeSlice';
import PageLoader from '../../components/Loader/PageLoader';
import VibeCard from '../../components/Card/VibeCard';
import { RiArrowLeftSFill } from 'react-icons/ri';

const VibeDetail = () => {
	const params = useParams();
	const { id } = params;

	const dispatch = useDispatch();

	const { loadingVibe, vibeDetail } = useSelector(selectVibeData);

	useEffect(() => {
		dispatch(fetchVibeDetail(id));
	}, [dispatch, id]);	

  return (
	loadingVibe ? <PageLoader /> :
	<div>
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
	</div>
  )
}

export default VibeDetail