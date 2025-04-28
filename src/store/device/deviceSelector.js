import { createSelector } from "@reduxjs/toolkit";

const selectLoadingDevice = (state) => state.devices.loadingDevice;
const selectDeviceDetail = (state) => state.devices.deviceDetail;
const selectAllDevices = (state) => state.devices.allDevices;
const selectDevicesWithoutRoom = (state) => state.devices.devicesWithoutRoom;
const selectDefaultSettingsForDevices = (state) => state.devices.defaultSettingsForDevices;

const selectDeviceData = createSelector(
    [
        selectLoadingDevice,
        selectDeviceDetail,
        selectAllDevices,
        selectDevicesWithoutRoom,
        selectDefaultSettingsForDevices
    ],
    (
        loadingDevice,
        deviceDetail,
        allDevices,
        devicesWithoutRoom,
        defaultSettingsForDevices
    ) => ({
        loadingDevice,
        deviceDetail,
        allDevices,
        devicesWithoutRoom,
        defaultSettingsForDevices
    })
);

export default selectDeviceData;