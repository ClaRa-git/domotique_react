import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../constants/apiConstant";

const planningSlice = createSlice({
    name: "plannings",
    initialState: {
        loadingPlanning: true,
        planningDetail: {},
        allPlannings: []
    },
    reducers: {
        setLoadingPlanning: (state, action) => {
            state.loadingPlanning = action.payload;
        },
        setPlanningDetail: (state, action) => {
            state.planningDetail = action.payload;
        },
        setAllPlannings: (state, action) => {
            state.allPlannings = action.payload;
        }
    }
});

export const { setLoadingPlanning, setPlanningDetail, setAllPlannings } = planningSlice.actions;

export const fetchAllPlanningsForUser = (userId) => async (dispatch) => {
    try {
        dispatch(setLoadingPlanning(true));
        const response = await axios.get(`${API_URL}/plannings?page=1&profile.id=${userId}`);
        dispatch(setAllPlannings(response.data.member));
    } catch (error) {
        console.log(`Erreur lors de la récupération des plannings : ${error}`);
    } finally {
        dispatch(setLoadingPlanning(false));
    }
}

export const fetchPlanningDetail = (planningId) => async (dispatch) => { 
    try {
        dispatch(setLoadingPlanning(true));
        const response = await axios.get(`${API_URL}/plannings/${planningId}`);
        dispatch(setPlanningDetail(response.data));
    } catch (error) {
        console.log(`Erreur lors de la récupération du planning : ${error}`);
    } finally {
        dispatch(setLoadingPlanning(false));
    }
}

export default planningSlice.reducer;