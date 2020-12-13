import {createAction, handleActions} from 'redux-actions';
// import {logInfo, logError, logFail} from './messagePanel';
const cctvFromConfig = require('../lib/getCCTVList');
const getConfig = require('../lib/getConfig');
const sources = cctvFromConfig();
const config = getConfig();

const {
    NUMBER_OF_RECORDERS,
    CHANNEL_PREFIX,
    DEFAULT_PLAYER_PROPS
} = config;

const mkOverlayContent = url => {
    const source = sources.find(source => source.url === url)
    const {title} = source
    const element = document.createElement('div');
    element.innerHTML = title;
    element.style = "color:black;font-weight:bold";
    return element;
}

const players = new Map();
for(let i=1;i<=NUMBER_OF_RECORDERS;i++){
    const {title, url} = sources[i];
    const hlsPlayerProps = {
        ...DEFAULT_PLAYER_PROPS,
        source: sources[i],
        channelName: `${CHANNEL_PREFIX}${i}`,
        overlayContent: mkOverlayContent(url)
    }
    players.set(i, hlsPlayerProps);
}


// action types
const SET_PLAYER = 'hlsPlayers/SET_PLAYER';
const SET_HTTPSOURCE = 'hlsPlayers/SET_HTTPSOURCE';
const REFRESH_PLAYER = 'hlsPlayers/REFRESH_PLAYER';

// action creator
export const setPlayer = createAction(SET_PLAYER);
export const setHttpSource = createAction(SET_HTTPSOURCE);
export const refreshPlayer = createAction(REFRESH_PLAYER);


const initialState = {
    players
}

// reducer
export default handleActions({
    [SET_PLAYER]: (state, action) => {
        console.log('%%%%%%%%%%%%%%%%', action.payload);
        const {channelNumber, player} = action.payload;
        const hlsPlayer = {...state.players.get(channelNumber)};
        hlsPlayer.player = player;
        const players = new Map(state.players);
        players.set(channelNumber, hlsPlayer);
        return {
            players
        }
    },
    [SET_HTTPSOURCE]: (state, action) => {
        console.log('%%%%%%%%%%%%%%%%', action.payload);
        const {channelNumber, sourceNumber} = action.payload;
        const {url} = sources[sourceNumber];
        const overlayContent = mkOverlayContent(url);

        const hlsPlayer = {...state.players.get(channelNumber)};
        hlsPlayer.source = sources[sourceNumber];
        hlsPlayer.overlayContent = overlayContent;

        const players = new Map(state.players);
        players.set(channelNumber, hlsPlayer);
        return {
            players
        }
    },
    [REFRESH_PLAYER]: (state, action) => {
        console.log('%%%%%%%%%%%%%%%%', action.payload);
        const {channelNumber, url} = action.payload;
        const hlsPlayer = {...state.players.get(channelNumber)};
        const {player} = hlsPlayer;
        if(player === null) {
            console.log('player is null. not refresh!')
            return {state}
        }
        const srcObject = {
            src: url,
            type: hlsPlayer.type,
            handleManifestRedirects: true,
        }
        player.src(srcObject);
        return { ...state }
    },
}, initialState);


