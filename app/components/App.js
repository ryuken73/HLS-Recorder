import React from 'react';
import Box from '@material-ui/core/Box';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import BottomMenuContainer from '../containers/BottomMenuContainer';;
import BodyContainer from '../containers/BodyContainer';
import OptionDialogContainer from '../containers/OptionDialogContainer';
import HeaderContainer from '../containers/HeaderContainer';
import ReloadConfirm from './ReloadConfirm';
import MessageContainer from './MessagePanel';
// import AutoReloadDialog from './AutoReloadDialog';
import AutoReloadDialog from '../containers/AutoReloadContainer';
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

const {getDefaultConfig} = require('../lib/getConfig');
const config = getDefaultConfig();
const {MAX_MEMORY_RELOAD_WAIT_MS, MAX_MEMORY_TO_RELOAD_MB} = config;

function App(props) { 
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [dialogTitle, setDialogTitle] = React.useState('Really Reload?');
  const [dialogText, setDialogText] = React.useState('Reload will stop current recordings and schedules. OK?');
  const [reloadDialogOpen, setReloadDialogOpen] = React.useState(false);
  const [memUsed, setMemUsed] = React.useState(0);
  React.useEffect(() => {
    setInterval(() => {
        process.getProcessMemoryInfo()
        .then(processMemory => {
            setMemUsed((processMemory.private/1024).toFixed(0));
        })
    }, 1000)
  },[])

  (memUsed > MAX_MEMORY_TO_RELOAD_MB) && setReloadDialogOpen(true);
  
  return (
    <ThemeProvider theme={theme}>
      <Box display="flex" flexDirection="column" height="1">
        <HeaderContainer 
          setConfirmOpen={setConfirmOpen}
        ></HeaderContainer>
        <BodyContainer></BodyContainer>
        {/* <BottomMenuContainer mt="auto"></BottomMenuContainer>  */}
        <MessageContainer 
          mt="auto"
          memUsed={memUsed}
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
      </Box>
    </ThemeProvider>
  );
}

export default App;
   