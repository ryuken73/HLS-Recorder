import React from 'react';
import Box from '@material-ui/core/Box';
import {SmallMarginTextField} from './template/smallComponents';
import {SmallPaddingFormControlLabel} from './template/smallComponents';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import OptionTextInput from './template/OptionTextInput';
import OptionRadioButton from './template/OptionRadioButton';
import FolderIcon  from '@material-ui/icons/Folder';
import {SmallPaddingIconButton} from './template/smallComponents';
import utils from '../utils';
// import DEFAULT_OPTIONS from '../config/options'; 
// import {optionProvider} from '../modules/navigator';

const { dialog } = require('electron').remote;

const INPUT_WIDTH='400px'
const SUBTITLE_WIDTH='25%';

const OptionTextInputWithDefault = props => {
  const {children} = props;
  return <OptionTextInput 
            subTitleWidth={SUBTITLE_WIDTH} 
            inputWidth={INPUT_WIDTH} 
            border="0" 
            color="black" 
            bgcolor="white" 
            textColor="black" 
            textalign="left"
            {...props}
          >
            {children}
          </OptionTextInput>
}

const boolLabels = [
  {value: 'YES', label: 'YES'},
  {value: 'NO', label: 'NO'}
]

const OptionRadioButtonWithDefault = props => {
  const {children} = props;
  return <OptionRadioButton 
          titlewidth={SUBTITLE_WIDTH} 
          formlabels={boolLabels} 
          border="0" 
          color="black" 
          bgcolor='white' 
          {...props}
        >
          {children}
        </OptionRadioButton>
}

const setOptionsOnLocalStorage = (options) => {
  const {homeUrl, saveDir, tempDir} = options;
  const {deleteOnClose, deleteOnStart, deleteAfterSave, closeTabAfterSave} = options;
  optionProvider.set('homeUrl', homeUrl);
  optionProvider.set('saveDir', saveDir);
  optionProvider.set('tempDir', tempDir);
  optionProvider.set('deleteOnClose', deleteOnClose);
  optionProvider.set('deleteOnStart', deleteOnStart);
  optionProvider.set('deleteAfterSave', deleteAfterSave);
  optionProvider.set('closeTabAfterSave', closeTabAfterSave);
  return true;
} 

export default function OptionDialog(props) {
  console.log('######################## re-render OptionDialog', props)
  const {title="Dialog Box"} = props;
  const {dialogOpen=true, config} = props;
  const {
    BASE_DIRECTORY="c:/temp",
    CHANNEL_PREFIX="channel",
    WAIT_SECONDS_MS_FOR_PLAYBACK_CHANGE,
    LONG_BUFFERING_MS_SECONDS,
    SLEEP_MS_BETWEEN_ALL_START,
    SLEEP_MS_BETWEEN_ALL_STOP,
    NUMBER_OF_CHANNELS,
    DEFAULT_PLAYER_PROPS,
    KEEP_SAVED_CLIP_AFTER_HOURS
  } = config;
  const {deleteOnClose=()=>{}} = props;
  const {setOptionsDialogOpen=()=>{}, saveConfigNSave=()=>{}} = props.OptionDialogActions;
  const {setDeleteOnClose=()=>{}} = props;
  const {setAllOptions=()=>{}} = props;
  const {
    setBaseDirectory=()=>{},
    setChannelPrefix=()=>{},
    setLongBufferSceonds=()=>{},
    setSleepBetweenStart=()=>{},
    setSleepBetweenStop=()=>{},
    setNumberOfChannels=()=>{},
    setKeepClipsAfterHours=()=>{},
    setWaitSecondsBeforePlayback=()=>{},
  } = props.OptionDialogActions;
  // const {setDialogOpen=()=>{},setSaveDir=()=>{}} = props.OptionDialogActions;
  // const {setDeleteOnClose=()=>{}} = props.OptionDialogActions;
  // const {setAllOptions=()=>{}} = props.OptionDialogActions;
  const [scroll, setScroll] = React.useState('paper');
  // const [saveDir, setSaveDir] = React.useState(BASE_DIRECTORY);
  // const [channelPrefixDisplay, setChannelPrefix] = React.useState(CHANNEL_PREFIX);

  const actionFunctions = {
    'saveDir': setBaseDirectory,
    'channelPrefix': setChannelPrefix,
    'longBufferSeconds': setLongBufferSceonds,
    'sleepBetweenStart': setSleepBetweenStart,
    'sleepBetweenStop': setSleepBetweenStop,
    'numberOfChannels': setNumberOfChannels,
    'saveClipAfterHours': setKeepClipsAfterHours,
    'waitSecondsForPlayback': setWaitSecondsBeforePlayback,
  }

  const onChange = type => {
    return event => {
        console.log(type, event.target.value);
        actionFunctions[type](event.target.value);
    }
  }   
  // const handleClickOpen = (scrollType) => () => {
  //   setOpen(true);
  //   setScroll(scrollType);
  // };

  const handleClose = () => {
    setOptionsDialogOpen({dialogOpen:false});
  };

  const onClickSelectSaveDirectory = () => {
    dialog.showOpenDialog(({properties:['openDirectory']}), filePaths=> {
      if(filePaths === undefined) return;
      setBaseDirectory(filePaths[0]);      
    })
  };
 
  const onClickSaveBtn = () => {
    saveConfigNSave({config});
    handleClose();
  }

  const resetOptions = () => {
    setAllOptions(DEFAULT_OPTIONS)
  }

  const SaveDirectoryButton = (
    <SmallPaddingIconButton 
        onClick={onClickSelectSaveDirectory} 
        aria-label="select save directory button"
        iconcolor="black"
      >
        <FolderIcon fontSize="small" />
    </SmallPaddingIconButton>)


  return (
    
    <Dialog
      open={dialogOpen}
      onClose={handleClose}
      scroll={scroll}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      fullWidth
    >
    <DialogTitle id="scroll-dialog-title">
      {title}
    </DialogTitle>
    <DialogContent dividers={scroll === 'paper'}>
      <DialogContentText
        id="scroll-dialog-description"
        tabIndex={-1}
      >
        <OptionTextInputWithDefault subtitle='Number of Recorders' value={NUMBER_OF_CHANNELS} onChange={onChange('numberOfChannels')}></OptionTextInputWithDefault>
        <OptionTextInputWithDefault subtitle='Channel Prefix' value={CHANNEL_PREFIX} onChange={onChange('channelPrefix')}></OptionTextInputWithDefault>
        <OptionTextInputWithDefault subtitle='Clip Keeping Hours(hh)' value={KEEP_SAVED_CLIP_AFTER_HOURS} onChange={onChange('saveClipAfterHours')}></OptionTextInputWithDefault>
        <OptionTextInputWithDefault subtitle='Long Buffering(ms)' value={LONG_BUFFERING_MS_SECONDS} onChange={onChange('longBufferSeconds')}></OptionTextInputWithDefault>
        <OptionTextInputWithDefault subtitle='Wait for Playback(ms)' value={WAIT_SECONDS_MS_FOR_PLAYBACK_CHANGE} onChange={onChange('waitSecondsForPlayback')}></OptionTextInputWithDefault>
        <OptionTextInputWithDefault subtitle='Delay All Starting(ms)' value={SLEEP_MS_BETWEEN_ALL_START} onChange={onChange('sleepBetweenStart')}></OptionTextInputWithDefault>
        <OptionTextInputWithDefault subtitle='Delay All Stopping(ms)' value={SLEEP_MS_BETWEEN_ALL_STOP} onChange={onChange('sleepBetweenStop')}></OptionTextInputWithDefault>
        <OptionTextInputWithDefault subtitle='Save Directory' value={BASE_DIRECTORY} onChange={onChange('saveDir')} iconButton={SaveDirectoryButton}></OptionTextInputWithDefault>
        <OptionRadioButtonWithDefault subtitle="Delete on tab close" currentvalue={deleteOnClose} onChange={onChange('deleteOnClose')}></OptionRadioButtonWithDefault>
        
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button style={{marginRight:'auto'}} onClick={resetOptions} color="primary">
        Default
      </Button>
      <Button onClick={handleClose} color="primary">
        Cancel
      </Button>
      <Button onClick={onClickSaveBtn} color="primary">
        Save
      </Button>
    </DialogActions>
  </Dialog>
  )
}
