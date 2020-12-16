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

const RegisterDialog = (props) => {

  const [isOpen, setIsOpen] = useState(true)
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false)
  const [newUser, setNewUser] = useState({
    firstName: null,
    surname: null,
    email: null,
    password: null,
    passwordCheck: null
  })

  const onChange = (e) => {
    setNewUser({ ...newUser, [e.target.id]: e.target.value })
  }

  const checkPassword = (passwordToBeChecked) => {
    if (newUser.password == passwordToBeChecked || newUser.passwordCheck == passwordToBeChecked) {
        setIsPasswordCorrect(true)
    }
    else {
        setIsPasswordCorrect(false)
    }
  }

  const addNewUser = async() => {

    try {
      let result = await axios.post("http://localhost:4000/adduser", { firstName: newUser.firstName, surname: newUser.surname, email: newUser.email, password: newUser.password })
    
      if (result.status == 200) {
        props.alertFeedback(result.data.message, result.data.severity)
      }
    } catch (error) {
      props.alertFeedback(error.message, "error")
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
            id = "firstName"
            label = "Etunimi"
            type = "text"
            variant = "outlined"
            fullWidth = "true"
            onChange = {(e) => onChange(e)}
          />
          <TextField
            autoComplete = "off"
            margin = "dense"
            id = "surname"
            label = "Sukunimi"
            type = "text"
            variant = "outlined"
            fullWidth = "true"
            onChange = {(e) => onChange(e)}
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
            onChange = {(e) => onChange(e)}
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
            onChange = {(e) => {onChange(e); checkPassword(e.target.value)}}
          />
          <TextField
            autoComplete = "off"
            required
            error = {!isPasswordCorrect}
            margin = "dense"
            id = "passwordCheck"
            label = "Anna salasanasi uudestaan"
            type = "password"
            variant = "outlined"
            fullWidth = "true"
            onChange = {(e) => {onChange(e); checkPassword(e.target.value)}}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick = {() => {setIsOpen(false); props.dialogClosed()}} color = "primary">
            Peruuta
          </Button>
          <Button onClick = {() => {setIsOpen(false); addNewUser(); props.dialogClosed()}} color = "primary" disabled = {!isPasswordCorrect}>
            Rekisteröidy
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default RegisterDialog