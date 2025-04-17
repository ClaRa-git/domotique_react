import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import roomReducer from "./room/roomSlice";
import vibeReducer from "./vibe/vibeSlice";
import planningReducer from "./planning/planningSlice";
import deviceReducer from "./device/deviceSlice";

const store = configureStore({
    reducer: {
        users : userReducer,
        rooms : roomReducer,
        vibes : vibeReducer,
        plannings : planningReducer,
        devices : deviceReducer,
    }
});

export default store;