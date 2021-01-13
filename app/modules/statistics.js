import {createAction, handleActions} from 'redux-actions';
 
const {getCombinedConfig} = require('../lib/getConfig');
const config = getCombinedConfig({storeName:'optionStore', electronPath:'home'});

const {
    NUMBER_OF_CHANNELS
} = config;

// action types
const SET_APP_STAT = 'statistics/SET_APP_STAT';
const SET_CHANNEL_STAT = 'statistics/SET_CHANNEL_STAT';

// action creator
export const setAppStat = createAction(SET_APP_STAT);
export const setChannelStat= createAction(SET_CHANNEL_STAT);

// set initial status
const initialAppStats = {
    startTime: Date.now(),
    reloadTimeManual: null,
    reloadTimeAutomatic: null,
    reloadCountManual: 0,
    reloadCountAutomatic: 0
}

const initialChannelStats = new Map();
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
    initialChannelStats.set(channelNumber, channelStat);
}

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
        const channelStats = new Map(state.channelStats);
        const channelStat = channelStats.get(channelNumber);
        channelStat[statName] = value;
        channelStats.set(channelNumber, {...channelStat});
        return {
            ...state,
            channelStats
        }
    }
}, initialState);