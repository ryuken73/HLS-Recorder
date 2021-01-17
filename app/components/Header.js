import React, {useEffect, useState} from 'react';
import Box from '@material-ui/core/Box'
import BorderedList from './template/BorderedList';
// import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';
import SettingsIcon from '@material-ui/icons/Settings';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import HomeIcon from '@material-ui/icons/Home';
import BugReportIcon from '@material-ui/icons/BugReport';
import AssignmentIcon from '@material-ui/icons/Assignment';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import OptionSelect from './template/OptionSelect';
import Tooltip from '@material-ui/core/Tooltip';
import {BasicIconButton} from './template/basicComponents';

const {remote} = require('electron');

import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
    customWidth: {
      maxWidth: 500,
    }
}));

const Header = (props) => {
    // console.log('$$$$', props)
    const {setConfirmOpen=()=>{}, setConfirmAction=()=>{}} = props;
    const {setConfirmDialogTitle=()=>{}, setConfirmDialogText=()=>{}} = props;
    const {BASE_DIRECTORY="c:/temp"} =  props.config;
    const [tooltipOpen, setTooltipOpen] = React.useState(false);

    const {openOptionsDialog} = props.OptionDialogActions;

    const {
        scheduleStatusAllStop:scheduleStatusAllStopped,
        recorderStatusAllStop:recorderStatusAllStopped,
        scheduleStatusAllSame,
        recorderStatusAllSame,
        recorderStatusAnyInTransition,
        intervalsForSelection,
    } = props;

    const {
        startScheduleAll=()=>{},
        stopScheduleAll=()=>{},
        startRecordAll=()=>{},
        stopRecordAll=()=>{},
        changeAllIntervals=()=>{}
    } = props.HLSRecorderActions;

    const scheduleButtonColor =  scheduleStatusAllStopped ? 'grey' : 'maroon';
    const recordButtonColor =  recorderStatusAllStopped ? 'grey' : 'maroon';

    const openDialog = React.useCallback(() => {
        openOptionsDialog();
        // setOptionsDialogOpen({dialogOpen:true})
    },[])
    
    const remount = React.useCallback(() => {
        setConfirmDialogTitle('Really Refresh Player?');
        setConfirmDialogText("All Players will be refreshed. OK?");
        setConfirmAction('remount');
        setConfirmOpen(true);
        // remote.getCurrentWebContents().reload();
    },[])

    const reload = React.useCallback(() => {
        setConfirmDialogTitle('Caution! About to Reload Application!');
        setConfirmDialogText(`
            Reload will stop currently running recording!
        `);
        setConfirmAction('reload');
        setConfirmOpen(true);
        // remote.getCurrentWebContents().reload();
    },[])
    
    const openDirectory = React.useCallback(() => {
        remote.shell.openItem(BASE_DIRECTORY)
    },[BASE_DIRECTORY])

    const openHome = () => {
        const home = remote.app.getPath('home');
        remote.shell.openItem(home)

    }
    const openLogFolder = () => {
        const logFolder = remote.app.getPath('logs');
        remote.shell.openItem(logFolder)
    }
    const showStatistics = () => {
        setTooltipOpen(previous => {
            return !previous;
        })
    }

    const {appStat} = props;
    const {clearChannelStatNStore, initClipCountInFolder} = props.StatisticsActions;
    React.useEffect(() => {
        initClipCountInFolder();
    },[])
    const AppStatComponent = () => {
        const StatLists = Object.entries(appStat).map(([statName, value]) => {
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
        <Box 
            display="flex" 
            alignItems="center"
            bgcolor="#2d2f3b"
            mx="5px"
            mt="15px"
            alignContent="center"
            justifyContent="space-between"
            flexShrink="0"
        >
            <Box display="flex" alignItems="center" width="300px">
                <Box>
                    <BasicIconButton aria-label="remount" onClick={remount}>
                        <RefreshIcon 
                            fontSize="large"
                            style={{color:"grey"}}
                        ></RefreshIcon>
                    </BasicIconButton>
                </Box>
                <Box>
                    <BasicIconButton 
                        aria-label="all recording" 
                        iconcolor={recordButtonColor}
                        onClick={recorderStatusAllStopped ? startRecordAll : stopRecordAll}
                        disabled={recorderStatusAnyInTransition || !recorderStatusAllSame}
                    >
                        <FiberManualRecordIcon 
                            fontSize="large"
                        ></FiberManualRecordIcon>
                    </BasicIconButton>
                </Box>
                <Box>
                    <BasicIconButton 
                        aria-label="all schedule" 
                        iconcolor={scheduleButtonColor}
                        onClick={scheduleStatusAllStopped ? startScheduleAll : stopScheduleAll}
                        disabled={recorderStatusAnyInTransition || !scheduleStatusAllSame}
                    >
                        <AccessAlarmIcon 
                            fontSize="large"
                        ></AccessAlarmIcon>
                    </BasicIconButton>
                </Box>
                <Box ml="5px">
                    <OptionSelect
                        selectColor={"darkslategrey"}
                        disabled={!scheduleStatusAllStopped || recorderStatusAnyInTransition}
                        intervalsForSelection={intervalsForSelection}
                        minWidth="200px"
                        onChangeSelect={changeAllIntervals}
                        smallComponent={false}
                    ></OptionSelect>
                </Box>
                <Tooltip
                    open={tooltipOpen}
                    title={<AppStatComponent></AppStatComponent>}
                    classes={{ tooltip: classes.customWidth }}
                    arrow
                >
                    <Box ml="5px" mr={"auto"}>
                        <BasicIconButton 
                            aria-label="statistics" 
                            onClick={showStatistics}
                        >
                            <AssignmentIcon 
                                fontSize="large"
                                style={{color:"grey"}}
                            ></AssignmentIcon>
                        </BasicIconButton>
                    </Box>
                </Tooltip>

            </Box>
            <Box 
                fontFamily="Roboto, Helvetica, Arial, sans-serif" 
                textAlign="center" 
                fontSize="35px"
                // mx="5px"
                // mt="15px"
                // py="10px"
                // width="95%"
            >CCTV Recorder
            </Box>
            <Box display="flex" width="300px">
                <Box  ml="auto">
                    <BasicIconButton aria-label="reload" onClick={reload}>
                        <PowerSettingsNewIcon 
                            fontSize="large"
                            style={{color:"grey"}}
                        ></PowerSettingsNewIcon>
                    </BasicIconButton>
                </Box>
                <Box>
                    <BasicIconButton aria-label="home directory" onClick={openHome}>
                        <HomeIcon 
                            fontSize="large"
                            style={{color:"grey"}}
                        ></HomeIcon>
                    </BasicIconButton>
                </Box>
                <Box>
                    <BasicIconButton aria-label="open directory" onClick={openDirectory}>
                        <FolderOpenIcon 
                            fontSize="large"
                            style={{color:"grey"}}
                        ></FolderOpenIcon>
                    </BasicIconButton>
                </Box>
                <Box>
                    <BasicIconButton aria-label="open log(debug)" onClick={openLogFolder}>
                        <BugReportIcon 
                            fontSize="large"
                            style={{color:"grey"}}
                        ></BugReportIcon>
                    </BasicIconButton>
                </Box>
                <Box>
                    <BasicIconButton aria-label="configuration" onClick={openDialog}>
                        <SettingsIcon 
                            fontSize="large"
                            style={{color:"grey"}}
                        ></SettingsIcon>
                    </BasicIconButton>
                </Box>
            </Box>
        </Box>  

    );
};

export default React.memo(Header);