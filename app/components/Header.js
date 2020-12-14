import React from 'react';
import Box from '@material-ui/core/Box'
import BorderedBox from './template/BorderedBox';
import IconButton from '@material-ui/core/IconButton';
import SettingsIcon from '@material-ui/icons/Settings';

const Header = () => {
    return (      
        <Box 
            display="flex" 
            alignItems="center"
            bgcolor="#2d2f3b"
            mx="5px"
            mt="15px"
            alignContent="center"
            justifyContent="space-between"
        >
            <Box width="100px">
                
            </Box>
            <Box 
                fontFamily="Roboto, Helvetica, Arial, sans-serif" 
                textAlign="center" 
                fontSize="35px"
                // mx="5px"
                // mt="15px"
                // py="10px"
                // width="95%"
            >CCTV Recorder
            </Box>
            <Box width="100px">
                <IconButton aria-label="configuration">
                    <SettingsIcon 
                        fontSize="large"
                        style={{color:"grey"}}
                    ></SettingsIcon>
                </IconButton>
            </Box>
        </Box>  

    );
};

export default React.memo(Header);