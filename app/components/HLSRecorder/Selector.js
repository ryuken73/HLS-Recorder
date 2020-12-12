import React from 'react';
import OptionSelectList from '../template/OptionSelectList';

function Selection(props) {
    const {
        currentUrl='', 
        cctvs=[], 
        recorderStatus='stopped'
    } = props;
    const {onChange=()=>{}} = props;
    const inRecording = recorderStatus !== 'stopped';
    const selectItems = cctvs.map(cctv => {
        return {
            value: cctv.url,
            label: cctv.title
        }
    })
    const onChangeSelect = React.useCallback((event) => {
        onChange('url')(event);
        onChange('title')(event);
    }, [onChange])

    return (
        <OptionSelectList 
            subtitle='cctv'
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