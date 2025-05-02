import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../constants/apiConstant";

const songSlice = createSlice({
    name: "songs",
    initialState: {
        loadingSong: false,
        songDetail: {},
        allSongs: [],
    },
    reducers: {
        setLoadingSong: (state, action) => {
            state.loadingSong = action.payload;
        },
        setSongDetail: (state, action) => {
            state.songDetail = action.payload;
        },
        setAllSongs: (state, action) => {
            state.allSongs = action.payload;
        },
    }
});

export const { setLoadingSong, setSongDetail, setAllSongs } = songSlice.actions;

export const fetchAllSongs = () => async (dispatch) => {
    try {
        dispatch(setLoadingSong(true));
        const response = await axios.get(`${API_URL}/songs`);
        dispatch(setAllSongs(response.data.member));
    } catch (error) {
        console.log(`Erreur lors de la récupération des détails de la chanson : ${error}`);
    } finally {
        dispatch(setLoadingSong(false));
    }
}

export const fetchSongDetail = (songId) => async (dispatch) => {
    try {
        dispatch(setLoadingSong(true));
        const response = await axios.get(`${API_URL}/songs/${songId}`);
        dispatch(setSongDetail(response.data));
    } catch (error) {
        console.log(`Erreur lors de la récupération des détails de la chanson : ${error}`);
    } finally {
        dispatch(setLoadingSong(false));
    }
}

export default songSlice.reducer;