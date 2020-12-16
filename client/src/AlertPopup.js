import { Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import React from 'react';
import { useState } from 'react';

/* function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
} */

const AlertPopup = (props) => {

    const [isAlertOpen, setIsAlertOpen] = useState(true)

    return (
        <div>
            <Snackbar open = {isAlertOpen} autoHideDuration = {6000} onClose = {() => {setIsAlertOpen(false); props.alertClosed()}}>
                <MuiAlert elevation={6} variant="filled" severity = {props.alertFeedback.severity} onClose = {() => {setIsAlertOpen(false); props.alertClosed()}}>
                    { props.alertFeedback.message }
                </MuiAlert>
            </Snackbar>
        </div>
    )
}

export default AlertPopup