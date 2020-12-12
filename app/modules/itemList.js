import {createAction, handleActions} from 'redux-actions';
import {addCardItem, updateCardItem} from './itemCardList';
const utils = require('../utils');

// action types
const ADD_TAB = 'itemList/ADD_TAB';
const ADD_TAB_ITEM = 'itemList/ADD_TAB_ITEM';
const DEL_TAB_ITEM = 'itemList/ADD_TAB_ITEM';
const UPDATE_TAB_ITEM = 'itemList/UPDATE_TAB_ITEM';

// action creator
export const addTab = createAction(ADD_TAB);
export const addTabItem = createAction(ADD_TAB_ITEM);
export const delTabItem = createAction(DEL_TAB_ITEM);
export const updateTabItem = createAction(UPDATE_TAB_ITEM);

// thunk action creator
export const addItemNCard = ({tabId, itemInfo}) => (dispatch, getState) => {
    console.log(tabId, itemInfo);
    dispatch(addTabItem({tabId, itemInfo}));
    dispatch(addCardItem({cardId: itemInfo.id, cardInfo: itemInfo}));
}

export const updateItemNCard = ({tabId, itemId, property, value}) => (dispatch, getState) => {
    console.log(tabId, itemId, property, value);
    dispatch(updateTabItem({tabId, itemId, property, value}));
    dispatch(updateCardItem({cardId:itemId, property, value}));
}

const initialState = {
    tabItems: new Map()
}

// reducer 
export default handleActions({
    [ADD_TAB]: (state, action) => {
        console.log('%%%%%%%%%%%%%%%%', action.payload);
        const tabId = action.payload;
        const tabItems = new Map(state.tabItems);
        tabItems.set(tabId, []);
        return {
            ...state,
            tabItems
        }
    },
    [ADD_TAB_ITEM]: (state, action) => {
        console.log('%%%%%%%%%%%%%%%%', action.payload);
        const {tabId, itemInfo} = action.payload;
        const items = [
            itemInfo,
            ...state.tabItems.get(tabId)
        ];
        
        const tabItems = new Map(state.tabItems);
        tabItems.set(tabId, items);
        return {
            ...state,
            tabItems
        }
    },
    [UPDATE_TAB_ITEM]: (state, action) => {
        console.log('%%%%%%%%%%%%%%%%', action.payload);
        const {tabId, itemId, property, value} = action.payload;
        const updateItem = {...state.tabItems.get(tabId).find(item => item.id === itemId)};
        updateItem[property] = value;
        const items = [...state.tabItems.get(tabId)].map(item => {
            if(item.id === itemId) return updateItem;
            return item;
        })

        const tabItems = new Map(state.tabItems);
        tabItems.set(tabId, items);
        return {
            ...state,
            tabItems
        }
    },

}, initialState);