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

const LoginDialog = (props) => {

  const [isOpen, setIsOpen] = useState(props.open)
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  })

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

  const onChange = (e) => {
    setLoginData({ ...loginData, [e.target.id]: e.target.value })
  }

  const login = async() => {

    try {
      let result = await axios.post(path + "login/", { email: loginData.email, password: loginData.password })

      if (result.status == 200) {
        props.alertFeedback(result.data.message, result.data.severity)
        props.isLoginSuccessful(result.data.isLoginSuccessful)

        if (result.data.isLoginSuccessful) {
          props.userId(result.data.userId)
        }
      }
    
    } catch (error) {
      props.alertFeedback(error.message, "error")
    }
  }

  return (
    <div>
      <Dialog
        open = { isOpen }
        TransitionComponent = { Zoom }
        transitionDuration = {{ enter: 700, exit: 500 }}
        onExited = {() => {props.closed(); setIsOpen(false)}}
        onClose = {() => setIsOpen(false)}
        aria-labelledby="form-dialog-title">
        
        <DialogTitle id = "form-dialog-title">Sisäänkirjautuminen</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Syötä sähköpostiosoitteesi sekä salasanasi
          </DialogContentText>
          <TextField
            autoFocus
            required
            autoComplete = "off"
            margin = "dense"
            id = "email"
            label = "Sähköpostiosoite"
            type = "text"
            fullWidth
            onChange = {(e) => onChange(e)}
          />
          <TextField
            required
            autoComplete = "off"
            margin = "dense"
            id = "password"
            label = "Salasana"
            type = "password"
            fullWidth
            onChange = {(e) => onChange(e)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsOpen(false)} color = "primary">
            Peruuta
          </Button>
          <Button onClick={() => {setIsOpen(false); login()}} disabled = { loginData.email.length < 1 || loginData.password.length < 1 } color = "primary">
            Kirjaudu
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default LoginDialog