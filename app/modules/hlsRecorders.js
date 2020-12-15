import {createAction, handleActions} from 'redux-actions';
import {setPlayerSource, refreshPlayer} from './hlsPlayers';
// import {logInfo, logError, logFail} from './messagePanel';
const cctvFromConfig = require('../lib/getCCTVList');
const getConfig = require('../lib/getConfig');
const sources = cctvFromConfig();
const config = getConfig(); 

const {
    NUMBER_OF_RECORDERS,
    CHANNEL_PREFIX,
    BASE_DIRECTORY
} = config;

const INITIAL_DURATION = '00:00:00.00';
const INITIAL_INTERVAL = 60000;

import utils from '../utils';
async function mkdir(directory){
    try {
        await utils.file.makeDirectory(directory);
    } catch (err) {
        console.error(err);
    }
}

const recorders = new Map();

// initialize recorder
const path = require('path');
for(let i=1 ; i<=NUMBER_OF_RECORDERS ; i++){
    const {title, url} = sources[i];
    const channelName = `${CHANNEL_PREFIX}${i}`;
    const channelDirectory = path.join(BASE_DIRECTORY, channelName);
    const hlsRecorder = {
        channelName,
        channelDirectory,
        playerHttpURL: url,
        duration: INITIAL_DURATION,
        recorder: null,
        inTransition: false,
        scheduleFunction: null,
        localm3u8: null,
        recorderStatus: 'stopped',
        scheduleStatus: 'stopped',
        scheduleInterval: INITIAL_INTERVAL
    }
    recorders.set(i, hlsRecorder);
}

// action types
const SET_DURATION = 'hlsRecorders/SET_DURATION';
const SET_RECORDER = 'hlsRecorders/SET_RECORDER';
const SET_RECORDER_STATUS = 'hlsRecorders/SET_RECORDER_STATUS';
const SET_RECORDER_INTRANSITION = 'hlsRecorders/SET_RECORDER_INTRANSITION';
const SET_SCHEDULE_FUNCTION = 'hlsRecorders/SET_SCHEDULE_FUNCTION';
const SET_SCHEDULE_INTERVAL = 'hlsRecorders/SET_SCHEDULE_INTERVAL';
const SET_SCHEDULE_STATUS = 'hlsRecorders/SET_SCHEDULE_STATUS';
const SET_AUTO_START_SCHEDULE = 'hlsRecorders/SET_AUTO_START_SCHEDULE';
const SAVE_PLAYER_HTTP_URL = 'hlsRecorders/SAVE_PLAYER_HTTP_URL';

// action creator
export const setDuration = createAction(SET_DURATION);
export const setRecorder = createAction(SET_RECORDER);
export const setRecorderStatus = createAction(SET_RECORDER_STATUS);
export const setRecorderInTransition = createAction(SET_RECORDER_INTRANSITION);
export const setScheduleFunction = createAction(SET_SCHEDULE_FUNCTION);
export const setScheduleInterval = createAction(SET_SCHEDULE_INTERVAL);
export const setScheduleStatus = createAction(SET_SCHEDULE_STATUS);
export const setAutoStartSchedule = createAction(SET_AUTO_START_SCHEDULE);
export const savePlayerHttpURL = createAction(SAVE_PLAYER_HTTP_URL);

import log from 'electron-log';
const createLogger = channelName => {
    return {
        info: msg => {log.info(`[${channelName}][ChannelControl]${msg}`)},
        error: msg => {log.error(`[${channelName}][ChannelControl]${msg}`)}
    }
}

import HLSRecorder from '../lib/RecordHLS_ffmpeg';
import {getAbsolutePath} from '../lib/electronUtil';

const getChanneler = (state, channelNumber) => {
    const {recorders} = state.hlsRecorders;
    const {players} = state.hlsPlayers;
    const hlsRecorder = recorders.get(channelNumber);
    const hlsPlayer = players.get(channelNumber);
    const channelLog = createLogger(hlsRecorder.channelName)
    return [hlsRecorder, hlsPlayer, channelLog]
}

export const createRecorder = (channelNumber, createdByError=false) => (dispatch, getState) => {
    const state = getState();
    const [hlsRecorder, hlsPlayer, channelLog] = getChanneler(state, channelNumber);
    const {
        channelName,
        channelDirectory,
        scheduleStatus
    } = hlsRecorder;
    const {
        source
    } = hlsPlayer;

    channelLog.info(`create HLS Recorder`)

    const ffmpegPath = getAbsolutePath('bin/ffmpeg.exe', true);
    const recorderOptions = {
        name: channelName,
        src: '', 
        channelDirectory,
        enablePlayback: true, 
        localm3u8:'',
        ffmpegBinary: ffmpegPath,
        renameDoneFile: false,
    }
    const recorder = HLSRecorder.createHLSRecoder(recorderOptions);

    const startHandler = cmd => {
        channelLog.info(`recorder emitted start : ${cmd}`)
        setTimeout(() => {
            dispatch(setRecorderStatus({channelNumber, recorderStatus: 'started'}));
            dispatch(setRecorderInTransition({channelNumber, inTransition:false}));
        },1000);
    }
    const progressHandler = progress => {
        dispatch(setDuration({channelNumber, duration:progress.duration}));
    }
    const errorHandler = error => {
        channelLog.error(`error occurred`);
        channelLog.error(error);
        // after recorder emits error
        // 1. resetPlayer => change mode from playback to source streaming
        dispatch(refreshPlayer({channelNumber}));
        // 2. resetRecorder => initialize recorder status(duration, status..)
        //    because recorder's error emits end event, resetRecorder is
        //    done in recorder's end handler in RecordHLS_ffmpeg.js.
        // 3. recreateRecorder with createdByError=true
        dispatch(createRecorder(channelNumber, /*createdByError */ true));
    }
    
    recorder.on('start', startHandler)
    recorder.on('progress', progressHandler)
    recorder.on('error', errorHandler)
    dispatch(setRecorder({channelNumber, recorder}))
    createdByError && scheduleStatus === 'started' && dispatch(startRecording(channelNumber));
}


const getOutputName = (hlsRecorder, hlsPlayer) => {
    const {channelName, channelDirectory} = hlsRecorder;
    const {source} = hlsPlayer;
    const now = utils.date.getString(new Date());
    const jobDescString = `${channelName}_${now}_${Date.now()}_${source.title}`;
    const safeForWinFile = utils.file.toSafeFileNameWin(jobDescString);
    const saveDirectory = path.join(channelDirectory, safeForWinFile);
    const localm3u8 = path.join(saveDirectory, `${channelName}_stream.m3u8`);
    return [saveDirectory, localm3u8];
}

export const refreshRecorder = ({channelNumber}) => (dispatch, getState) => {
    const state = getState();
    const {recorders} = state.hlsRecorders;
    const hlsRecorder = recorders.get(channelNumber);
    dispatch(setRecorderStatus({channelNumber, recorderStatus: 'stopped'}))
    dispatch(setRecorderInTransition({channelNumber, inTransition:false}));
    dispatch(setDuration({channelNumber, duration:INITIAL_DURATION}));
    dispatch(setPlayerSource({channelNumber, url:hlsRecorder.playerHttpURL}))
}

export const restartRecording = channelNumber => (dispatch, getState) => {
    const state = getState();
    const [hlsRecorder, hlsPlayer, channelLog] = getChanneler(state, channelNumber);
    const {scheduleStatus} = hlsRecorder;
    scheduleStatus === 'started' && dispatch(startRecording(channelNumber));
}

export const startRecording = (channelNumber) => (dispatch, getState) => {
    return new Promise((resolve, reject) => {
        console.log(`#### in startRecording:`, channelNumber)
        const state = getState();
        const [hlsRecorder, hlsPlayer, channelLog] = getChanneler(state, channelNumber);
        const {
            channelName,
            recorder,
        } = hlsRecorder;
        const {
            source
        } = hlsPlayer;
    
        channelLog.info(`start startRecroding() recorder.createTime:${recorder.createTime}`)
    
        const [saveDirectory, localm3u8] = getOutputName(hlsRecorder, hlsPlayer);
        mkdir(saveDirectory);
        
        // recorder.src = source.url;
        recorder.src = hlsRecorder.playerHttpURL;
        recorder.target = localm3u8;
        recorder.localm3u8 = localm3u8;
        
        dispatch(setRecorderInTransition({channelNumber, inTransition:true}))
        dispatch(setRecorderStatus({channelNumber, recorderStatus: 'starting'}))
    
        recorder.once('start', (cmd) => {
            channelLog.info(`recorder emitted start : ${cmd}`)
            setTimeout(() => {
                dispatch(setPlayerSource({channelNumber, url:localm3u8}))
                resolve(true);
            },1000);
        })
        recorder.once('end', async (clipName, startTimestamp, duration) => {
            try {
                channelLog.info(`recorder emitted end (listener1): ${clipName}`)
                const endTimestamp = Date.now();
                const startTime = utils.date.getString(new Date(startTimestamp),{})
                const endTime = utils.date.getString(new Date(endTimestamp),{})
                const url = hlsRecorder.playerHttpURL;
                const title = source.title;
                const hlsDirectory = saveDirectory;
                const clipId = `${channelName}_${startTime}_${endTime}`
                const hlsm3u8 = localm3u8;
                const clipData = {
                    clipId,
                    channelNumber,
                    channelName,
                    startTime,
                    endTime,
                    startTimestamp,
                    endTimestamp,
                    url,
                    title,
                    hlsDirectory,
                    duration,
                    hlsm3u8,
                    saveDirectory,
                    mp4Converted:false
                }
    
                console.log('#######', clipData)
                //todo : save clipData in electron store
                dispatch(refreshRecorder({channelNumber}));
                //todo : remove old clips based on keey hours configuration parameter
                // rimraf(hlsDirectory, err => {
                //     if(err) {
                //         channelLog.error(err);
                //         channelLog.error(`delete working directory failed: ${hlsDirectory}`);
                //         return
                //     } 
                //     channelLog.info(`delete working directory success: ${hlsDirectory}`);
                // });
            } catch (error) {
                if(error){
                    channelLog.error(error)
                }
            }
        })
    
        recorder.start();
    })
}

export const stopRecording = (channelNumber) => (dispatch, getState) => {
    
    return new Promise((resolve, reject) => {
        try {
            const state = getState();
            const [hlsRecorder, hlsPlayer, channelLog] = getChanneler(state, channelNumber);

            const {
                channelName,
                recorder,
                channelDirectory,
                inTransition
            } = hlsRecorder;
            const {
                source
            } = hlsPlayer;

            channelLog.info(`start stopRecording(): inTransition: ${inTransition}, recorder.createTime:${recorder.createTime}`)
            
            dispatch(setRecorderStatus({channelNumber, recorderStatus: 'stopping'}))
            dispatch(setRecorderInTransition({channelNumber, inTransition:true}));
            recorder.once('end', async clipName => {
                channelLog.info(`recorder normal stopRecording. emitted end (listener2)`)
                resolve(true);
            })
            recorder.stop();
        } catch (err) {
            // channelLog.error(`error in stopRecording`)
            console.log(err)
            log.error(err);
            dispatch(refreshRecorder({channelNumber}));
            resolve(true)
        }
    })
}

export const startSchedule = channelNumber => async (dispatch, getState) => {
    // setAutoStartSchedule(false);
    dispatch(setScheduleStatus({channelNumber, scheduleStatus:'starting'}));
    const state = getState();
    const [hlsRecorder, hlsPlayer, channelLog] = getChanneler(state, channelNumber);

    const {channelName, recorder, scheduleInterval} = hlsRecorder;
    channelLog.info(`### start schedule : recorder.createTime=${recorder.createTime}`)

    if(recorder.isBusy) await stopRecording(channelNumber);
    dispatch(startRecording(channelNumber))
    .then((result) => {
        dispatch(setScheduleStatus({channelNumber, scheduleStatus:'started'}));
    })
    const scheduleFunction = setInterval( async () => {
        dispatch(stopRecording(channelNumber))
        .then(result => {
            return dispatch(startRecording(channelNumber))
        })
    }, scheduleInterval);
    dispatch(setScheduleFunction({channelNumber, scheduleFunction}))
}

export const stopSchedule = channelNumber => async (dispatch, getState) => {
    const state = getState();
    const [hlsRecorder, hlsPlayer, channelLog] = getChanneler(state, channelNumber);

    const {channelName, recorder, scheduleFunction} = hlsRecorder;
    channelLog.info(`### stop schedule : recorder.createTime=${recorder.createTime}`)

    dispatch(setScheduleStatus({channelNumber, scheduleStatus:'stopping'}))
    clearInterval(scheduleFunction);
    dispatch(setScheduleFunction({channelNumber, scheduleFunction:null}));
    if(recorder.isBusy) {
        dispatch(await stopRecording(channelNumber))
        .then(result => {
            dispatch(setScheduleStatus({channelNumber, scheduleStatus:'stopped'}));
        })
    }
}

const initialState = {
    recorders
}

// reducer
export default handleActions({
    [SET_DURATION]: (state, action) => {
        // console.log('%%%%%%%%%%%%%%%%', action.payload);
        const {channelNumber, duration} = action.payload;
        const recorder = {...state.recorders.get(channelNumber)};
        recorder.duration = duration;
        const recorders = new Map(state.recorders);
        recorders.set(channelNumber, recorder);
        return {
            recorders
        }
    },
    [SET_RECORDER]: (state, action) => {
        // console.log('%%%%%%%%%%%%%%%%', action.payload);
        const {channelNumber, recorder} = action.payload;
        const channelRecorder = {...state.recorders.get(channelNumber)};
        channelRecorder.recorder = recorder;
        const recorders = new Map(state.recorders);
        recorders.set(channelNumber, channelRecorder);
        return {
            recorders
        }
    },
    [SET_RECORDER_STATUS]: (state, action) => {
        // console.log('%%%%%%%%%%%%%%%%', action.payload);
        const {channelNumber, recorderStatus} = action.payload;
        const channelRecorder = {...state.recorders.get(channelNumber)};
        channelRecorder.recorderStatus = recorderStatus;
        const recorders = new Map(state.recorders);
        recorders.set(channelNumber, channelRecorder);
        return {
            recorders
        }
    },
    [SET_RECORDER_INTRANSITION]: (state, action) => {
        // console.log('%%%%%%%%%%%%%%%%', action.payload);
        const {channelNumber, inTransition} = action.payload;
        const channelRecorder = {...state.recorders.get(channelNumber)};
        channelRecorder.inTransition = inTransition;
        const recorders = new Map(state.recorders);
        recorders.set(channelNumber, channelRecorder);
        return {
            recorders
        }
    },
    [SET_SCHEDULE_FUNCTION]: (state, action) => {
        // console.log('%%%%%%%%%%%%%%%%', action.payload);
        const {channelNumber, scheduleFunction} = action.payload;
        const channelRecorder = {...state.recorders.get(channelNumber)};
        channelRecorder.scheduleFunction = scheduleFunction;
        const recorders = new Map(state.recorders);
        recorders.set(channelNumber, channelRecorder);
        return {
            recorders
        }
    },
    [SET_SCHEDULE_INTERVAL]: (state, action) => {
        // console.log('%%%%%%%%%%%%%%%%', action.payload);
        const {channelNumber, scheduleInterval} = action.payload;
        const channelRecorder = {...state.recorders.get(channelNumber)};
        channelRecorder.scheduleInterval = scheduleInterval;
        const recorders = new Map(state.recorders);
        recorders.set(channelNumber, channelRecorder);
        return {
            recorders
        }
    },
    [SET_SCHEDULE_STATUS]: (state, action) => {
        // console.log('%%%%%%%%%%%%%%%%', action.payload);
        const {channelNumber, scheduleStatus} = action.payload;
        const channelRecorder = {...state.recorders.get(channelNumber)};
        channelRecorder.scheduleStatus = scheduleStatus;
        const recorders = new Map(state.recorders);
        recorders.set(channelNumber, channelRecorder);
        return {
            recorders
        }
    },
    [SET_AUTO_START_SCHEDULE]: (state, action) => {
        // console.log('%%%%%%%%%%%%%%%%', action.payload);
        const {channelNumber, autoStartSchedule} = action.payload;
        const channelRecorder = {...state.recorders.get(channelNumber)};
        channelRecorder.autoStartSchedule = autoStartSchedule;
        const recorders = new Map(state.recorders);
        recorders.set(channelNumber, channelRecorder);
        return {
            recorders
        }
    },
    [SAVE_PLAYER_HTTP_URL]: (state, action) => {
        // console.log('%%%%%%%%%%%%%%%%', action.payload);
        const {channelNumber, playerHttpURL} = action.payload;
        const channelRecorder = {...state.recorders.get(channelNumber)};
        channelRecorder.playerHttpURL = playerHttpURL;
        const recorders = new Map(state.recorders);
        recorders.set(channelNumber, channelRecorder);
        return {
            recorders
        }
    },
}, initialState);