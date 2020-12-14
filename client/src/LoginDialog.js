import React from 'react';
import { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const LoginDialog = (props) => {

  const [isOpen, setIsOpen] = useState(true)
  const [newName, setNewName] = useState("")

  const newExamNameChanged = (newName) => {
    setNewName(newName)
  }

  return (
    <div>
      <Dialog open = {isOpen} onClose = {() => {setIsOpen(false); props.dialogClosed()}} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Uuden tentin nimi</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Anna uuden tentin nimi ja valitse sitten OK
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="newExamNameTextField"
            label="Tentin Nimi"
            type="text"
            fullWidth
            onChange = {(event) => newExamNameChanged(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {setIsOpen(false); props.dialogClosed()}} color="primary">
            Peruuta
          </Button>
          <Button onClick={() => {setIsOpen(false); props.dispatch(newName); props.dialogClosed()}} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default LoginDialog