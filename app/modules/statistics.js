import {createAction, handleActions} from 'redux-actions';
 
const {getCombinedConfig} = require('../lib/getConfig');
const config = getCombinedConfig({storeName:'optionStore', electronPath:'home'});

const {
    NUMBER_OF_CHANNELS
} = config;

import {remote} from 'electron';
const Store = require('electron-store');
const statisticsStore = new Store({
    name:'statisticsStore',
    cwd:remote.app.getPath('home')
})

const clipStore = new Store({
    name:'clipStore',
    cwd:remote.app.getPath('home')
})

const getTotalClipInStore = () => { return clipStore.size };
console.log('#####',getTotalClipInStore())

const getChannelClipCountInStore = channelNumber => {
    const allClips = clipStore.store;
    const count = Object.entries(allClips).filter(([id, clipInfo]) => {
        return clipInfo.channelNumber === channelNumber
    }).length
    return count;
}

// action types
const SET_APP_STAT = 'statistics/SET_APP_STAT';
const SET_CHANNEL_STAT = 'statistics/SET_CHANNEL_STAT';
const REPLACE_APP_STAT = 'statistics/CLEAR_APP_STAT';
const REPLACE_CHANNEL_STAT = 'statistics/CLEAR_CHANNEL_STAT';
const INCREASE_APP_STAT = 'statistics/INCREASE_APP_STAT';
const INCREASE_CHANNEL_STAT = 'statistics/INCREASE_CHANNEL_STAT';

// action creator
export const setAppStat = createAction(SET_APP_STAT);
export const setChannelStat= createAction(SET_CHANNEL_STAT);
export const replaceAppStat = createAction(REPLACE_APP_STAT);
export const replaceChannelStat= createAction(REPLACE_CHANNEL_STAT);
export const increaseAppStat= createAction(INCREASE_APP_STAT);
export const increaseChannelStat= createAction(INCREASE_CHANNEL_STAT);


// redux thunk
export const setAppStatNStore = ({statName, value}) => (dispatch, getState) => {
    statisticsStore.set(`appStats.${statName}`, value);
    dispatch(setAppStat({statName, value}));
}

export const increaseAppStatNStore = ({statName}) => (dispatch, getState) => {
    const state = getState();
    const oldValue = state.statistics.appStat[statName];
    statisticsStore.set(`appStats.${statName}`, oldValue + 1);
    dispatch(increaseAppStat({statName}));
}

// clear stat and statStore
export const clearAppStatNStore = () => (dispatch, getState) => {
    const [initialAppStats] = getInitialState(statisticsStore);
    statisticsStore.set(`appStats`, initialAppStats);
    dispatch(replaceAppStat({initialAppStat}));
}

export const initClipCountInFolder = () => (dispatch, getState) => {
    const state = getState();
    const {recorders} = state.hlsRecorders
    const getCountInSubDir = [...recorders].map(async ([channelNumber, recorder]) => {
        const saveFoler = recorder.channelDirectory;
        return await fs.promises.readdir(saveFoler);
    })
    Promise.all(getCountInSubDir)
    .then(subdirs => {
        const allCount = subdirs.flat().length;
        dispatch(setAppStatNStore({statName:'totalClipsInFoloer', value:allCount}));
    })
}   

const fs = require('fs');
export const setChannelStatNStore = ({channelNumber, statName, value}) => (dispatch, getState) => {
    statisticsStore.set(`channelStats.${channelNumber}.${statName}`, value);
    dispatch(setAppStatNStore({statName, value}));
    dispatch(setChannelStat({channelNumber, statName, value}));
    const countInStore = getChannelClipCountInStore(channelNumber);
    dispatch(setChannelStat({channelNumber, statName:'clipCountSotre', value:countInStore}))
    statisticsStore.set(`channelStats.${channelNumber}.clipCountSotre`, countInStore);

    const state = getState();
    const saveFolder = state.hlsRecorders.recorders.get(channelNumber).channelDirectory;
    fs.readdir(saveFolder, (err, files) => {
        dispatch(setChannelStat({channelNumber, statName:'clipCountFolder', value:files.length}));
        statisticsStore.set(`channelStats.${channelNumber}.clipCountFolder`, files.length);
    })
}

export const clearChannelStatNStore = ({channelNumber}) => (dispatch, getState) => {
    const [initialAppStats, initialChannelStats] = getInitialState(statisticsStore);
    const initialChanelStat = initialChannelStats[channelNumber];
    statisticsStore.set(`channelStats.${channelNumber}`, initialChanelStat);
    dispatch(replaceChannelStat({channelNumber, initialChanelStat}));
}

export const increaseChannelStatsNStore = ({channelNumber, statName}) => (dispatch, getState) => {
    const state = getState();
    const oldValue = state.statistics.channelStats[channelNumber][statName];
    statisticsStore.set(`channelStats.${channelNumber}.${statName}`, oldValue + 1);
    dispatch(increaseChannelStat({channelNumber, statName}));
    dispatch(increaseAppStatNStore({statName}));
    const totalClipCount = getTotalClipInStore();
    dispatch(setAppStatNStore({statName:"totalClipsInStore", value:totalClipCount}))
}

// set initial status

const getInitialState = statisticsStore => {
    if(statisticsStore.size === 0){
        const initialAppStats = {
            startTime: Date.now(),
            reloadTimeManual: null,
            reloadCountManual: 0,
            reloadTimeAutomatic: null,
            reloadCountAutomatic: 0,
            refreshCount: 0,
            successCount: 0,
            failureCount: 0,
            abortCount: 0,
            totalClipsInStore: getTotalClipInStore(),
            totalClipsInFoloer: 'calculating...'
        }
        const initialChannelStats = {};
        for(let channelNumber=1;channelNumber<=NUMBER_OF_CHANNELS;channelNumber++){
            const channelStat = {
                refreshCount: 0,
                successCount: 0,
                failureCount: 0,
                abortCount:0,
                lastRefreshTime: null,
                lastSuccessTime: null,
                lastFailureTime: null,
                lastAbortTime: null,
                clipCountSotre: 0,
                clipCountFolder: 0
            }
            initialChannelStats[channelNumber] = channelStat;
        }
        return [initialAppStats, initialChannelStats];
    }
    return [statisticsStore.get('appStats'), statisticsStore.get('channelStats')];
}

const setStaticsStore = (store, appStats, channelStats) => {
    store.set('appStats', appStats);
    store.set('channelStats', channelStats);
}

const [initialAppStats, initialChannelStats] = getInitialState(statisticsStore);
statisticsStore.size === 0 && setStaticsStore(statisticsStore, initialAppStats, initialChannelStats)

const initialState = {
    appStat: initialAppStats,
    channelStats: initialChannelStats
}

// reducer
export default handleActions({
    [SET_APP_STAT]: (state, action) => {
        // console.log('%%%%%%%%%%%%%%%%', action.payload);
        const {statName, value} = action.payload;
        const appStat = {...state.appStat};
        appStat[statName] = value;
        return {
            ...state,
            appStat
        }
    },
    [SET_CHANNEL_STAT]: (state, action) => {
        // console.log('%%%%%%%%%%%%%%%%', action.payload);
        const {channelNumber, statName, value} = action.payload;
        const channelStats = {...state.channelStats};
        const channelStat = channelStats[channelNumber];
        channelStat[statName] = value;
        channelStats[channelNumber] = {...channelStat};
        return {
            ...state,
            channelStats
        }
    },
    [REPLACE_APP_STAT]: (state, action) => {
        // console.log('%%%%%%%%%%%%%%%%', action.payload);
        const {initialAppStats} = action.payload;
        return {
            ...state,
            appStat: {...initialAppStats}
        }
    },
    [REPLACE_CHANNEL_STAT]: (state, action) => {
        // console.log('%%%%%%%%%%%%%%%%', action.payload);
        const {channelNumber, initialChannelStat} = action.payload;
        const channelStats = {...state.channelStats};
        const channelStat = channelStats[channelNumber];
        channelStats[channelNumber] = {...initialChannelStat};
        return {
            ...state,
            channelStats
        }
    },
    [INCREASE_APP_STAT]: (state, action) => {
        // console.log('%%%%%%%%%%%%%%%%', action.payload);
        const {statName} = action.payload;
        const appStat = {...state.appStat};
        appStat[statName] = appStat[statName] + 1;
        return {
            ...state,
            appStat
        }
    },
    [INCREASE_CHANNEL_STAT]: (state, action) => {
        // console.log('%%%%%%%%%%%%%%%%', action.payload);
        const {channelNumber, statName} = action.payload;
        const channelStats = {...state.channelStats};
        const channelStat = channelStats[channelNumber];
        channelStat[statName] = channelStat[statName] + 1;
        channelStats[channelNumber] = {...channelStat};
        return {
            ...state,
            channelStats
        }
    }
}, initialState);