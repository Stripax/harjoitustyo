import React from 'react';
import { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const RegisterDialog = (props) => {

  const [isOpen, setIsOpen] = useState(true)
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false)
  const [firstName, setFirstName] = useState(null)
  const [surname, setSurname] = useState(null)
  const [email, setEmail] = useState(null)
  const [password, setPassword] = useState(null)
  const [passwordCheck, setPasswordCheck] = useState(null)

  const firstNameChanged = (fname) => {
    setFirstName(fname)
  }

  const surnameChanged = (sname) => {
    setSurname(sname)
  }

  const emailChanged = (email) => {
    setEmail(email)
  }

  const passwordChanged = (password) => {
    setPassword(password)
  }

  const passwordCheckupChanged = (secondPassword) => {
    setPasswordCheck(secondPassword)
  }

  const checkPassword = (passwordToBeChecked) => {
    if (password == passwordToBeChecked || passwordCheck == passwordToBeChecked) {
        setIsPasswordCorrect(true)
    }
    else {
        setIsPasswordCorrect(false)
    }
  }

  return (
    <div>
      <Dialog open = {isOpen} onClose = {() => {setIsOpen(false); props.dialogClosed()}} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Rekisteröidy</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Syötä etu- sekä sukunimi, sähköpostiosoite sekä salasanasi
          </DialogContentText>
          <TextField
            autoComplete = "off"
            margin = "dense"
            id = "etunimi"
            label = "Etunimi"
            type = "text"
            variant = "outlined"
            fullWidth = "true"
            onChange = {(event) => firstNameChanged(event.target.value)}
          />
          <TextField
            autoComplete = "off"
            margin = "dense"
            id = "sukunimi"
            label = "Sukunimi"
            type = "text"
            variant = "outlined"
            fullWidth = "true"
            onChange = {(event) => surnameChanged(event.target.value)}
          />
          <TextField
            autoComplete = "off"
            required
            margin = "dense"
            id = "email"
            label = "Sähköpostiosoite"
            type = "text"
            variant = "outlined"
            fullWidth = "true"
            onChange = {(event) => emailChanged(event.target.value)}
          />
          <TextField
            autoComplete = "off"
            required
            margin = "dense"
            id = "password"
            label = "Salasana"
            type = "password"
            variant = "outlined"
            fullWidth = "true"
            onChange = {(event) => {passwordChanged(event.target.value); checkPassword(event.target.value)}}
          />
          <TextField
            autoComplete = "off"
            required
            error = {!isPasswordCorrect}
            margin = "dense"
            id = "passwordCheckup"
            label = "Anna salasanasi uudestaan"
            type = "password"
            variant = "outlined"
            fullWidth = "true"
            onChange = {(event) => {passwordCheckupChanged(event.target.value); checkPassword(event.target.value)}}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick = {() => {setIsOpen(false); props.dialogClosed()}} color = "primary">
            Peruuta
          </Button>
          <Button onClick = {() => {setIsOpen(false); props.dispatch(firstName, surname, email, password); props.dialogClosed()}} color = "primary" disabled = {!isPasswordCorrect}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default RegisterDialog