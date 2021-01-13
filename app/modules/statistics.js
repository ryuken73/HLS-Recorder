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

// action types
const SET_APP_STAT = 'statistics/SET_APP_STAT';
const SET_CHANNEL_STAT = 'statistics/SET_CHANNEL_STAT';
const INCREASE_APP_STAT = 'statistics/INCREASE_APP_STAT';
const INCREASE_CHANNEL_STAT = 'statistics/INCREASE_CHANNEL_STAT';

// action creator
export const setAppStat = createAction(SET_APP_STAT);
export const setChannelStat= createAction(SET_CHANNEL_STAT);
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

export const setChannelStatNStore = ({channelNumber, statName, value}) => (dispatch, getState) => {
    statisticsStore.set(`channelStats.${channelNumber}.${statName}`, value);
    dispatch(setAppStat({channelNumber, statName, value}));
}

export const increaseChannelStatsNStore = ({channelNumber, statName}) => (dispatch, getState) => {
    const state = getState();
    const oldValue = state.statistics.channelStats[channelNumber][statName];
    statisticsStore.set(`channelStats.${channelNumber}.${statName}`, oldValue + 1);
    dispatch(increaseChannelStat({channelNumber, statName}));
}

// set initial status

const getInitialState = statisticsStore => {
    if(statisticsStore.size === 0){
        const initialAppStats = {
            startTime: Date.now(),
            reloadTimeManual: null,
            reloadTimeAutomatic: null,
            reloadCountManual: 0,
            reloadCountAutomatic: 0
        }
        const initialChannelStats = {};
        for(let channelNumber=1;channelNumber<=NUMBER_OF_CHANNELS;channelNumber++){
            const channelStat = {
                refreshCount: 0,
                successCount: 0,
                failureCount: 0,
                lastSuccessTime: null,
                lastFailureTime: null,
                clipCountSotre: 0,
                clipCountFolder: 0
            }
            initialChannelStats[channelNumber] = channelStat;
        }
        return [initialAppStats, initialChannelStats];
    }
    return [statisticsStore.get('appStats'), statisticsStore.get('channelStats')];
}

const setStaticStore = (store, appStats, channelStats) => {
    store.set('appStats', appStats);
    store.set('channelStats', channelStats);
}

const [initialAppStats, initialChannelStats] = getInitialState(statisticsStore);
statisticsStore.size === 0 && setStaticStore(statisticsStore, initialAppStats, initialChannelStats)

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