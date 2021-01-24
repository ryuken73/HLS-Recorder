const reportStatus = report => {
    const {type, source, name, value} = report;
    console.log(`@@ notify report : type[${type}] source[${source}] name[${name}] value[${value}]`);
    //send report to kafka    
}


module.exports = {
    reportStatus
}