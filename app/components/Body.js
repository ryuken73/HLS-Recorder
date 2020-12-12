import React from 'react';
import Box from '@material-ui/core/Box';
import HLSRecorder from './HLSRecorder';

const Body = (props) => {
  console.log('###', props);
  const {channels} = props;
  return (
    <Box display="flex" flexWrap="wrap" overflow="auto">
      {channels.map(channelNumber => {
        return <HLSRecorder 
                  key={channelNumber} 
                  channelNumber={channelNumber}
               ></HLSRecorder>
      })}
    </Box>
  );
};

export default React.memo(Body);