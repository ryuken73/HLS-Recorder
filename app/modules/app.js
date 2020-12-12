import {createAction, handleActions} from 'redux-actions';
 
const cctvFromConfig = require('../lib/getCCTVList');
const cctvs = cctvFromConfig();

// action types
const SET_CCTVS = 'app/SET_CCTVS';

// action creator
export const setCCTVS = createAction(SET_CCTVS);

const initialState = {
    cctvs: cctvs
}

// reducer
export default handleActions({
    [SET_CCTVS]: (state, action) => {
        const {cctvs} = action.payload;
        return {
            cctvs
        }
    },
}, initialState);