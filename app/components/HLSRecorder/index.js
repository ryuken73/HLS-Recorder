import React from 'react';
import Box from '@material-ui/core/Box';
import SectionWithFullHeight from '../template/SectionWithFullHeight';
import Duration from './Duration';
import Selector from './Selector';
import HLSPlayer from './HLSPlayer';
import Controls from './Controls';
import Scheduler from './Scheduler';

const HLSRecorder = () => {
    return (
        <SectionWithFullHeight m={"5px"} flexGrow={0} width="320px" bgcolor={"#2d2f3b"} border={1} borderColor={"black"} p="1px">
            <Duration></Duration>
            <Selector></Selector>
            <Box display="flex" alignItems="flex-start">
                <Controls></Controls>
                <HLSPlayer></HLSPlayer>
            </Box>
            <Scheduler></Scheduler>
        </SectionWithFullHeight>
    );
};

export default React.memo(HLSRecorder);