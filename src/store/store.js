import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import roomReducer from "./room/roomSlice";
import vibeReducer from "./vibe/vibeSlice";
import planningReducer from "./planning/planningSlice";
import deviceReducer from "./device/deviceSlice";
import iconReducer from "./icon/iconSlice";
import songReducer from "./song/songSlice";

const store = configureStore({
    reducer: {
        users : userReducer,
        rooms : roomReducer,
        vibes : vibeReducer,
        plannings : planningReducer,
        devices : deviceReducer,
        icons : iconReducer,
        songs : songReducer,
    }
});

export default store;