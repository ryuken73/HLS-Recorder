import React from 'react';
import Box from '@material-ui/core/Box';
import {SmallButton}  from './template/smallComponents';

import BorderedBox from './template/BorderedBox';
import IconButton from '@material-ui/core/IconButton';
import SettingsIcon from '@material-ui/icons/Settings';
import { Typography } from '@material-ui/core';
import OptionSelect from './template/OptionSelect';

const buttonColor = 'darkslategrey';

const ButtomMenu = (props) => {
    const {mt="auto"} = props;
    const {
        scheduleStatusAllStop,
        recorderStatusAllStop,
        recorderStatusAnyInTransition
    } = props;
    const {
        startScheduleAll=()=>{},
        stopScheduleAll=()=>{},
        startRecordAll=()=>{},
        stopRecordAll=()=>{},
    } = props.HLSRecorderActions;
    const scheduleButtonColor =  scheduleStatusAllStop ? 'darkslategrey' : 'maroon';
    const recordButtonColor =  recorderStatusAllStop ? 'darkslategrey' : 'maroon';

    return (      
        <Box 
            display="flex" 
            alignItems="center"
            mx="5px"
            mt={mt}
            mb="5px"
            alignContent="center"
        >
            <Box mx="10px">
                <Typography>
                    Apply All
                </Typography>
            </Box>
            <SmallButton 
                size="small" 
                color="secondary" 
                variant={"contained"} 
                mt={"0px"}
                mb={"0px"}
                ml={"10px"}
                mr={"0px"}
                bgcolor={scheduleButtonColor}
                minwidth={"130px"}
                disabled={recorderStatusAnyInTransition}
                onClick={scheduleStatusAllStop ? startScheduleAll : stopScheduleAll}
            >{scheduleStatusAllStop ? "start schedule" : "stop schedule"}</SmallButton>
            <SmallButton 
                size="small" 
                color="secondary" 
                variant={"contained"} 
                mt={"0px"}
                mb={"0px"}
                ml={"5px"}
                mr={"0px"}
                bgcolor={recordButtonColor}
                minwidth={"130px"}
                disabled={recorderStatusAnyInTransition}
                onClick={recorderStatusAllStop ? startRecordAll : stopRecordAll}
            >{recorderStatusAllStop ? "start record" : "stop record"}
            </SmallButton>
            <Box
                mt={"0px"}
                mb={"0px"}
                ml={"5px"}
                mr={"0px"}
            >
                <OptionSelect
                    selectColor={"darkslategrey"}
                    disabled={!scheduleStatusAllStop && !recorderStatusAnyInTransition}
                ></OptionSelect>
            </Box>
        </Box>  

    );
};

export default React.memo(ButtomMenu);