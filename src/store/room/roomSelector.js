import { createSelector } from "@reduxjs/toolkit";

const selectLoadingRoom = (state) => state.rooms.loadingRoom;
const selectRoomDetail = (state) => state.rooms.roomDetail;
const selectAllRooms = (state) => state.rooms.allRooms;
const selectRoomsAvailable = (state) => state.rooms.roomsAvailable;
const selectRoomsUnavailable = (state) => state.rooms.roomsUnavailable;

const selectRoomData = createSelector(
    [
        selectLoadingRoom,
        selectRoomDetail,
        selectAllRooms,
        selectRoomsAvailable,
        selectRoomsUnavailable
    ],
    (
        loadingRoom,
        roomDetail,
        allRooms,
        roomsAvailable,
        roomsUnavailable
    ) => ({
        loadingRoom,
        roomDetail,
        allRooms,
        roomsAvailable,
        roomsUnavailable
    })
);

export default selectRoomData;