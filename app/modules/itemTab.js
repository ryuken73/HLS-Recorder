import {createAction, handleActions} from 'redux-actions';
const utils = require('../utils');

// action types
const SET_CURRENT_TAB_ID = 'itemTab/SET_CURRENT_TAB_ID';

// action creator
export const setCurrentTabId = createAction(SET_CURRENT_TAB_ID);

const initialState = {
    currentTabId : null
}

// reducer 
export default handleActions({
    [SET_CURRENT_TAB_ID]: (state, action) => {
        console.log('%%%%%%%%%%%%%%%%', action.payload);
        const tabId = action.payload;
        return {
            ...state,
            currentTabId: tabId
        }
    },
}, initialState);