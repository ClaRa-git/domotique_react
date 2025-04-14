import { createSelector } from "@reduxjs/toolkit";

const selectLoadingRoom = (state) => state.rooms.loadingRoom;
const selectRoomDetail = (state) => state.rooms.roomDetail;
const selectAllRooms = (state) => state.rooms.allRooms;

const selectRoomData = createSelector(
    [
        selectLoadingRoom,
        selectRoomDetail,
        selectAllRooms
    ],
    (
        loadingRoom,
        roomDetail,
        allRooms
    ) => ({
        loadingRoom,
        roomDetail,
        allRooms
    })
);

export default selectRoomData;