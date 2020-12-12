import {createAction, handleActions} from 'redux-actions';
 
const cctvFromConfig = require('../lib/getCCTVList');
const sources = cctvFromConfig();

// action types
const SET_SOURCES = 'app/SET_SOURCES';

// action creator
export const setSources = createAction(SET_SOURCES);

const initialState = {
    sources
}

// reducer
export default handleActions({
    [SET_SOURCES]: (state, action) => {
        const {sources} = action.payload;
        return {
            sources
        }
    },
}, initialState);