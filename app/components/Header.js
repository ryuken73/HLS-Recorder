import React from 'react';
import Box from '@material-ui/core/Box'
import BorderedBox from './template/BorderedBox';
import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';
import SettingsIcon from '@material-ui/icons/Settings';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
const {remote} = require('electron');

const Header = (props) => {
    const {setConfirmOpen} = props;
    const {BASE_DIRECTORY="c:/temp"} =  props.config;
    console.log('$$$$', BASE_DIRECTORY)

    const {openOptionsDialog} = props.OptionDialogActions;
    const openDialog = React.useCallback(() => {
        openOptionsDialog();
        // setOptionsDialogOpen({dialogOpen:true})
    },[])
    const reload = React.useCallback(() => {
        setConfirmOpen(true);
        // remote.getCurrentWebContents().reload();
    },[])
    const openDirectory = React.useCallback(() => {
        // remote.shell.showItemInFolder(BASE_DIRECTORY)
        remote.shell.openItem(BASE_DIRECTORY)
    },[BASE_DIRECTORY])
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
            <Box display="flex" width="100px">
                <Box>
                    <IconButton aria-label="configuration" onClick={reload}>
                        <RefreshIcon 
                            fontSize="large"
                            style={{color:"grey"}}
                        ></RefreshIcon>
                    </IconButton>
                </Box>
                <Box mr="auto">
                    <IconButton aria-label="configuration" onClick={openDirectory}>
                        <FolderOpenIcon 
                            fontSize="large"
                            style={{color:"grey"}}
                        ></FolderOpenIcon>
                    </IconButton>
                </Box>
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
            <Box display="flex" width="100px">
                <Box ml="auto">
                    <IconButton aria-label="configuration" onClick={openDialog}>
                        <SettingsIcon 
                            fontSize="large"
                            style={{color:"grey"}}
                        ></SettingsIcon>
                    </IconButton>
                </Box>
            </Box>
        </Box>  

    );
};

export default React.memo(Header);