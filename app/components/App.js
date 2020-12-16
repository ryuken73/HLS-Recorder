import React from 'react';
import Box from '@material-ui/core/Box';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Header from './Header';
// import BottomMenu from './BottomMenu';
import BottomMenuContainer from '../containers/BottomMenuContainer';;
// import Body from './Body';
import BodyContainer from '../containers/BodyContainer';
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
  console.log(props)
  return (
    <ThemeProvider theme={theme}>
      <Box display="flex" flexDirection="column" height="1">
        <Header></Header>
        <BodyContainer></BodyContainer>
        <BottomMenuContainer mt="auto"></BottomMenuContainer> 
        <MessageContainer></MessageContainer> 
      </Box>
    </ThemeProvider>
  );
}

export default App;
   