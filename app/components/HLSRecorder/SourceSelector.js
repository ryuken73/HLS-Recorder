import React from 'react';
import OptionSelectList from '../template/OptionSelectList';

function Selection(props) {
    const {
        channelNumber=1,
        source={}, 
        sources=[], 
        recorderStatus='stopped'
    } = props;
    const {setHttpSource=()=>{}} = props.HLSPlayersActions;
    const currentUrl = source.url;
    const inRecording = recorderStatus !== 'stopped';
    const selectItems = sources.map(source => {
        return {
            value: source.url,
            label: source.title
        }
    })
    const onChangeSelect = React.useCallback((event) => {
        const url = event.target.value;
        const sourceNumber = sources.findIndex(source => source.url === url);
        setHttpSource({channelNumber, sourceNumber});
    }, [setHttpSource])

    return (
        <OptionSelectList 
            subtitle='source'
            titlewidth={"80px"}
            minWidth='200px'
            currentItem={currentUrl}
            multiple={false}
            menuItems={selectItems}
            // onChangeSelect={onChange('url')} 
            onChangeSelect={onChangeSelect} 
            smallComponent={true}
            bgcolor={'#232738'}
            selectColor={"#2d2f3b"}
            disabled={inRecording}
            mb={"2px"}
        ></OptionSelectList>
    )
}

export default React.memo(Selection)