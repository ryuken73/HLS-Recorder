import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import BorderedBox from './template/BorderedBox';
import ItemListContainer from '../containers/ItemListContainer';
import { Typography } from '@material-ui/core';
import styled from 'styled-components';

const StyledAppBar = styled(AppBar)`
    //  max-width: 100%;
    // min-width: 900px;
`
const StyledTab = styled(Tab)`
    min-width: unset;
`

function TabPanel(props){
    console.log('render TabPanel:', props)
    const {value, index} = props;
    const hidden = (value === index) ? false : true;
    return (
        <ItemListContainer
            tabId = {index}
            hidden = {hidden}
        >
        </ItemListContainer>
    )
}

const stopPropagation = (event) => {
    event.stopPropagation();
}

function ItemTab(props) { 
    console.log('!!!!!!!!!!!!!!!',props);
    
    // const {currentTabId, pageItems=new Map([[1,{}], [2,{}]]), pageTitles=[[1,'page1'],[2,'page2']]} = props;
    const {currentTabId, tabItems} = props;
    const tabIds = [...tabItems.keys()];
    // const {setCurrentTab, setAllImageCheck} = props.ImageActions;
    // const onChange = React.useCallback((event, newValue) => {
    //     setCurrentTab(newValue);
    // }, [setCurrentTab]);

    const onChange = () => {};

    const onClickPanel = () => {
        // setAllImageCheck(false);
    }

    return (
        <BorderedBox  alignContent="center"  bgcolor="black" alignItems="flex-start" flexGrow="1" minWidth="auto" flexBasis="0" overflow="auto" onClick={onClickPanel}> 
            <BorderedBox display='flex' alignContent="center" alignItems="flex-start" flexGrow="1" border="1" minWidth="auto" flexBasis="0" overflow="hidden" onClick={stopPropagation}>
                <StyledAppBar position="static" color="primary">
                    <Tabs
                        value={currentTabId}
                        onChange={onChange}
                        indicatorColor="primary"
                        variant="scrollable"
                        scrollButtons="on"
                        aria-label="scrollable auto tabs"
                    >
                        {tabIds.map(tabId => {
                            const tabTitle = tabId;
                            const items = tabItems.get(tabId);
                            const tabItemCount = items.length || 0;
                            return <StyledTab key={tabId} value={tabId} label={tabId + ` [${tabItemCount}]`} aria-controls={`tabpanel-${tabId}`} wrapped></StyledTab>                                        
                        })}

                    </Tabs>
                </StyledAppBar>
            </BorderedBox>
            {[...tabItems].map(tabItem => {
                const [tabId, item] = tabItem;
                return <TabPanel value={currentTabId} key={tabId} index={tabId}></TabPanel>                

            })}
        </BorderedBox>
        )
}

export default React.memo(ItemTab);
