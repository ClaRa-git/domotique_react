import { createSelector } from "@reduxjs/toolkit";

const selectLoadingDevice = (state) => state.devices.loadingDevice;
const selectDeviceDetail = (state) => state.devices.deviceDetail;
const selectAllDevices = (state) => state.devices.allDevices;

const selectDeviceData = createSelector(
    [
        selectLoadingDevice,
        selectDeviceDetail,
        selectAllDevices
    ],
    (
        loadingDevice,
        deviceDetail,
        allDevices
    ) => ({
        loadingDevice,
        deviceDetail,
        allDevices
    })
);

export default selectDeviceData;