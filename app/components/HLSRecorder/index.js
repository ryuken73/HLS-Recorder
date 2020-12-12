import React from 'react';
import Box from '@material-ui/core/Box';
import SectionWithFullHeight from '../template/SectionWithFullHeight';
import Duration from './Duration';
// import SourceSelector from './SourceSelector';
import SourceSelectorContainer from '../../containers/SourceSelectorContainer';
// import HLSPlayer from './HLSPlayer';
import HLSPlayerContainer from '../../containers/HLSPlayerContainer';
import Controls from './Controls';
import Scheduler from './Scheduler';

const HLSRecorder = (props) => {
    const {channelNumber} = props;
    return (
        <SectionWithFullHeight m={"5px"} flexGrow={0} width="320px" bgcolor={"#2d2f3b"} border={1} borderColor={"black"} p="1px">
            <Duration 
                channelNumber={channelNumber}
            ></Duration>
            <SourceSelectorContainer 
                channelNumber={channelNumber}
            ></SourceSelectorContainer>
            <Box display="flex" alignItems="flex-start">
                <Controls
                    channelNumber={channelNumber}
                ></Controls>
                <HLSPlayerContainer 
                    channelNumber={channelNumber}
                ></HLSPlayerContainer>
            </Box>
            <Scheduler
                channelNumber={channelNumber}
            ></Scheduler>
        </SectionWithFullHeight>
    );
};

export default React.memo(HLSRecorder);