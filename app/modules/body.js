import {createAction, handleActions} from 'redux-actions';
 
const cctvFromConfig = require('../lib/getCCTVList');
const cctvs = cctvFromConfig();
console.log('%%%', cctvs);

// action types
const SET_CCTVS = 'body/SET_CCTVS';

// action creator
export const setCCTVS = createAction(SET_CCTVS);

const initialState = {
    cctvs: cctvs
}

// reducer
export default handleActions({
    [SET_CCTVS]: (state, action) => {
        // console.log('%%%%%%%%%%%%%%%%', action.payload);
        const {cctvs} = action.payload;
        return {
            cctvs
        }
    },
}, initialState);