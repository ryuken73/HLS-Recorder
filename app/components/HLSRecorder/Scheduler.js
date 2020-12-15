import React from 'react';
import OptionSelectButton from '../template/OptionSelectButton';
import ScheduleButton from './ScheduleButton';
import log from 'electron-log';

const intervals = [
    {title: '1 Hour', milliseconds: 3600000},
    {title: '30 Minutes', milliseconds: 1800000},
    {title: '20 Minutes', milliseconds: 1200000},
    {title: '10 Minutes', milliseconds: 600000},
    {title: '5 Minutes', milliseconds: 300000},
    {title: '1 Minute', milliseconds: 60000}
]

function IntervalSelection(props) {
    const {
        channelNumber=1,
        scheduleInterval=3600000, 
        recorderStatus="stopped"
    } = props;
    const {
        inTransition=false, 
        scheduleStatus="stopped", 
        scheduledFunction=()=>{}
    } = props;
    const {
        startSchedule=()=>{}, 
        stopSchedule=()=>{},
        setScheduleInterval=()=>{}
    } = props.HLSRecorderActions;

    const inRecording = recorderStatus !== 'stopped';
    const selectItems = intervals.map(interval => {
        return {
            value: interval.milliseconds,
            label: interval.title
        }
    })

    const onChangeSelect = (event) => {
        setScheduleInterval({channelNumber, scheduleInterval:event.target.value})
    }

    const ButtonElement = () => {
        return <ScheduleButton
                    channelNumber={channelNumber}
                    inTransition={inTransition}
                    scheduleStatus={scheduleStatus} 
                    scheduledFunction={scheduledFunction}
                    startSchedule={startSchedule}
                    stopSchedule={stopSchedule}
                >
                </ScheduleButton>
    } 

    return (
        <OptionSelectButton 
            // subtitle='CCTV'
            // titlewidth={"115px"}
            FrontButton={ButtonElement}
            // width="100%"
            currentItem={scheduleInterval}
            multiple={false}
            menuItems={selectItems}
            onChangeSelect={onChangeSelect} 
            smallComponent={true}
            bgcolor={'#232738'}
            selectColor={"#2d2f3b"}
            disabled={inRecording}
            mb={"2px"}
            mt={"4px"}
        ></OptionSelectButton>
    )
}

export default  React.memo(IntervalSelection)