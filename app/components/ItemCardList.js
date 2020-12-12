import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ItemCard from './ItemCard';

export default function ItemCardList(props) {
  const {cardItems} = props;
  const {delCardItem} = props.CardListActions;
  console.log('$$$$$$$$$$$$$$$$$$$$$$',cardItems)
  return (
    <Box display="flex" flexWrap="nowrap" flexGrow={0} overflow="hidden" m="2px"> 
      {[...cardItems].reverse().map(([cardId, cardItem]) => {
        return <ItemCard key={cardId} cardItem={cardItem} delCardItem={delCardItem}></ItemCard>
      })}
    </Box>
  );
}