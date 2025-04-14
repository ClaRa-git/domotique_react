import { createSelector } from "@reduxjs/toolkit";

const selectLoadingVibe = (state) => state.vibes.loadingVibe;
const selectVibeDetail = (state) => state.vibes.vibeDetail;
const selectAllVibesForUser = (state) => state.vibes.allVibesForUser;

const selectVibeData = createSelector(
    [
        selectLoadingVibe,
        selectVibeDetail,
        selectAllVibesForUser
    ],
    (
        loadingVibe,
        vibeDetail,
        allVibesForUser
    ) => ({
        loadingVibe,
        vibeDetail,
        allVibesForUser
    })
);
export default selectVibeData;