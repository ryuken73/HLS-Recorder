import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function AlertDialog(props) {
  console.log('*********', props)
  const {open, reloadWaitSeconds=5000} = props;
  const [remainSeconds, setRemainSeconds] = React.useState(parseInt((reloadWaitSeconds/1000).toFixed(0)));
  const [timer, setTimer] = React.useState(null);
  console.log('*********', parseInt((reloadWaitSeconds/1000).toFixed(0)))

  if(remainSeconds === 0) {
    clearInterval(timer);
  }
  React.useEffect(() => {
    const timer = setInterval(() => {
        setRemainSeconds(previousRemainSeconds => {
            return previousRemainSeconds - 1
        })
    },1000)
    setTimer(timer);
  },[])

  return (
    <div>
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Too Large Memory Used!"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Automatically reloaded after {remainSeconds} seconds!
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
}