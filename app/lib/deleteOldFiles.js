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
console.log(basePath, seconds, dir, test)
const options = {
    age: {seconds},
    dir: [dir],
    test: false
}
const results = deleteOldFiles({basePath, options});
console.log(results)

// module.exports = deleteOldFiles;
// delete all directory under d:/cctv/channel5 mtime older than 20 hours
// const basePath = "D:/cctv";
// const options = {
//     age: {seconds: 60 * 60 * 20},
//     dir: ['*'],
//     test: true
// }

// console.log(deleteOldFiles({basePath, options}))