import React from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import MessageContainer from './MessagePanel';
import HLSRecorder from './HLSRecorder';
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

const numbers = [1,2,3,4,5,6,7,8,9,10];

function App(props) { 
  return (
    <ThemeProvider theme={theme}>
      <Box display="flex" flexWrap="wrap">
        {numbers.map(number => {
          return <HLSRecorder key={number}></HLSRecorder>
        })}
      </Box>
    </ThemeProvider>
  );
}

export default App;
   