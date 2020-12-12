import React from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import MessageContainer from './MessagePanel';
const { BrowserView, getCurrentWindow } = require('electron').remote;
const { ipcRenderer } = require('electron');
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
  },
});


function App(props) { 
  return (
    <ThemeProvider theme={theme}>
    </ThemeProvider>
  );
}

export default App;
   