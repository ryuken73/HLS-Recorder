import React, {useState, useEffect} from 'react';
import Box from '@material-ui/core/Box';
import BorderedBox from './template/BorderedBox';
import Typography from '@material-ui/core/Typography';
import SectionWithFullHeightFlex from './template/SectionWithFullHeightFlex';
const {remote} = require('electron');
const {app} = remote;

function MessagePanel(props) {
    // console.log('######################## re-render MessagePanel', props);
    const {logLevel="INFO", message="READY", mt="auto"} = props;
    const {setReloadDialogOpen, maxMemory} = props;
    const [memUsed, setMemUsed] = React.useState(0);
    const messageText = `[${logLevel}] ${message}`;

  React.useEffect(() => {
    setInterval(() => {
      process.getProcessMemoryInfo()
      .then(processMemory => {
        setMemUsed((processMemory.private/1024).toFixed(0));
      })
    },1000)
  },[]);

  (memUsed > maxMemory) && setReloadDialogOpen(true);

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
