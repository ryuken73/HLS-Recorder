import React from 'react';
import Box from '@material-ui/core/Box';
import RefreshIcon from '@material-ui/icons/Refresh';
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import AssignmentIcon from '@material-ui/icons/Assignment';
import Tooltip from '@material-ui/core/Tooltip';
import {SmallPaddingIconButton}  from '../../template/smallComponents';
import BorderedList from '../../template/BorderedList';
import log from 'electron-log';

import HLSRecorder from '../../../lib/RecordHLS_ffmpeg';
import {getAbsolutePath} from '../../../lib/electronUtil';

import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
    customWidth: {
      maxWidth: 500,
    }
}));

const rimraf = require('rimraf');
const path = require('path');
import utils from '../../../utils';

async function mkdir(directory){
    try {
        await utils.file.makeDirectory(directory);
    } catch (err) {
        console.error(err);
    }
}

const Controls = props => {
    const [tooltipOpen, setTooltipOpen] = React.useState(false);
    const {channelNumber, source, bgColors} = props;
    const {
        channelName="channelX",
        duration="00:00:00.00",
        channelDirectory="c:/cctv/channelX",
        url="",
        recorder=null,
        inTransition=false,
        scheduleFunction=null,
        autoStartSchedule=true,
        localm3u8=null,
        recorderStatus='stopped',
        scheduleStatus='stopped',
        mountPlayer=true
    } = props

    const recorderIconColor = bgColors[recorderStatus];
    const scheduleIconColor = bgColors[scheduleStatus];
    
    const {
        refreshPlayer=()=>{},
        remountPlayer=()=>{},
        setPlayerMount=()=>{}
    } = props.HLSPlayerActions;

    const {
        setDuration=()=>{},
        setRecorder=()=>{},
        setRecorderStatus=()=>{},
        setRecorderInTransition=()=>{},
        setScheduleFunction=()=>{},
        setScheduleStatus=()=>{},
        setAutoStartSchedule=()=>{},
        startRecording=()=>{},
        stopRecording=()=>{},
        refreshRecorder=()=>{},
        startSchedule=()=>{},
        stopSchedule=()=>{},
        restartRecording=()=>{},
        createRecorder=()=>{}
    } = props.HLSRecorderActions;

    const createLogger = channelName => {
        return {
            info: msg => {log.info(`[${channelName}][ChannelControl]${msg}`)},
            error: msg => {log.error(`[${channelName}][ChannelControl]${msg}`)}
        }
    }
    const channelLog = createLogger(channelName);
    React.useEffect(() => {
        try {
            mkdir(channelDirectory);
        } catch (err) {
            return
        }
    },[])

    React.useEffect(() => {
        createRecorder(channelNumber);
    },[])

    const refreshChannelPlayer = (event) => {
        // todo: url can be file url when recording
        // refreshPlayer({channelNumber, url:source.url});
        refreshPlayer({channelNumber});
    }

    const remountChannelPlayer = (event) => {
        // todo: url can be file url when recording
        // refreshPlayer({channelNumber, url:source.url});
        remountPlayer({channelNumber});
    }

    const toggleMountPlayer = React.useCallback( event => {
        setPlayerMount({channelNumber, mountPlayer:!mountPlayer})
    }, [mountPlayer]);

    const startRecordChannel = event => {
        startRecording(channelNumber);
    }

    const stopRecordChannel = event => {
        stopRecording(channelNumber);
    }

    const startScheduleChannel = event => {
        startSchedule(channelNumber);
    }

    const stopScheduleChannel = event => {
        stopSchedule(channelNumber);
    }

    const showStatistics = () => {
        setTooltipOpen(previous => {
            return !previous;
        })
    }

    const {remote} = require('electron');
    const openDirectory = () => {
        remote.shell.openItem(channelDirectory)
    }

    const {channelStat={}} = props;
    const AppStatComponent = () => {
        const StatLists = Object.entries(channelStat).map(([statName, value]) => {
            if(statName.includes('Time')){
                const dateString = (new Date(value)).toLocaleString();
                value = dateString;
            }
            return <BorderedList
                color={"white"}
                bgcolor={"#232738"}
                titlewidth={"120px"}
                subject={statName}
                content={value}
            ></BorderedList>
        })
        return StatLists;
    }

    const classes = useStyles();
    
    return (
        <Box display="flex" flexDirection="column" mr="3px">
            <SmallPaddingIconButton padding="1px" size="small" iconcolor="black">
                <RefreshIcon color="primary" fontSize={"small"} onClick={remountChannelPlayer}></RefreshIcon>
            </SmallPaddingIconButton>
            <SmallPaddingIconButton disabled={inTransition} padding="1px" size="small" iconcolor={recorderIconColor}>
                <FiberManualRecordIcon 
                    // color={recorderStatus==="started" ? "secondary" : "primary"}
                    fontSize={"small"} 
                    onClick={recorderStatus==="started" ? stopRecordChannel : startRecordChannel}
                ></FiberManualRecordIcon>
            </SmallPaddingIconButton>
            <SmallPaddingIconButton disabled={inTransition} padding="1px" size="small" iconcolor={scheduleIconColor}>
                <AccessAlarmIcon 
                    // color="primary" 
                    fontSize={"small"} 
                    onClick={scheduleStatus==="started" ? stopScheduleChannel : startScheduleChannel}
                ></AccessAlarmIcon>
            </SmallPaddingIconButton>
            <Box mt="auto" display="flex" flexDirection="column">
                <SmallPaddingIconButton padding="1px" size="small" iconcolor="black">
                    <FolderOpenIcon 
                        // color="primary" 
                        fontSize={"small"} 
                        onClick={openDirectory}
                    ></FolderOpenIcon>
                </SmallPaddingIconButton>
                <Tooltip
                    open={tooltipOpen}
                    title={<AppStatComponent></AppStatComponent>}
                    classes={{ tooltip: classes.customWidth }}
                    arrow
                >
                <SmallPaddingIconButton 
                    padding="1px" 
                    size="small" 
                    iconcolor="black"
                    onClick={showStatistics}
                >
                    <AssignmentIcon 
                        // color="primary" 
                        fontSize={"small"} 
                    ></AssignmentIcon>
                </SmallPaddingIconButton>
                </Tooltip>
            </Box>
        </Box>
    );
};

export default React.memo(Controls);