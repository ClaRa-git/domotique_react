import { createSelector } from "@reduxjs/toolkit";

const selectLoadingVibe = (state) => state.vibes.loadingVibe;
const selectVibeDetail = (state) => state.vibes.vibeDetail;
const selectAllVibesForUser = (state) => state.vibes.allVibesForUser;
const selectAllIcons = (state) => state.vibes.allIcons;
const selectSettingsForVibe = (state) => state.vibes.settingsForVibe;
const selectPlanningsForVibe = (state) => state.vibes.planningsForVibe;

const selectVibeData = createSelector(
    [
        selectLoadingVibe,
        selectVibeDetail,
        selectAllVibesForUser,
        selectAllIcons,
        selectSettingsForVibe,
        selectPlanningsForVibe
    ],
    (
        loadingVibe,
        vibeDetail,
        allVibesForUser,
        allIcons,
        settingsForVibe,
        planningsForVibe
    ) => ({
        loadingVibe,
        vibeDetail,
        allVibesForUser,
        allIcons,
        settingsForVibe,
        planningsForVibe    
    })
);
export default selectVibeData;