import {createAction, handleActions} from 'redux-actions';
// import {logInfo, logError, logFail} from './messagePanel';
 
const utils = require('../utils');

// action types
// const ADD_IMAGE_DATA = 'imageList/ADD_IMAGE_DATA';
const ADD_PAGE = 'imageList/ADD_PAGE';

// action creator
export const addPage = createAction(ADD_PAGE);

const recorderDefault = {
    index: null,
    tmpFname: null
}

const mkRecorder = (recorderInfo) => {
    const {size} = imageInfo.metadata;
    imageInfo.metadata.sizeKB = utils.number.toByteUnit({number:Number(size), unit:'KB'});
    return {
        ...imageDefault,
        index: imageInfo.metadata.reqIndex,
        tmpFname: imageInfo.tmpFname,
        tmpSrc: imageInfo.tmpSrc,
        imageSrc: imageInfo.tmpSrc,
        imageFname: imageInfo.tmpFname.replace(/^\d{13}_/,''),
        metadata: imageInfo.metadata
    }
}

export const addImageData = (imageInfo) => async (dispatch, getState) => {
    console.log(`#### in addImageData:`, imageInfo)
    const state = getState();
    const {pageIndex} = imageInfo;
    const imageData = state.imageList.pageImages.get(pageIndex) || [];
    const newImage = mkImageItem(imageInfo);
    const images = [
        ...imageData,
        newImage
    ]
    dispatch(setPageImages({pageIndex, images}));
}

const initialState = {
    currentTab: null,
    pageImages: new Map(),
    pageTitles: new Map(),
    pageLastCheckedImage: new Map(),
    imagePreviewOpen:false,
    imageShow: true
}

// reducer
export default handleActions({
    [ADD_PAGE]: (state, action) => {
        // console.log('%%%%%%%%%%%%%%%%', action.payload);
        const {pageIndex} = action.payload;
        const pageTitles = new Map(state.pageTitles);
        const pageImages = new Map(state.pageImages);
        const initialTitle = '';
        const initialImageData = [];
        pageTitles.set(pageIndex, initialTitle);
        pageImages.set(pageIndex, initialImageData);
        return {
            ...state,
            pageTitles,
            pageImages
        }
    },
}, initialState);