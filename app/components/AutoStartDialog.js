import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
const {remote} = require('electron');


function AutoStartDialog(props) {
  console.log('*********', props)
  const {open, scheduleStartDelay=5000, setAutoStartDialogOpen} = props;
  const {startScheduleAll} = props.HLSRecorderActions;
  const [remainSeconds, setRemainSeconds] = React.useState(parseInt((scheduleStartDelay/1000).toFixed(0)));
  const [timer, setTimer] = React.useState(null);
  
  if(remainSeconds === 0) {
    clearInterval(timer);
    startScheduleAll()
    .then(() => {
      setAutoStartDialogOpen(false);
    })
  }
  
  React.useEffect(() => {
    const timer = setInterval(() => {
        setRemainSeconds(previousRemainSeconds => {
            return previousRemainSeconds - 1
        })
    },1000)
    setTimer(timer);
  },[])

  const dialogMessage = remainSeconds === 0 ? 
                        "Now Waiting for recorder's start..." : 
                        `Automatically start schedule after ${remainSeconds} seconds!`

  return (
    <div>
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Automatic Schedule Start!"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialogMessage}
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default React.memo(AutoStartDialog)