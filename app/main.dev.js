/* eslint global-require: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 *
 * @flow
 */
import { app, BrowserWindow, screen, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import path from 'path';
import { serialize } from 'v8';
// const path = require('path')

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload))
  ).catch(console.log);
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('browser-window-created', (event, window) =>  {
  window.webContents.on('did-finish-load', () => window.focus());
  console.log(window.getChildWindows())
  window.on('close', (event) => {
    // event.preventDefault();
    console.log('window about to close')
  })

  window.onbeforeunload = (e) => {
    console.log('I do not want to be closed')
  
    // Unlike usual browsers that a message box will be prompted to users, returning
    // a non-void value will silently cancel the close.
    // It is recommended to use the dialog API to let the user confirm closing the
    // application.
    e.returnValue = false // equivalent to `return false` but not recommended
  }
  console.log(Date.now(), 'new window created')
  // window.webContents.openDevTools();
})

app.on('ready', async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }
  const {width,height} = screen.getPrimaryDisplay().workAreaSize;
  mainWindow = new BrowserWindow({
    show: false,
    width: 1750,
    minWidth: 1012,
    maxWidth: 1750,
    minHeight: 800,
    height: height,
    backgroundColor: '#252839',
    title: 'HLS Recorder',
    minimizable: false,
    webPreferences: {
      nodeIntegration: true,
      nativeWindowOpen: true
    }
  }); 

  let saveDirectory = null;
  ipcMain.on('setSaveDirectory', (event,arg) => {
    console.log(`ipcMain setSaveDirectory: `, arg);
    saveDirectory = arg;
  })

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  //initialize statistics store
  clearStatisticsStore();

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  // new AppUpdater();

  const electronUtil = require('./lib/electronUtil');
  const electronLog = electronUtil.initElectronLog({}); 

  const getConfig = require('./lib/getConfig');
  const config = getConfig.getCombinedConfig();
  const {DELETE_SCHEDULE_CRON='0,10,20,30,40,50 * * * *'} = config;

  const scheduler = require('./lib/scheduleManager');
  const scheduleManager = scheduler(true, electronLog);
  const deleteScheduler = scheduleManager.register('deleteClips', DELETE_SCHEDULE_CRON);

  deleteScheduler.on('triggered', name => {
    const config = getConfig.getCombinedConfig();
    const {
      BASE_DIRECTORY="none", 
      CHANNEL_PREFIX="channel",
      KEEP_SAVED_CLIP_AFTER_HOURS=24
    } = config;
    electronLog.log(`triggered: ${name} baseDirectory:[${BASE_DIRECTORY}] channel prefix:[${CHANNEL_PREFIX}] delete before hours: [${KEEP_SAVED_CLIP_AFTER_HOURS}]`);
    const channelNumbers = Array(20).fill(0).map((element, index) => index+1);
    const deleteJobs = channelNumbers.map(channelNumber => {
      const channelDirectory = path.join(BASE_DIRECTORY, `${CHANNEL_PREFIX}${channelNumber}`);
      const args = [
        channelNumber,
        channelDirectory,
        60 * 60 * KEEP_SAVED_CLIP_AFTER_HOURS, /* seconds */
        '*', /* dir */
        false /* test */
      ]
      return args;
    })
    sequenceExecute(deleteJobs);
  }); 

  const deleteDirectoryR = require('./utils/deleteDirectoryR');
  const sequenceExecute = async deleteJobs => {
    try {
      if(deleteJobs.length > 0){
        const args = deleteJobs.shift();
        const channelNumber = args[0];
        const channelDirectory = args[1];
        const deleteBeforeSeconds = args[2]
        electronLog.info(`Delete Start...[${channelDirectory}]`);
        const results = await deleteDirectoryR(channelDirectory, deleteBeforeSeconds);
        electronLog.info('Delete End:', results);
        results.forEach(result => {
          if(result.deleted){
            deleteClipStore(result.file);
            electronLog.info('Delete clipStore too');
          }
        })
        mainWindow.webContents.send('deleteScheduleDone', channelNumber);
        await sequenceExecute(deleteJobs);
      }
    } catch (error) {
      electronLog.error(error)
      console.error('error in delete clips')
    }

  }
  deleteScheduler.start();
});

const Store = require('electron-store');
const deleteClipStore = deletedPath => {
  const clipStore = new Store({
    name:'clipStore',
    cwd:app.getPath('home')
  })
  const clipId = path.basename(deletedPath);
  clipStore.delete(clipId);
}

const clearStatisticsStore = () => {
  const statisticsStore = new Store({
    name:'statisticsStore',
    cwd:app.getPath('home')
  })
  statisticsStore.clear();
}
