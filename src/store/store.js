import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import roomReducer from "./room/roomSlice";
import vibeReducer from "./vibe/vibeSlice";
import planningReducer from "./planning/planningSlice";

const store = configureStore({
    reducer: {
        users : userReducer,
        rooms : roomReducer,
        vibes : vibeReducer,
        plannings : planningReducer,
    }
});

export default store;