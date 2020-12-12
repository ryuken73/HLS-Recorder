import React from 'react';
import Box from '@material-ui/core/Box';
import {SmallButton} from './template/smallComponents'
import BorderedBox from './template/BorderedBox';
import FullHeightContainer from './template/FullHeightContainer';
import CardListContainer from '../containers/CardListContainer';
const { BrowserView, BrowserWindow, getCurrentWindow } = require('electron').remote;
const { ipcRenderer } = require('electron');

export default function WebView(props) {
    const {showBrowser, hideBrowser, hostAddress, cardItems} = props;
    console.log(cardItems)
    const {clearItemCards} = props;
    let webViewBound;
    React.useEffect(() => {
        const view = new BrowserView({
          webPreferences:{
            nodeIntegration: false,
            nativeWindowOpen: true
          }
        });
        const mainWindow = getCurrentWindow();
        const [width, height] = mainWindow.getSize()
        webViewBound = {x:0, y:40, width:width-20, height:height-10};
        mainWindow.setBrowserView(view);
        view.setBounds(webViewBound); 
        view.setAutoResize({width:true, height:true})
        view.webContents.loadURL(hostAddress);
        // view.webContents.setUserAgent('electronMBK');
        view.webContents.on('new-window', (...args) => {
          console.log('new-window in WebView');
          console.log(args);
        }); 
        view.webContents.on('will-navigate', (...args) => console.log('will navigate'));
        view.webContents.on('did-finish-load', (...args) => console.log('did finish load', args));
        view.webContents.on('did-frame-finish-load', (...args) => console.log('did finish frmae load'));
        view.webContents.on('did-navigate', (...args) => console.log('did navigate'));
    },[hostAddress])

    return (
        <Box display="flex" flexGrow="0" alignItems="center" border="10">
          <SmallButton size="small" color="primary" variant={"contained"} lineHeight={2} style={{minWidth:'150px'}} onClick={showBrowser}>show Browser</SmallButton>
          <SmallButton size="small" color="primary" variant={"contained"} lineHeight={2} style={{minWidth:'150px'}} onClick={hideBrowser}>hide Browser</SmallButton>
          <CardListContainer></CardListContainer>
          <Box ml="auto" display={cardItems.size === 0 && "none"}>
            <SmallButton size="small" color="primary" variant={"contained"} lineHeight={2} style={{minWidth:'100px'}} onClick={clearItemCards}>Close All</SmallButton>
          </Box>

        </Box>
    )
}
  