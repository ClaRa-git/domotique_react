import { createSelector } from "@reduxjs/toolkit";

const selectLoadingIcon = (state) => state.icons.loadingIcon;
const selectAllIcons = (state) => state.icons.allIcons;

const selectIconData = createSelector(
    [
        selectLoadingIcon,
        selectAllIcons
    ],
    (
        loadingIcon,
        allIcons
    ) => ({
        loadingIcon,
        allIcons
    })
);

export default selectIconData;