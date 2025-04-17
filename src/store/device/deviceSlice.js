import { createSlice } from "@reduxjs/toolkit";

const deviceSlice = createSlice({
    name: "devices",
    initialState: {
        loadingDevice: false,
        deviceDetail: {},
        allDevices: [],
    },
    reducers: {
        setLoadingDevice: (state, action) => {
            state.loadingDevice = action.payload;
        },
        setDeviceDetail: (state, action) => {
            state.deviceDetail = action.payload;
        },
        setAllDevices: (state, action) => {
            state.allDevices = action.payload;
        },
    }
});

export const { setLoadingDevice, setDeviceDetail, setAllDevices } = deviceSlice.actions;

export const fetchDeviceWithoutRoom = () => async (dispatch) => {
    try {
        dispatch(setLoadingDevice(true));
        const response = await axios.get(`${API_URL}/devices?page=1&exists%5Broom%5D=false`);
        dispatch(setAllDevices(response.data));
    } catch (error) {
        console.log(`Erreur lors de la récupération des appareils : ${error}`);
    } finally {
        dispatch(setLoadingDevice(false));
    }
}

export default deviceSlice.reducer;