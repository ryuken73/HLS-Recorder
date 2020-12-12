import React from 'react';
import Box from '@material-ui/core/Box';
import HLSRecorder from './HLSRecorder';

const numbers = [1]


const Body = (props) => {
  console.log('###', props)
  return (
    <Box display="flex" flexWrap="wrap" overflow="auto">
      {numbers.map(number => {
        return <HLSRecorder key={number}></HLSRecorder>
      })}
    </Box>
  );
};

export default React.memo(Body);