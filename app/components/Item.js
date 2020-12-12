import React from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import ProgressWithPercent from './template/ProgressWithPercent';
import {SmallButton, SmallMarginTextField} from './template/smallComponents';
import utils from '../utils';

const {shell} = require('electron').remote;

const TextBox = ({children, ...props}) => {
    const defaultProps = {
        mx: "10px",
        fontSize: 12,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
    }
    const mergedProps = {
        ...defaultProps,
        ...props
    }
    return (<Box {...mergedProps}>{children}</Box>)
}
export default function Item(props){
    const imageShow = false;
    const {fname, savePath, url, totalBytes, receivedBytes, status, downloadStartTime} = props.item;
    const processedPercent = parseInt(((receivedBytes/totalBytes) * 100).toFixed(0));
    const onClickCheckBox = () => {};
    const onClickOpen = event => {
        // shell.openItem(savePath)
        shell.showItemInFolder(savePath)
      }
    return (
        <Box display="flex" width="0.9" flexWrap="nowrap" justifyContent="flex-start" alignItems="center">
            <Checkbox color="primary" checked={imageShow} onChange={onClickCheckBox}>Image Show</Checkbox>
            <Grid container wrap="nowrap" spacing={1} alignItems="center">
                <Grid item lg={2} sm={2}>
                    <TextBox>
                        {fname}
                    </TextBox>
                </Grid>
                {/* <Grid item lg={2}>
                    <TextBox>
                        {savePath}
                    </TextBox>
                </Grid> */}
                <Grid item lg={1}>
                    <Box mx="10px">
                        <SmallButton size="small" color="primary" variant={"contained"} onClick={onClickOpen}>open</SmallButton>
                    </Box>
                </Grid>
                <Grid item  lg={2} md={2} sm={2}>
                    <Box mx="10px">
                        <ProgressWithPercent progress={processedPercent}></ProgressWithPercent>
                    </Box>
                </Grid>
                <Grid item lg={2}>
                    <Box mx="10px">
                        <Typography variant="caption">{utils.number.niceBytes(receivedBytes)} / {utils.number.niceBytes(totalBytes)}</Typography>
                    </Box>
                </Grid>
                <Grid item lg={2}>
                    <TextBox>
                        {new Date(downloadStartTime).toLocaleString()}
                    </TextBox>
                </Grid>
                <Grid>
                    <Box mx="10px">
                        <Typography variant="caption">{status}</Typography>
                    </Box>
                </Grid>
            </Grid>

        </Box>
    )
}