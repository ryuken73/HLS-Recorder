import React, {useState, useEffect} from 'react';
import Box from '@material-ui/core/Box';
import BorderedBox from './template/BorderedBox';
import Typography from '@material-ui/core/Typography';
import SectionWithFullHeightFlex from './template/SectionWithFullHeightFlex';
const {remote, webFrame} = require('electron');
const {app} = remote;

const {
  KAFKA_TOPIC=`topic_${Date.now()}`, 
  KAFKA_KEY='none'} = require('../lib/getConfig').getCombinedConfig();

function MessagePanel(props) {
  // console.log('######################## re-render MessagePanel', props);
  const {logLevel="INFO", message="READY", mt="auto"} = props;
  const {setReloadDialogOpen, maxMemory, memUsageToClear} = props;
  const [memUsed, setMemUsed] = React.useState(0);
  const messageText = `[${logLevel}] ${message}`;
  const {setAppStatNStore, increaseAppStatNStore} = props.StatisticsActions;
  const kafkaSender = require('../lib/kafkaSender')({topic:KAFKA_TOPIC});

  React.useEffect(() => {
    const memChecker = setInterval(() => {
      process.getProcessMemoryInfo()
      .then(processMemory => {
        const currentMemMB = (processMemory.private/1024).toFixed(0);
        const memMBToClear = maxMemory * memUsageToClear / 100;
        if(currentMemMB > memMBToClear){
          console.log(`### clear memory(webFrame.clearCache()): currentMem[${currentMemMB}] triggerMem[${memMBToClear}]`);
          webFrame.clearCache();
          setAppStatNStore({statName:'memClearTime', value: Date.now()});
          increaseAppStatNStore({statName:'memClearCount'});
        } 
        setMemUsed(currentMemMB);
      })
    },1000)
    return () => {
      console.log('## clear memChecker')
      clearInterval(memChecker);
    }
  },[memUsageToClear]);

  React.useEffect(() => {
    return async () => {
      const reportStatus = {
        type: 'performance',
        source: 'app',
        name: 'memUsageMB',
        value: memUsed
      };
      const result = await kafkaSender.send({
        key: KAFKA_KEY,
        messageJson: reportStatus
      })
    }
    (memUsed > maxMemory) && setReloadDialogOpen(true);
  }, [memUsed])



    return (
        <SectionWithFullHeightFlex outerbgcolor={"#2d2f3b"} className="SectionWithFullHeightFlex ImageBox" flexGrow="0" width="1" mt={mt} mb="2px">
            <BorderedBox bgcolor={"#2d2f3b"} display="flex" alignContent="center" flexGrow="1">
                <Box bgcolor="#232738" display="flex" flexDirection="row" width="1">
                    <Box mx="10px">
                        <Typography variant={"caption"}>{messageText}</Typography>
                    </Box>
                    <Box ml="auto">
                        <Typography variant={"caption"}>[{memUsed}MB / {maxMemory}MB]</Typography>
                    </Box>
                    <Box ml="5px">
                        <Typography variant={"caption"}>v.{app.getVersion()}</Typography>
                    </Box>
                </Box>
            </BorderedBox>
        </SectionWithFullHeightFlex>
    )
}

export default React.memo(MessagePanel)
