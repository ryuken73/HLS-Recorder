import React from 'react';
import Box from '@material-ui/core/Box';
import RefreshIcon from '@material-ui/icons/Refresh';
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import {SmallPaddingIconButton}  from '../../template/smallComponents';

const Controls = props => {
    const {
        refreshPlayer=()=>{},
    } = props;
    return (
        <Box display="flex" flexDirection="column" mr="3px">
            <SmallPaddingIconButton padding="1px" size="small">
                <RefreshIcon color="primary" fontSize={"small"} onClick={refreshPlayer}></RefreshIcon>
            </SmallPaddingIconButton>
            <SmallPaddingIconButton padding="1px" size="small">
                <FiberManualRecordIcon color="primary" fontSize={"small"} onClick={refreshPlayer}></FiberManualRecordIcon>
            </SmallPaddingIconButton>
            <SmallPaddingIconButton padding="1px" size="small">
                <AccessAlarmIcon color="primary" fontSize={"small"} onClick={refreshPlayer}></AccessAlarmIcon>
            </SmallPaddingIconButton>
        </Box>
    );
};

export default React.memo(Controls);