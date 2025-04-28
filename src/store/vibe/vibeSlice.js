import { createSlice } from "@reduxjs/toolkit";
import axios, { all } from "axios";
import { API_URL } from "../../constants/apiConstant";

const vibeSlice = createSlice({
    name: "vibes",
    initialState: {
        loadingVibe: false,
        vibeDetail: {},
        allVibesForUser: [],
    },
    reducers: {
        setLoadingVibe: (state, action) => {
            state.loadingVibe = action.payload;
        },
        setVibeDetail: (state, action) => {
            state.vibeDetail = action.payload;
        },
        setAllVibesForUser: (state, action) => {
            state.allVibesForUser = action.payload;
        },
    }
});

export const { setLoadingVibe, setVibeDetail, setAllVibesForUser } = vibeSlice.actions;

export const fetchAllVibesForUser = (userId) => async (dispatch) => {
    try {
        dispatch(setLoadingVibe(true));
        const response = await axios.get(`${API_URL}/vibes?page=1&profile.id=${userId}`);
        console.log(response.data);
        dispatch(setAllVibesForUser(response.data.member));
    } catch (error) {
        console.log(`Erreur lors de la récupération des détails de la pièce : ${error}`);
    } finally {
        dispatch(setLoadingVibe(false));
    }
}

export const fetchVibeDetail = (vibeId) => async (dispatch) => {
    try {
        dispatch(setLoadingVibe(true));    
        const response = await axios.get(`${API_URL}/vibes/${vibeId}`);
        dispatch(setVibeDetail(response.data));
    } catch (error) {
        console.log(`Erreur lors de la récupération des détails de la pièce : ${error}`);
    } finally {
        dispatch(setLoadingVibe(false));
    }
}

export default vibeSlice.reducer;