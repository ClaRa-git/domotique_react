import { createSelector } from "@reduxjs/toolkit";

const selectLoading = (state) => state.users.loading;
const selectUserDetail = (state) => state.users.userDetail;
const selectAllUsers = (state) => state.users.allUsers;
const selectUserPlaylists = (state) => state.users.userPlaylists;
const selectPlaylist = (state) => state.users.playlist;

const selectUserData = createSelector(
    [
        selectLoading,
        selectUserDetail,
        selectAllUsers,
        selectUserPlaylists,
        selectPlaylist
    ],
    (
        loading,
        userDetail,
        allUsers,
        userPlaylists,
        playlist
    ) => ({
        loading,
        userDetail,
        allUsers,
        userPlaylists,
        playlist
    })
);

export default selectUserData;