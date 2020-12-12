import React from 'react';
import Box from '@material-ui/core/Box'
import CloseIcon from '@material-ui/icons/Close';
import ErrCount from './ErrCount';
import Duration from './Duration';
import TitleInput from './TitleInput';
import UrlInput from './UrlInput';
import {SmallButton, SmallPaddingIconButton, SmallPaddingButton}  from '../template/smallComponents';

const ItemRow = () => {
    const deleteClip = React.useCallback(() => {},[]);
    return (
        <Box display="flex" width="1" my="3px" alignItems="center">
            <SmallPaddingIconButton onClick={deleteClip} padding="1px" size="small">
                <CloseIcon fontSize={"small"}></CloseIcon>
            </SmallPaddingIconButton>
            <ErrCount></ErrCount>
            <Duration></Duration>
            <TitleInput></TitleInput>
            <UrlInput></UrlInput>
        </Box>
    );
};

export default React.memo(ItemRow);