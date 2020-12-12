import React from 'react';
import Box from '@material-ui/core/Box';
import {SmallMarginTextField}  from '../template/smallComponents';

const bgColors = {
    'error': 'maroon',
    'normal': 'black'
}

const ErrCount = (props) => {
    const {status="normal",duration="0"} = props;
    const bgColor = bgColors[status];

    return (
        <Box width="5%" mx="1px"> 
            <SmallMarginTextField 
                width="100%"
                variant="outlined"
                margin="dense"
                bgcolor={bgColor}
                value={duration}
                fontSize={"20px"}
                disabled={true}
            ></SmallMarginTextField> 
        </Box>
    );
};

export default React.memo(ErrCount);