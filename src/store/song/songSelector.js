import { createSelector } from "@reduxjs/toolkit";

const selectLoadingSong = (state) => state.songs.loadingSong;
const selectSongDetail = (state) => state.songs.songDetail;
const selectAllSongs = (state) => state.songs.allSongs;

const selectSongData = createSelector(
    [
        selectLoadingSong,
        selectSongDetail,
        selectAllSongs
    ],
    (
        loadingSong,
        songDetail,
        allSongs
    ) => ({
        loadingSong,
        songDetail,
        allSongs
    })
);

export default selectSongData;