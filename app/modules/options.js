import {createAction, handleActions} from 'redux-actions';

const electronUtil = require('../lib/electronUtil');
const {remote} = require('electron');
const optionStore = electronUtil.createElectronStore({
    name:'optionStore',
    cwd:remote.app.getPath('home')
});

// action types
const SET_CONFIG = 'options/SET_CONFIG';
const SET_BASE_DIRECTORY = 'options/SET_BASE_DIRECTORY';
const SET_CHANNEL_PREFIX = 'options/SET_CHANNEL_PREFIX';
const SET_OPTIONS_DIALOG_OPEN = 'options/SET_OPTIONS_DIALOG_OPEN';

// action creator
export const setConfig = createAction(SET_CONFIG);
export const setBaseDirectory = createAction(SET_BASE_DIRECTORY);
export const setChannelPrefix = createAction(SET_CHANNEL_PREFIX);


export const setOptionsDialogOpen = createAction(SET_OPTIONS_DIALOG_OPEN);

// redux thunk
const getConfig = require('../lib/getConfig');
export const openOptionsDialog = () => (dispatch, getState) => {
    const config = getConfig({storeName:'optionStore', electronPath:'home'});
    dispatch(setConfig({config}));
    dispatch(setOptionsDialogOpen({dialogOpen:true}))
}
export const setConfigNSave = ({options}) => (dispatch, getState) => {
    optionStore.store(options);
    dispatch(setConfig({options}));
}

const defaultConfig = require('../config/default/config.json');
const initialState = {
    config: defaultConfig,
    optionsDialogOpen:false
}

// const {
//     BASE_DIRECTORY: saveDirectory,
//     CHANNEL_PREFIX: channelPrefix,
//     WAIT_SECONDS_MS_FOR_PLAYBACK_CHANGE: waitBeforePlayback,
//     LONG_BUFFERING_MS_SECONDS: longBufferSeconds,
//     SLEEP_MS_BETWEEN_ALL_START: delayForAllStart,
//     SLEEP_MS_BETWEEN_ALL_STOP: delayforAllStop,
//     NUMBER_OF_RECORDERS: numberOfRecorders,
//     DEFAULT_PLAYER_PROPS: playerOptions
// } = defaultConfig;

// const initialState = {
//     config: {
//         saveDirectory,
//         channelPrefix,
//         waitBeforePlayback,
//         longBufferSeconds,
//         delayForAllStart,
//         delayforAllStop,
//         numberOfRecorders,
//         playerOptions
//     },
//     optionsDialogOpen:false
// }

// reducer
export default handleActions({
    [SET_CONFIG]: (state, action) => {
        const {config} = action.payload;
        return {
            ...state,
            config,
        }
    },
    [SET_BASE_DIRECTORY]: (state, action) => {
        const baseDirectory = action.payload;
        const config = {...state.config};
        config.BASE_DIRECTORY = baseDirectory;
        return {
            ...state,
            config,
        }
    },
    [SET_CHANNEL_PREFIX]: (state, action) => {
        const chennelPrefix = action.payload;
        const config = {...state.config};
        config.CHANNEL_PREFIX = chennelPrefix;
        console.log('#######', config)
        return {
            ...state,
            config,
        }
    },
    [SET_OPTIONS_DIALOG_OPEN]: (state, action) => {
        const {dialogOpen} = action.payload;
        return {
            ...state,
            optionsDialogOpen:dialogOpen
        }
    },
}, initialState);