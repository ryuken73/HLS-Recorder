import React from 'react';
import Box from '@material-ui/core/Box';
import SectionWithFullHeight from '../template/SectionWithFullHeight';
import Duration from './Duration';
import SourceSelectorContainer from '../../containers/SourceSelectorContainer';
import HLSPlayerContainer from '../../containers/HLSPlayerContainer';
import ControlsContainer from '../../containers/ControlsContainer';
// import Controls from './Controls';
import Scheduler from './Scheduler';

const HLSRecorder = (props) => {
    const {channelNumber, playbackMode=false} = props;
    return (
        <SectionWithFullHeight m={"5px"} flexGrow={0} width="320px" bgcolor={"#2d2f3b"} border={1} borderColor={"black"} p="1px">
            <Duration 
                channelNumber={channelNumber}
            ></Duration>
            <SourceSelectorContainer 
                channelNumber={channelNumber}
            ></SourceSelectorContainer>
            <Box display="flex" alignItems="flex-start">
                <ControlsContainer
                    channelNumber={channelNumber}
                ></ControlsContainer>
                <Box border={2} borderColor={playbackMode ? 'red':'black'}>
                    <HLSPlayerContainer 
                        channelNumber={channelNumber}
                    ></HLSPlayerContainer>
                </Box>
            </Box>
            <Scheduler
                channelNumber={channelNumber}
            ></Scheduler>
        </SectionWithFullHeight>
    );
};

export default React.memo(HLSRecorder);