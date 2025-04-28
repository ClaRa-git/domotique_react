import { createSelector } from "@reduxjs/toolkit";

const selectLoading = (state) => state.users.loading;
const selectUserDetail = (state) => state.users.userDetail;
const selectAllUsers = (state) => state.users.allUsers;
const selectUserPlaylists = (state) => state.users.userPlaylists;
const selectPlaylist = (state) => state.users.playlist;
const allAvatars = (state) => state.users.allAvatars;

const selectUserData = createSelector(
    [
        selectLoading,
        selectUserDetail,
        selectAllUsers,
        selectUserPlaylists,
        selectPlaylist,
        allAvatars,
    ],
    (
        loading,
        userDetail,
        allUsers,
        userPlaylists,
        playlist,
        allAvatars        
    ) => ({
        loading,
        userDetail,
        allUsers,
        userPlaylists,
        playlist,
        allAvatars,
    })
);

export default selectUserData;