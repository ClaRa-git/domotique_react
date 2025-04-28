import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../constants/apiConstant";

const iconSlice = createSlice({
    name: "icons",
    initialState: {
        loadingIcon: false,
        allIcons: [],
    },
    reducers: {
        setLoadingIcon: (state, action) => {
            state.loadingIcon = action.payload;
        },
        setAllIcons: (state, action) => {
            state.allIcons = action.payload;
        },
    }
});

export const { setLoadingIcon, setAllIcons } = iconSlice.actions;

export const fetchAllIcons = () => async (dispatch) => {
    try {
        dispatch(setLoadingIcon(true));
        const response = await axios.get(`${API_URL}/icons`);
        dispatch(setAllIcons(response.data.member));
    } catch (error) {
        console.log(`Erreur lors de la récupération des icônes : ${error}`);
    } finally {
        dispatch(setLoadingIcon(false));
    }
}

export default iconSlice.reducer;