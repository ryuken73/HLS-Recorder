const {remote} = require('electron');
const electronUtil = require('./electronUtil');
const Store = require('electron-store');

const getCombinedConfig = (params) => {
    const {storeName='optionStore', electronPath='home'} = params;
    const defaultJsonFile = electronUtil.getAbsolutePath('config/default/config.json', true);
    const defaultJson = electronUtil.readJSONFile(defaultJsonFile);
    const sourceStore = new Store({
        name: storeName,
        cwd:remote.app.getPath(electronPath)
    })
    const customConfig = sourceStore.store;
    return {...defaultJson, ...customConfig};
}
module.exports = getCombinedConfig
