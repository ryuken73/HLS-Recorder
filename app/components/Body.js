import React from 'react';
import Box from '@material-ui/core/Box';
import HLSRecorder from './HLSRecorder';

const numbers = [1,2,3,4,5,6,7,8,9,10];


const Body = () => {
    return (
      <Box display="flex" flexWrap="wrap" overflow="auto">
        {numbers.map(number => {
          return <HLSRecorder key={number}></HLSRecorder>
        })}
      </Box>
    );
};

export default React.memo(Body);