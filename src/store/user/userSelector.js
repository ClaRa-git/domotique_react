import { createSelector } from "@reduxjs/toolkit";

const selectLoading = (state) => state.users.loading;
const selectUserDetail = (state) => state.users.userDetail;
const selectAllUsers = (state) => state.users.allUsers;
const selectUserPlaylists = (state) => state.users.userPlaylists;

const selectUserData = createSelector(
    [
        selectLoading,
        selectUserDetail,
        selectAllUsers,
        selectUserPlaylists
    ],
    (
        loading,
        userDetail,
        allUsers,
        userPlaylists
    ) => ({
        loading,
        userDetail,
        allUsers,
        userPlaylists
    })
);

export default selectUserData;