import { createSelector } from "@reduxjs/toolkit";

const selectLoadingPlanning = (state) => state.plannings.loadingPlanning;
const selectPlanningDetail = (state) => state.plannings.planningDetail;
const selectAllPlannings = (state) => state.plannings.allPlannings;

const selectPlanningData = createSelector(
    [
        selectLoadingPlanning,
        selectPlanningDetail,
        selectAllPlannings
    ],
    (
        loadingPlanning,
        planningDetail,
        allPlannings
    ) => ({
        loadingPlanning,
        planningDetail,
        allPlannings
    })
);

export default selectPlanningData;