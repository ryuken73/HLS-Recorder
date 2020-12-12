import React from 'react';
import Box from '@material-ui/core/Box';
import {SmallMarginTextField}  from '../template/smallComponents';

const bgColors = {
    'starting': 'crimson',
    'started': 'maroon',
    'stopping': '#590000',
    'stopped': 'black'
}

const Duration = (props) => {
    const {status="stopped", duration="00:00:00.00"} = props;
    const bgColor = bgColors[status];

    return (
        <Box width="15%" mx="1px"> 
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

export default React.memo(Duration);