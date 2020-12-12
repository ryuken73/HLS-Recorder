module.exports = () => {
    const electronUtil = require('./electronUtil')
    const defaultJsonFile = electronUtil.getAbsolutePath('config/default/config.json', true);
    const customJsonFile = electronUtil.getAbsolutePath('config/config.json', true);
    const defaultJson = electronUtil.readJSONFile(defaultJsonFile);
    const customJson = electronUtil.readJSONFile(customJsonFile);
    return {...defaultJson, ...customJson};
}

