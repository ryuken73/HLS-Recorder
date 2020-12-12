module.exports = () => {
    const electronUtil = require('./electronUtil')
    const defaultJsonFile = electronUtil.getAbsolutePath('config/default/cctvs.json', true);
    const customJsonFile = electronUtil.getAbsolutePath('config/cctvs.json', true);
    const defaultJson = electronUtil.readJSONFile(defaultJsonFile);
    const customJson = electronUtil.readJSONFile(customJsonFile);
    const distinctByKey = (arrayObject, key) => {
        const resultsUniq = [];
        arrayObject.forEach(objectElement => {
            const isUnique = resultsUniq.every(resultElement => resultElement[key] !== objectElement[key]);
            if(isUnique) resultsUniq.push(objectElement);
        })
        return resultsUniq;
    }
    const mergedCCTVs = distinctByKey([...defaultJson.cctvs, ...customJson.cctvs], 'title');
    return mergedCCTVs;
}

