import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../constants/apiConstant";

const userSlice = createSlice({
    name: "users",
    initialState: {
        loading: false,
        userDetail: {},
        allUsers: [],
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
    }
});

export const { setLoading, setUserDetail, setAllUsers } = userSlice.actions;

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

export default userSlice.reducer;