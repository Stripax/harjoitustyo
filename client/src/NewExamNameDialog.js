import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Zoom from '@material-ui/core/Zoom';

const NewExamNameDialog = (props) => {

  const [isOpen, setIsOpen] = useState(true)
  const [newName, setNewName] = useState("")

  const newExamNameChanged = (newName) => {
    setNewName(newName)
  }

  var path = null

  switch (process.env.NODE_ENV) {
    case 'production':
      path = "https://exam-program.herokuapp.com/" 
      break
    case 'development':
      path = "http://localhost:4000/"
      break
    case 'test':
      path = "http://localhost:4000/"
      break
    default:
      throw "Environment not set properly!"
  }

  const addNewExam = async() => {
    
    try {
      let result = await axios.post(path + "exam/", { examName: newName, examScore: 100, startdate: "2021-01-01", enddate: "2022-01-01" })

      if (result.data.id > 0) {
        props.alertFeedback(result.data.message, result.data.severity)
        props.dispatch(newName)
      }
    }

    catch(error) {
      props.alertFeedback(error.message, "error")
    }
  }

  return (
    <div>
      <Dialog
        open = { isOpen }
        TransitionComponent = { Zoom }
        transitionDuration = {{ enter: 500, exit: 300 }}
        onExiting = {() => { props.closed(); setIsOpen(false) }}
        onClose = {() => { setIsOpen(false); props.closed() }}
        aria-labelledby="form-dialog-title">

        <DialogTitle id="form-dialog-title">Uuden tentin nimi</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Anna uuden tentin nimi ja valitse sitten OK
          </DialogContentText>
          <TextField
            autoFocus
            autoComplete = "off"
            margin="dense"
            id="newExamNameTextField"
            label="Tentin Nimi"
            type="text"
            fullWidth
            onChange = {(event) => newExamNameChanged(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsOpen(false)} color="primary">
            Peruuta
          </Button>
          <Button onClick={() => {setIsOpen(false); addNewExam()}} disabled = { newName.length < 1 } color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default NewExamNameDialog