import { createSlice } from "@reduxjs/toolkit";
import axios, { all } from "axios";
import { API_URL } from "../../constants/apiConstant";

const userSlice = createSlice({
    name: "users",
    initialState: {
        loading: false,
        userDetail: {},
        allUsers: [],
        userPlaylists: [],
        playlist: {},
        allAvatars: [],
    },
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setUserDetail: (state, action) => {
            state.userDetail = action.payload;
        },
        setAllUsers: (state, action) => {
            state.allUsers = action.payload;
        },
        setUserPlaylists: (state, action) => {
            state.userPlaylists = action.payload;
        },
        setPlaylist: (state, action) => {
            state.playlist = action.payload;
        },
        setAllAvatars: (state, action) => {
            state.allAvatars = action.payload;
        },
    }
});

export const { setLoading, setUserDetail, setAllUsers, setUserPlaylists, setPlaylist, setAllAvatars } = userSlice.actions;

// méthodes du slice
export const fetchAllUsers = () => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const response = await axios.get(`${API_URL}/profiles`);
        dispatch(setAllUsers(response.data.member));
    } catch (error) {
        console.log(`Erreur lors de la récupération des détails de l'utilisateur : ${error}`);
    } finally {
        dispatch(setLoading(false));
    }
}

export const fetchUserDetail = (userId) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const response = await axios.get(`${API_URL}/profiles/${userId}`);
        dispatch(setUserDetail(response.data));
    } catch (error) {
        console.log(`Erreur lors de la récupération des détails de l'utilisateur : ${error}`);
    } finally {
        dispatch(setLoading(false));
    }
}

export const fetchUserPlaylists = (userId) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const response = await axios.get(`${API_URL}/playlists?page=1&user=${userId}`);
        dispatch(setUserPlaylists(response.data.member));
    } catch (error) {
        console.log(`erreur lors du fetchUserPlaylists : ${error}`);
    } finally {
        dispatch(setLoading(false));
    }
}

export const fetchPlaylist = (playlistId) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const response = await axios.get(`${API_URL}/playlists/${playlistId}`);
        dispatch(setPlaylist(response.data));
    } catch (error) {
        console.log(`erreur lors du fetchSongsPlaylist : ${error}`);
    } finally {
        dispatch(setLoading(false));
    }
}

export const fetchAllAvatars = () => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const response = await axios.get(`${API_URL}/avatars`);
        dispatch(setAllAvatars(response.data.member));
    } catch (error) {
        console.log(`erreur lors du fetchAllAvatars : ${error}`);
    } finally {
        dispatch(setLoading(false));
    }
}

export default userSlice.reducer;