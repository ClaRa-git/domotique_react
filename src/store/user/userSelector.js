import { createSelector } from "@reduxjs/toolkit";

const selectLoading = (state) => state.user.loading;
const selectUserDetail = (state) => state.user.userDetail;

const selectUserData = createSelector(
    [
        selectLoading,
        selectUserDetail,
    ],
    (
        loading,
        userDetail
    ) => ({
        loading,
        userDetail
    })
);

export default selectUserData;