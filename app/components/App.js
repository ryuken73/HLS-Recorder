import React, {useEffect, useState} from 'react';
import Box from '@material-ui/core/Box';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import BottomMenuContainer from '../containers/BottomMenuContainer';;
import BodyContainer from '../containers/BodyContainer';
import OptionDialogContainer from '../containers/OptionDialogContainer';
import HeaderContainer from '../containers/HeaderContainer';
import ReloadConfirm from './ReloadConfirm';
import MessageContainer from './MessagePanel';
import AutoReloadDialog from '../containers/AutoReloadContainer';
import AutoStartDialog from '../containers/AutoStartDialogContainer';
const { BrowserView, getCurrentWindow } = require('electron').remote;
const { remote, ipcRenderer } = require('electron');
const utils = require('../utils');

const theme = createMuiTheme({
  typography: {
    subtitle1: {
      fontSize: 12,
    },
    body1: {
      fontSize: 12,
      fontWeight: 500, 
    }
  }
});

const {getCombinedConfig} = require('../lib/getConfig');
const config = getCombinedConfig();
const {
  MAX_MEMORY_RELOAD_WAIT_MS, 
  MAX_MEMORY_TO_RELOAD_MB,
  AUTO_START_SCHEDULE,
  AUTO_START_SCHEDULE_DELAY_MS
} = config;

function App(props) { 
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [dialogTitle, setDialogTitle] = React.useState('Really Reload?');
  const [dialogText, setDialogText] = React.useState('Reload will stop current recordings and schedules. OK?');
  const [reloadDialogOpen, setReloadDialogOpen] = React.useState(false);
  const [autoStartDialogOpen, setAutoStartDialogOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    setIsLoading(false);
  },[])
  
  React.useEffect(() => {
    if(AUTO_START_SCHEDULE === true){
      setAutoStartDialogOpen(true);
    }
  },[])

  return (
    <ThemeProvider theme={theme}>
      {isLoading && 
        <Box display="flex" height="100%">
          <Box m="auto" fontSize="30px">
              Loading.....
          </Box>
        </Box>
      }
      {!isLoading &&
        <Box display="flex" flexDirection="column" height="1">
          <HeaderContainer 
            setConfirmOpen={setConfirmOpen}
          ></HeaderContainer>
          <BodyContainer></BodyContainer>
          <MessageContainer 
            mt="auto"
            maxMemory={MAX_MEMORY_TO_RELOAD_MB}
            setReloadDialogOpen={setReloadDialogOpen}
          ></MessageContainer> 
          <ReloadConfirm 
            open={confirmOpen} 
            setOpen={setConfirmOpen}
            dialogTitle={dialogTitle}
            dialogText={dialogText}
          ></ReloadConfirm>
          <OptionDialogContainer 
            title="Options"
            setConfirmOpen={setConfirmOpen}
            setDialogTitle={setDialogTitle}
            setDialogText={setDialogText}
          ></OptionDialogContainer>
          { reloadDialogOpen && 
            <AutoReloadDialog
              open={reloadDialogOpen}
              reloadWaitSeconds={MAX_MEMORY_RELOAD_WAIT_MS}
            >
            </AutoReloadDialog>
          }
          {autoStartDialogOpen &&
            <AutoStartDialog
              open={autoStartDialogOpen}
              setAutoStartDialogOpen={setAutoStartDialogOpen}
              scheduleStartDelay={AUTO_START_SCHEDULE_DELAY_MS}
            >
            </AutoStartDialog>
          }

        </Box>
      }
    </ThemeProvider>
  );
}

export default React.memo(App);
   