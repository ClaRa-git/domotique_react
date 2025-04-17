import { createSelector } from "@reduxjs/toolkit";

const selectLoadingDevice = (state) => state.devices.loadingDevice;
const selectDeviceDetail = (state) => state.devices.deviceDetail;
const selectAllDevices = (state) => state.devices.allDevices;
const selectDevicesWithoutRoom = (state) => state.devices.devicesWithoutRoom;

const selectDeviceData = createSelector(
    [
        selectLoadingDevice,
        selectDeviceDetail,
        selectAllDevices,
        selectDevicesWithoutRoom
    ],
    (
        loadingDevice,
        deviceDetail,
        allDevices,
        devicesWithoutRoom
    ) => ({
        loadingDevice,
        deviceDetail,
        allDevices,
        devicesWithoutRoom
    })
);

export default selectDeviceData;