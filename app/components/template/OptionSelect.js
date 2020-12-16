import React from 'react'
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import BorderedList from './BorderedList';
import {SmallPaddingSelect}  from './smallComponents';


export default function OptionSelectList(props) {
    const {
        maxWidth="100%", 
        minWidth="30%", 
        currentItem="currentItem", 
        menuItems=[{label:'title', value:'good'}]
    }=props;
    const {
        onChangeSelect=()=>{}, 
        multiple=false, 
        selectColor="white", 
        disabled=false
    } = props;
    const {smallComponent=true} = props;
    const SelectComponent = smallComponent ? SmallPaddingSelect : Select;

    return (
        <React.Fragment>
        <FormControl style={{minWidth:minWidth, width:"100%", maxWidth:maxWidth}}>
            <SelectComponent
                labelId="select-label" 
                variant="outlined"
                margin="dense"
                value={currentItem}
                multiple={multiple}
                onChange={onChangeSelect}
                bgcolor={selectColor}
                disabled={disabled}
            >
                {menuItems.map((menuItem, index) => {
                    const {value, label} = menuItem;
                    return <MenuItem key={index} value={value}>{label}</MenuItem>
                })}
            </SelectComponent>
        </FormControl>
    </React.Fragment>
    )
}
