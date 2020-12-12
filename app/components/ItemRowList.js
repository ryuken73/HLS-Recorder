import React from 'react';
import Box from '@material-ui/core/Box'
import ItemRow from './ItemRow';

const itemNumbers = [1,2,3,4]

const ItemRowList = () => {
    return (
        <Box>
            {itemNumbers.map(item => {
                return <ItemRow key={item}></ItemRow>
            })}
        </Box>
    );
};

export default React.memo(ItemRowList);