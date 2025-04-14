import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import roomReducer from "./room/roomSlice";
import vibeReducer from "./vibe/vibeSlice";

const store = configureStore({
    reducer: {
        users : userReducer,
        rooms : roomReducer,
        vibes : vibeReducer
    }
});

export default store;