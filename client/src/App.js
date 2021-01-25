import React from 'react';
import { useState, useEffect, useReducer } from 'react';
import { v4 as uuid } from 'uuid';
import axios from 'axios';
import './App.css';
import LocalizedStrings from 'react-localization'
import {useDropzone} from 'react-dropzone'
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import { FormControlLabel } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import { DeleteForeverOutlined } from '@material-ui/icons';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import NewExamNameDialog from './NewExamNameDialog';
import TestResultsDemo from './TestResultsDemo';
import RegisterDialog from './RegisterDialog';
import LoginDialog from './LoginDialog';
import AlertPopup from './AlertPopup';
import DragDrop from './DragDrop'
import Chat from './Chat'

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

function reducer(state, action) {
  let deepCopy = JSON.parse(JSON.stringify(state))
  let examId = deepCopy.findIndex(exam => exam.id == action.activeExam)

  switch(action.type) {
    case 'changeQuestion':
      deepCopy[action.data.activeExam].questions[action.data.questionIndex].question = action.data.newQuestionText
      return deepCopy

    case 'changeAnswerText':
      deepCopy[action.data.activeExam].questions[action.data.questionIndex].choices[action.data.answerIndex].answer = action.data.newAnswerText
      return deepCopy
    
    case 'changeCorrectAnswer':
      deepCopy[action.data.activeExam].questions[action.data.questionIndex].choices[action.data.answerIndex].isCorrect = action.data.checked
      return deepCopy

    case 'deleteQuestion':
      deepCopy[action.data.activeExam].questions.splice(action.data.questionIndex, 1)
      return deepCopy

    case 'deleteAnswer':
      deepCopy[action.data.activeExam].questions[action.data.questionIndex].choices.splice(action.data.answerIndex, 1)
      return deepCopy

    case 'addExam':
      let newExam = { id: null, exam_name: action.newExamName, exam_score: null, exam_startdate: null, exam_enddate: null, min_points: null, grade_limits: null }

      const addNewExam = async() => {

        try {
          let result = await axios.post(path + "exam", { exam_name: action.newExamName })
          newExam.id = result.request.response
        }
        catch (ex) {
          alert(ex.message)
        }
      }

      addNewExam()
      deepCopy.push(newExam)
      return deepCopy

    case 'addQuestion':
      let newQuestion = { id: uuid(), question: "", choices: [] }
      deepCopy[action.data.activeExam].questions.push(newQuestion)
      return deepCopy

    case 'addAnswer':
      let newAnswer = { id: uuid(), answer: "", isSelected: false, isCorrect: false }
      deepCopy[action.data.activeExam].questions[action.data.questionIndex].choices.push(newAnswer)
      return deepCopy

    case 'checkBoxClicked':
      
      const checkBoxClicked = async() => {

        try {
          let result = await axios.put(path + "checkbox", { answer_id: action.data.answerId, checked: action.data.checked })
        }
        catch (ex) {
          alert(ex.message)
        }
      }

      checkBoxClicked()
      deepCopy[examId].questions[action.data.questionIndex].choices[action.data.answerIndex].is_selected = action.data.checked
      return deepCopy

    case 'getQuestions':
      let examQuestions = []

      action.data.forEach(question => {
        examQuestions.push(question)
      })

      deepCopy[examId]["questions"] = examQuestions      
      return deepCopy

      case 'getQuestionChoices':
      let questionChoices = []

      action.data.forEach(choice => {
        questionChoices.push(choice)
      })

      for (var i = 0; i < deepCopy[examId].questions.length; i++) {
        deepCopy[examId].questions[i]["choices"] = questionChoices.filter(choice => choice.question_id == deepCopy[examId].questions[i].id)
      }

      return deepCopy
    
    case 'getExamNames':
      return action.data

    default: 
      throw new Error()
  }
}

function App() {

  const [state, dispatch] = useReducer(reducer, [])
  const [activeExam, setActiveExam] = useState(-1)
  const [userId, setUserId] = useState(0)
  const [alertMessage, setAlertMessage] = useState({ message: "", severity: "" })
  const [isDataInitialized, setIsDataInitialized] = useState(false)
  const [isQuestionsInitialized, setIsQuestionsInitialized] = useState(false)
  const [isQuestionChoicesInitialized, setIsQuestionChoicesInitialized] = useState(false)
  const [isShowCorrectAnswers, setIsShowCorrectAnswers] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isNewExamNameDialogOpen, setIsNewExamNameDialogOpen] = useState(false)
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false)
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false)
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [isDemoShown, setIsDemoShown] = useState(false)
  const [isChatWindowOpen, setIsChatWindowOpen] = useState(false)

  const connection = new WebSocket("ws://localhost:8080")

  useEffect (() => {

    const fetchData = async() => {

      try {
        let resultExams = await axios.get(path + "exams")

        if (resultExams.data.length > 0) {
          dispatch({ type: 'getExamNames', data: resultExams.data })
          setIsDataInitialized(true)
        }
      }
      catch (ex) {
        setAlertMessage({message: ex.message, severity: "error"})
        setIsAlertOpen(true)
      }
    }

    fetchData()
  }, [])

  useEffect (() => {
    if (activeExam >= 0) {

      const fetchData = async() => {

        try {
          let resultQuestions = await axios.get(path + "questions/" + activeExam)
          let resultChoices = await axios.get(path + "answers/" + activeExam)

          if (resultQuestions.data.length > 0) {
            dispatch({ type: 'getQuestions', data: resultQuestions.data, activeExam: activeExam })
            setIsQuestionsInitialized(true)
          }

          if (resultChoices.data.length > 0) {
            dispatch({ type: 'getQuestionChoices', data: resultChoices.data, activeExam: activeExam })
            setIsQuestionChoicesInitialized(true)
          }
        }
        catch (ex) {
          alert(ex.message)
        }
      }

      fetchData()
      setIsShowCorrectAnswers(false)
    }
  }, [activeExam])

  // ------------------ ADMIN PART OF THE CODE ----------------------------

 /*  const editQuestions = () => {
    if (activeExam >= 0) {
      return state[activeExam].questions.map((item, questionIndex) =>
        <Paper key = {item.id} className = "edit-questions">
          <Button color = "secondary" startIcon = {<DeleteForeverOutlined />} onClick = {() => dispatch({ type: 'deleteQuestion', data: { activeExam: activeExam, questionIndex: questionIndex }}) }></Button>
          <input type = "text" size = "50" value = {item.question} onChange = {(event) => dispatch({ type: 'changeQuestion', data: { activeExam: activeExam, newQuestionText: event.target.value, questionIndex: questionIndex }})} />          
          <br></br>
          { item.choices.map((i, answerIndex) => 
            <div>
              <GreenCheckbox checked = {i.isCorrect} onClick = {(event) => dispatch({ type: 'changeCorrectAnswer', data: { checked: event.target.checked, activeExam: activeExam, questionIndex: questionIndex, answerIndex: answerIndex }})}></GreenCheckbox>
              <input key = {i.id} type = "text" size = "50" value = {i.answer} onChange = {(event) => dispatch({ type: 'changeAnswerText', data: { activeExam: activeExam, newAnswerText: event.target.value, questionIndex: questionIndex, answerIndex: answerIndex}})} />
              <Button startIcon = {<DeleteForeverOutlined />} onClick = {() => dispatch({ type: 'deleteAnswer', data: { activeExam: activeExam, questionIndex: questionIndex, answerIndex: answerIndex }})}></Button>
              <br></br>
            </div>
          ) }
          <Button key = {uuid()} startIcon = {<AddCircleOutlineIcon />} onClick = {() => dispatch({ type: 'addAnswer', data: { activeExam: activeExam, questionIndex: questionIndex }})}></Button>
        </Paper>)
    }
  } */

  // ------------------- USER PART OF THE CODE ---------------------------

  const showExamButtons = () => {

    if (isDataInitialized) {
      return state.map((item) => 
      <Button key = {uuid()} color = "primary" onClick = {() => {setActiveExam(Number(item.id)); setIsQuestionsInitialized(false); setIsQuestionChoicesInitialized(false)}}>{ item.exam_name }</Button>)
    }
  }
  
  const showQuestions = () => {
    let examId = state.findIndex(exam => exam.id == activeExam)

    if (isQuestionsInitialized && isQuestionChoicesInitialized && activeExam >= 0) {
      return state[examId].questions.map((item, questionIndex) =>
      <Paper key = {item.id} className = "question">
        <h2 className = "question-header">{ item.question_text }</h2>
        { item.choices.map((i, answerIndex) => 
          <div key = {i.id}>
            <FormControlLabel
              control = {<div>
              { isShowCorrectAnswers === false ? 
              <Checkbox checked = {i.is_selected} onClick = {(event) => dispatch({ type: 'checkBoxClicked', data: { checked: event.target.checked, questionId: item.id, questionIndex: questionIndex, answerId: i.id, answerIndex: answerIndex }, activeExam: activeExam})} /> : 
              <Checkbox color = "primary" checked = {i.is_selected} disabled /> }
              { isShowCorrectAnswers && <GreenCheckbox checked = {i.is_correct} disabled /> }
                      </div>}
            label = {i.answer_text} />
          </div>
        )}
      </Paper>)
    }
  }

  const GreenCheckbox = withStyles({
    root: {
      color: green[400],
      '&$checked': {
        color: green[600],
      },
    },
    checked: {},
  })((props) => <Checkbox color="default" {...props} />)

// EI TOIMI HALUTULLA TAVALLA
  const alertMessageBox = (msg, svr) => {
    setIsAlertOpen(true)
    setAlertMessage({ message: msg, severity: svr })
  }

  const logOut = () => {
    alertMessageBox("Kirjauduit ulos", "info")  
    setIsLoggedIn(false)
    setUserId(0)
  }

  const changeLanguage = () => {
    if (buttonTexts.getLanguage() == "fi") {
      buttonTexts.setLanguage('en')
      alertMessageBox("Language switched to English", "info")
    }
    else {
      buttonTexts.setLanguage('fi')
      alertMessageBox("Kieli vaihdettu suomeksi", "info")
    }
  }

  const buttonTexts = new LocalizedStrings({
    en: {
      chat: "Chat",
      info: "About",
      admin: "Admin",
      exams: "Show exams",
      signup: "Signup",
      signin: "Sign in",
      exit: "Exit"
    },
    fi: {
      chat: "Keskustelu",
      info: "Tietoa sovelluksesta",
      admin: "Järjestelmänvalvoja",
      exams: "Näytät tentit",
      signup: "Rekisteröidy",
      signin: "Kirjaudu",
      exit: "Poistu"
    }
  })

  return (
    <div className = "App">
      <div className = "header">
        <div className = "header-buttons">
          <Button key = {uuid()} color = "inherit" onClick = {() => changeLanguage()} disabled>FI / EN</Button>
          <Button key = {uuid()} color = "inherit" onClick = {() => window.open("https://www.youtube.com/watch?v=sAqnNWUD79Q", "_blank")}>{buttonTexts.info}</Button>
          <Button key = {uuid()} color = "inherit" onClick = {() => setIsChatWindowOpen(!isChatWindowOpen)}>{buttonTexts.chat}</Button>
          { !isLoggedIn && <Button key = {uuid()} color = "inherit" disabled>{buttonTexts.admin}</Button>}
          { isLoggedIn && <Button key = {uuid()} color = "inherit" onClick = {() => setActiveExam(-1)}>{buttonTexts.exams}</Button> }
          { !isLoggedIn && <Button key = {uuid()} color = "inherit" onClick = {() => setIsRegisterDialogOpen(true)}>{buttonTexts.signup}</Button> }
          { !isLoggedIn && <Button key = {uuid()} color = "inherit" onClick = {() => setIsLoginDialogOpen(true)}>{buttonTexts.signin}</Button> }
          { isLoggedIn && <Button key = {uuid()} color = "inherit" onClick = {() => logOut()}>{buttonTexts.exit}</Button> }
        </div>
      </div>

      <div className = "chat-window">
        { isChatWindowOpen && <Chat key = {uuid()} closed = {() => setIsChatWindowOpen(false)}></Chat> }
      </div>

      <div className = "login-register-dialogs">
        <RegisterDialog key = {uuid()} open = {isRegisterDialogOpen} closed = {() => setIsRegisterDialogOpen(false)} alertFeedback = {(message, severity) => {setIsAlertOpen(true); setAlertMessage({message: message, severity: severity})}}></RegisterDialog>
        <LoginDialog key = {uuid()} open = {isLoginDialogOpen} closed = {() => setIsLoginDialogOpen(false)} alertFeedback = {(message, severity) => {setIsAlertOpen(true); setAlertMessage({message: message, severity: severity})}} isLoginSuccessful = {(success) => setIsLoggedIn(success)} userId = {(id) => setUserId(id)}></LoginDialog>
        <AlertPopup key = {uuid()} open = {isAlertOpen} closed = {() => {setIsAlertOpen(false); setAlertMessage({message: "", severity: ""})}} alertFeedback = {{message: alertMessage.message, severity: alertMessage.severity}}></AlertPopup>
      </div>

      <div className = "exam-buttons">
        { isLoggedIn && showExamButtons() }
        { isAdmin && <Button key = {uuid()} color = "primary" startIcon = {<AddCircleOutlineIcon />} onClick = {() => setIsNewExamNameDialogOpen(true)}></Button> }
        { isNewExamNameDialogOpen && <NewExamNameDialog key = {uuid()} dialogClosed = {() => setIsNewExamNameDialogOpen(false)} dispatch = {(examName) => dispatch({ type: 'addExam', newExamName: examName })}></NewExamNameDialog> }
      </div>

      <div className = "main-body">
        <Grid container direction = "column" justify = "center" alignItems = "stretch">
          <Grid item xs = {12}>
            { !isAdmin && isQuestionsInitialized && showQuestions() }
            {/* { isAdmin && editQuestions() } */}
            { isAdmin && activeExam >= 0 && <Button key = {uuid()} startIcon = {<AddCircleOutlineIcon />} onClick = {() => dispatch({ type: 'addQuestion', activeExam: activeExam })}></Button> }
          </Grid>
        </Grid>
      </div>

      <div className = "answer-buttons">
        { activeExam >= 0 && !isAdmin && isQuestionsInitialized &&
          <Button key = {uuid()} variant = "contained" color = "primary" onClick = {() => setIsShowCorrectAnswers(!isShowCorrectAnswers)}>Näytä vastaukset</Button> }
      </div>

      {/* <div className = "demo">
        { activeExam >= 0 && <Button key = {uuid()} variant = "contained" color = "primary" onClick = {() => setIsDemoShown(true)}>Tulosten demo</Button> }
        { isDemoShown && <TestResultsDemo></TestResultsDemo> }
      </div> */}

      {/* {isLoggedIn && <DragDrop key = {uuid()}></DragDrop>} */}
      
    </div>
  )
}

export default App;