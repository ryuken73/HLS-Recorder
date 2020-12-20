const fileRemoveSync = require('find-remove');
const deleteOldFiles = (props) => {
    const {
        basePath="none",
        options={test:true}
    } = props;
    const results = fileRemoveSync(basePath, options);
    return results
}

const [nodeBinary, moduleFile, basePath, seconds, dir, test] = process.argv;
const options = {
    age: {seconds},
    dir: [dir],
    test
}
const results = deleteOldFiles({basePath, options});

const log = require('electron-log');
log.transports.console.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}';
log.transports.file.fileName = 'HLSDelete.log';
log.transports.file.maxSize = 10485760;
setTimeout(() => {
    log.info(`Delete Done[${basePath}]:${JSON.stringify(results)}`);

},5000)

// module.exports = deleteOldFiles;
// delete all directory under d:/cctv/channel5 mtime older than 20 hours
// const basePath = "D:/cctv";
// const options = {
//     age: {seconds: 60 * 60 * 20},
//     dir: ['*'],
//     test: true
// }

// console.log(deleteOldFiles({basePath, options}))