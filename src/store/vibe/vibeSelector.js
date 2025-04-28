import { createSelector } from "@reduxjs/toolkit";

const selectLoadingVibe = (state) => state.vibes.loadingVibe;
const selectVibeDetail = (state) => state.vibes.vibeDetail;
const selectAllVibesForUser = (state) => state.vibes.allVibesForUser;
const selectAllIcons = (state) => state.vibes.allIcons;

const selectVibeData = createSelector(
    [
        selectLoadingVibe,
        selectVibeDetail,
        selectAllVibesForUser,
        selectAllIcons
    ],
    (
        loadingVibe,
        vibeDetail,
        allVibesForUser,
        allIcons
    ) => ({
        loadingVibe,
        vibeDetail,
        allVibesForUser,
        allIcons
    })
);
export default selectVibeData;