import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../constants/apiConstant";

const deviceSlice = createSlice({
    name: "devices",
    initialState: {
        loadingDevice: false,
        deviceDetail: {},
        allDevices: [],
        devicesWithoutRoom: [],
        defaultSettingsForDevices: []
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
        setDevicesWithoutRoom: (state, action) => {
            state.devicesWithoutRoom = action.payload;
        },
        setDefaultSettingsForDevices: (state, action) => {
            state.defaultSettingsForDevices = action.payload;
        }
    }
});

export const { setLoadingDevice, setDeviceDetail, setAllDevices, setDevicesWithoutRoom, setDefaultSettingsForDevices } = deviceSlice.actions;

export const fetchDevicesWithoutRoom = () => async (dispatch) => {
    try {
        dispatch(setLoadingDevice(true));
        const response = await axios.get(`${API_URL}/devices?page=1&exists%5Broom%5D=false`);
        dispatch(setDevicesWithoutRoom(response.data.member));
    } catch (error) {
        console.log(`Erreur lors de la récupération des appareils : ${error}`);
    } finally {
        dispatch(setLoadingDevice(false));
    }
}

export const fetchDefaultSettingsForDevices = () => async (dispatch) => {
    try {
        dispatch(setLoadingDevice(true));
        const response = await axios.get(`${API_URL}/default_settings`);
        dispatch(setDefaultSettingsForDevices(response.data.member));
    } catch (error) {
        console.log(`Erreur lors de la récupération des appareils : ${error}`);
    } finally {
        dispatch(setLoadingDevice(false));
    }
}

export const fetchDeviceDetail = (deviceId) => async (dispatch) => {
    try {
        dispatch(setLoadingDevice(true));
        const response = await axios.get(`${API_URL}/devices/${deviceId}`);
        dispatch(setDeviceDetail(response.data));
    } catch (error) {
        console.log(`Erreur lors de la récupération des appareils : ${error}`);
    } finally {
        dispatch(setLoadingDevice(false));
    }
}

export default deviceSlice.reducer;