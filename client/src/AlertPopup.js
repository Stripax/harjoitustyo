import { Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import Slide from '@material-ui/core/Slide';
import React from 'react';
import { useState } from 'react';

const AlertPopup = (props) => {

  const [isAlertOpen, setIsAlertOpen] = useState(props.open)

  return (
    <div>
      <Snackbar 
        open = { isAlertOpen }
        autoHideDuration = { 6000 }
        anchorOrigin = {{ horizontal: "left", vertical: "bottom" }}
        TransitionComponent = { Slide }
        transitionDuration = {{ enter: 800, exit: 1200 }}
        TransitionProps = {{ direction: "up" }}
        onExiting = {() => {props.closed(); setIsAlertOpen(false)}}
        onClose = {() => setIsAlertOpen(false)}>
          
          <MuiAlert
            elevation = {6}
            variant = "filled"
            closeText = "Sulje ikkuna"
            severity = { props.alertFeedback.severity }
            onClose = {() => setIsAlertOpen(false)}
          >
            { props.alertFeedback.message }
          </MuiAlert>
      </Snackbar>
    </div>
  )
}

export default AlertPopup