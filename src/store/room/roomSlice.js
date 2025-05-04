import { createSlice } from "@reduxjs/toolkit";
import { API_URL } from "../../constants/apiConstant";
import axios from "axios";

const roomSlice = createSlice({
    name: "rooms",
    initialState: {
        loadingRoom: true,
        roomDetail: {},
        allRooms: [],
        roomsAvailable: [],
        roomsUnavailable: []
    },
    reducers: {
        setLoadingRoom: (state, action) => {
            state.loadingRoom = action.payload;
        },
        setRoomDetail: (state, action) => {
            state.roomDetail = action.payload;
        },
        setAllRooms: (state, action) => {
            state.allRooms = action.payload;
        },
        setRoomsAvailable: (state, action) => {
            state.roomsAvailable = action.payload;
        },
        setRoomsUnavailable: (state, action) => {
            state.roomsUnavailable = action.payload;
        }
    }
});

export const { setLoadingRoom, setRoomDetail, setAllRooms, setRoomsAvailable, setRoomsUnavailable } = roomSlice.actions;

export const fetchAllRooms = () => async (dispatch) => {
    try {
        dispatch(setLoadingRoom(true));
        const response = await axios.get(`${API_URL}/rooms`);
        dispatch(setAllRooms(response.data.member));
    } catch (error) {
        console.log(`Erreur lors de la récupération des détails de la pièce : ${error}`);
    } finally {
        dispatch(setLoadingRoom(false));
    }
}

export const fetchRoomDetail = (id) => async (dispatch) => {
    try {
        dispatch(setLoadingRoom(true));
        const response = await axios.get(`${API_URL}/rooms/${id}`);
        dispatch(setRoomDetail(response.data));
    } catch (error) {
        console.log(`Erreur lors de la récupération des détails de la pièce : ${error}`);
    } finally {
        dispatch(setLoadingRoom(false));
    }
}

export const fetchRoomsAvailable = () => async (dispatch) => {
    try {
        dispatch(setLoadingRoom(true));
        const response = await axios.get(`${API_URL}/rooms?page=1&exists%5BvibePlaying%5D=false`);
        dispatch(setRoomsAvailable(response.data.member));
    } catch (error) {
        console.log(`Erreur lors de la récupération des détails de la pièce : ${error}`);
    } finally {
        dispatch(setLoadingRoom(false));
    }
}

export const fetchRoomsUnavailable = () => async (dispatch) => {
    try {
        dispatch(setLoadingRoom(true));
        const response = await axios.get(`${API_URL}/rooms?page=1&exists%5BvibePlaying%5D=true`);
        dispatch(setRoomsUnavailable(response.data.member));
    } catch (error) {
        console.log(`Erreur lors de la récupération des détails de la pièce : ${error}`);
    } finally {
        dispatch(setLoadingRoom(false));
    }
}

export default roomSlice.reducer;