// const {remote} = require('electron');
const electronUtil = require('./electronUtil');
const Store = require('electron-store');
// const {app} = require('electron');
// console.log('isRenderer', electronUtil.isRenderer, getPath)

const valuesToInt = obj => {
    const valuesToInt = Object.entries(obj).reduce((acc, element) => {
        const [key, value] = element;
        // if(typeof(value) === 'string' && value.includes(',')){
        if(typeof(value) === 'string' && key === 'DELETE_SCHEDULE_CRON') {
            // this can be cron string like "0,10,20 * * *"
            // return original value
            return {...acc, [key]:value};
        }
        const convertInt = isNaN(parseInt(value)) ? value: parseInt(value);
        return {...acc, [key]:convertInt}
    },{})
    return valuesToInt;
}

const getCombinedConfig = (params={}) => {
    const {app} = electronUtil.isRenderer ? require('electron').remote : require('electron');
    const {storeName='optionStore', electronPath='home'} = params;
    const defaultJsonFile = electronUtil.getAbsolutePath('config/default/config.json', true);
    const defaultJson = electronUtil.readJSONFile(defaultJsonFile);
    const sourceStore = new Store({
        name: storeName,
        cwd: app.getPath(electronPath)
    })
    const customConfig = sourceStore.store;
    const combinedConfig = {...defaultJson, ...customConfig};
    const typeConverted = valuesToInt(combinedConfig)
    return typeConverted;
}

const getDefaultConfig = () => {
    const defaultJsonFile = electronUtil.getAbsolutePath('config/default/config.json', true);
    const defaultJson = electronUtil.readJSONFile(defaultJsonFile);
    return {...defaultJson};
}
module.exports = {
    getCombinedConfig,
    getDefaultConfig
}
