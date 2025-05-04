import { createSlice } from "@reduxjs/toolkit";
import axios, { all } from "axios";
import { API_URL } from "../../constants/apiConstant";

const vibeSlice = createSlice({
    name: "vibes",
    initialState: {
        loadingVibe: false,
        vibeDetail: {},
        allVibesPlaying: [],
        allVibesForUser: [],
        allIcons: [],
        settingsForVibe: [],
        planningsForVibe: []
    },
    reducers: {
        setLoadingVibe: (state, action) => {
            state.loadingVibe = action.payload;
        },
        setVibeDetail: (state, action) => {
            state.vibeDetail = action.payload;
        },
        setAllVibesPlaying: (state, action) => {
            state.allVibesPlaying = action.payload;
        },
        setAllVibesForUser: (state, action) => {
            state.allVibesForUser = action.payload;
        },
        setAllIcons: (state, action) => {
            state.allIcons = action.payload;
        },
        setSettingsForVibe: (state, action) => {
            state.settingsForVibe = action.payload;
        },
        setPlanningsForVibe: (state, action) => {
            state.planningsForVibe = action.payload;
        }
    }
});

export const { setLoadingVibe, setVibeDetail, setAllVibesPlaying, setAllVibesForUser, setAllIcons, setSettingsForVibe, setPlanningsForVibe } = vibeSlice.actions;

export const fetchAllVibesForUser = (userId) => async (dispatch) => {
    try {
        dispatch(setLoadingVibe(true));
        const response = await axios.get(`${API_URL}/vibes?page=1&profile.id=${userId}`);
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

export const fetchAllVibesPlaying = () => async (dispatch) => {
    try {
        dispatch(setLoadingVibe(true));
        const response = await axios.get(`${API_URL}/vibe_playings`);
        dispatch(setAllVibesPlaying(response.data.member));
    } catch (error) {
        console.log(`Erreur lors de la récupération de toutes les pièces : ${error}`);
    } finally {
        dispatch(setLoadingVibe(false));
    }
}

export const fetchSettingsForVibe = (vibeId) => async (dispatch) => {
    try {
        dispatch(setLoadingVibe(true));
        const response = await axios.get(`${API_URL}/settings?page=1&vibe.id=${vibeId}`);
        dispatch(setSettingsForVibe(response.data.member));
    } catch (error) {
        console.log(`Erreur lors de la récupération des paramètres de la pièce : ${error}`);
    } finally {
        dispatch(setLoadingVibe(false));
    }
}

export const fetchPlanningsForVibe = (vibeId) => async (dispatch) => {
    try {
        dispatch(setLoadingVibe(true));
        const response = await axios.get(`${API_URL}/plannings?page=1&vibe.id=${vibeId}`);
        dispatch(setPlanningsForVibe(response.data.member));
    } catch (error) {
        console.log(`Erreur lors de la récupération des plannings de la pièce : ${error}`);
    } finally {
        dispatch(setLoadingVibe(false));
    }
}

export default vibeSlice.reducer;