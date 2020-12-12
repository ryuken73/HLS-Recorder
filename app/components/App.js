import React from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import FullHeightContainer from './template/FullHeightContainer';
import FirstChildSection from './template/FirstChildSection';
import WebView from './WebView';
import ControlPanelContainer from '../containers/ControlPanelContainer';
import ItemTabContainer from '../containers/ItemTabContainer';
import MessageContainer from './MessagePanel';
import ItemRowList from './ItemRowList';
const { BrowserView, getCurrentWindow } = require('electron').remote;
const { ipcRenderer } = require('electron');
const ConfigParser = require('configparser');
const config = new ConfigParser();
const utils = require('../utils');
import {SmallButton} from './template/smallComponents';

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
      <Box display="flex" flexDirection="column" height="1" width="1"> 
        <ItemRowList></ItemRowList>
      </Box>
    </ThemeProvider>
  );
}

export default App;
   