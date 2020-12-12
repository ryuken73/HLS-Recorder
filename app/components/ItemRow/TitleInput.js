import React from 'react';
import Box from '@material-ui/core/Box';
import {SmallMarginTextField}  from '../template/smallComponents';

const TitleInput = (props) => {
    const {disabled=false, title=""} = props;
    const bgColor = "#2d2f3b";

    return (
        <Box width="10%" mx="1px"> 
            <SmallMarginTextField 
                width="100%"
                variant="outlined"
                margin="dense"
                bgcolor={bgColor}
                value={title}
                fontSize={"20px"}
                disabled={disabled}
                placeHolder={"Title"}
            ></SmallMarginTextField> 
        </Box>
    );
};

export default React.memo(TitleInput);