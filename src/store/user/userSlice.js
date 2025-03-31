import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "users",
    initialState: {
        loading: false,
        userDetail: {},
    },
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setUserDetail: (state, action) => {
            state.userDetail = action.payload;
        },
    }
});

export const { setLoading, setUserDetail } = userSlice.actions;

// méthodes du slice


export default userSlice.reducer;