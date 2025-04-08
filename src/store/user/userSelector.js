import { createSelector } from "@reduxjs/toolkit";

const selectLoading = (state) => state.users.loading;
const selectUserDetail = (state) => state.users.userDetail;
const selectAllUsers = (state) => state.users.allUsers;

const selectUserData = createSelector(
    [
        selectLoading,
        selectUserDetail,
        selectAllUsers
    ],
    (
        loading,
        userDetail,
        allUsers
    ) => ({
        loading,
        userDetail,
        allUsers
    })
);

export default selectUserData;