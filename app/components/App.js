import React from 'react';
import Box from '@material-ui/core/Box';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import HeaderContainer from '../containers/HeaderContainer';
import BottomMenuContainer from '../containers/BottomMenuContainer';;
import BodyContainer from '../containers/BodyContainer';
import OptionDialogContainer from '../containers/OptionDialogContainer';
import ReloadConfirm from './ReloadConfirm';
import MessageContainer from './MessagePanel';
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

function App(props) { 
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [dialogTitle, setDialogTitle] = React.useState('Really Reload?');
  const [dialogText, setDialogText] = React.useState('Reload will stop current recordings and schedules. OK?');
  return (
    <ThemeProvider theme={theme}>
      <Box display="flex" flexDirection="column" height="1">
        <HeaderContainer 
          setConfirmOpen={setConfirmOpen}
        ></HeaderContainer>
        <BodyContainer></BodyContainer>
        <BottomMenuContainer mt="auto"></BottomMenuContainer> 
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
        <MessageContainer></MessageContainer> 
      </Box>
    </ThemeProvider>
  );
}

export default App;
   