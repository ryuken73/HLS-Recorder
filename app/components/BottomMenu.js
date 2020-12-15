import React from 'react';
import Box from '@material-ui/core/Box';
import {SmallButton}  from './template/smallComponents';

import BorderedBox from './template/BorderedBox';
import IconButton from '@material-ui/core/IconButton';
import SettingsIcon from '@material-ui/icons/Settings';
import { Typography } from '@material-ui/core';

const buttonColor = 'darkslategrey';

const ButtomMenu = () => {
    return (      
        <Box 
            display="flex" 
            alignItems="center"
            mx="5px"
            mt="auto"
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
                ml={"0px"}
                mr={"5px"}
                bgcolor={buttonColor}
                minwidth={"130px"}
                disabled={false}
                onClick={()=>{}}
            >start schedule</SmallButton>
            <SmallButton 
                size="small" 
                color="secondary" 
                variant={"contained"} 
                mt={"0px"}
                mb={"0px"}
                ml={"0px"}
                mr={"0px"}
                bgcolor={buttonColor}
                minwidth={"130px"}
                disabled={false}
                onClick={()=>{}}
            >start recording</SmallButton>
        </Box>  

    );
};

export default React.memo(ButtomMenu);