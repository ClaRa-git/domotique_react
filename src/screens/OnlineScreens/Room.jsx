import React, { useEffect } from 'react'
import MenuBar from '../../components/Ui/MenuBar'
import { useDispatch, useSelector } from 'react-redux';
import PageLoader from '../../components/Loader/PageLoader';
import selectRoomData from '../../store/room/roomSelector';
import { fetchAllRooms } from '../../store/room/roomSlice';
import RoomCard from '../../components/Card/RoomCard';

const Room = () => {
    const dispatch = useDispatch();

    const { loadingRoom, allRooms } = useSelector(selectRoomData);

    useEffect(() => {
        dispatch(fetchAllRooms());
    }, [dispatch]);

  return (
    loadingRoom ? <PageLoader /> :
    <div>
        <MenuBar />
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 mb-16'>
            {allRooms && allRooms.map((room, index) => {
                return (
                    <div key={index} className='flex justify-center items-center'>
                        <RoomCard
                            room={room}
                        />
                    </div>
                )
            })}
        </div>
    </div>
  )
}

export default Room