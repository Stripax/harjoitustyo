import React from 'react';
import { useState, useEffect, useReducer } from 'react';
import { v4 as uuid } from 'uuid';
import axios from 'axios';
import './App.css';
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

    case 'addUser':
      let newUser = { user_firstname: action.data.firstName, user_surname: action.data.surname, user_email: action.data.email, user_password: action.data.password }

      const addNewUser = async() => {
        try {
          let result = await axios.post("http://localhost:4000/adduser", { user_firstname: action.data.firstName, user_surname: action.data.surname, user_email: action.data.email, user_password: action.data.password })
          newUser["id"] = result.request.response
        }
        catch (ex) {
          alert(ex.message)
        }
      }

      addNewUser()
      return deepCopy

    case 'addExam':
      let newExam = { id: null, exam_name: action.newExamName, exam_score: null, exam_startdate: null, exam_enddate: null, min_points: null, grade_limits: null }

      const addNewExam = async() => {

        try {
          let result = await axios.post("http://localhost:4000/exam", { exam_name: action.newExamName })
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
          let result = await axios.put("http://localhost:4000/checkbox", { answer_id: action.data.answerId, checked: action.data.checked })
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
  const [isDataInitialized, setIsDataInitialized] = useState(false)
  const [isQuestionsInitialized, setIsQuestionsInitialized] = useState(false)
  const [isQuestionChoicesInitialized, setIsQuestionChoicesInitialized] = useState(false)
  const [isShowCorrectAnswers, setIsShowCorrectAnswers] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isNewExamNameDialogOpen, setIsNewExamNameDialogOpen] = useState(false)
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false)
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false)
  const [isDemoShown, setIsDemoShown] = useState(false)

  useEffect (() => {

    const fetchData = async() => {

      try {
        let resultExams = await axios.get("http://localhost:4000/exams")

        if (resultExams.data.length > 0) {
          dispatch({ type: 'getExamNames', data: resultExams.data })
          setIsDataInitialized(true)
        }
      }
      catch (ex) {
        alert(ex.message)
      }
    }

    fetchData()
  }, [])

  useEffect (() => {
    if (activeExam >= 0) {

      const fetchData = async() => {

        try {
          let resultQuestions = await axios.get("http://localhost:4000/questions/" + activeExam)
          let resultChoices = await axios.get("http://localhost:4000/answers/" + activeExam)

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

  return (
    <div className = "App">
      <div className = "header">
        <div className = "header-buttons">
          <Button key = {uuid()} color = "inherit" onClick = {() => setActiveExam(-1)}>Tentit</Button>
          <Button key = {uuid()} color = "inherit" onClick = {() => window.open("https://www.youtube.com/watch?v=sAqnNWUD79Q", "_blank")}>Tietoa sovelluksesta</Button>
          <Button key = {uuid()} color = "inherit" onClick = {() => setIsRegisterDialogOpen(true)}>Rekisteröidy</Button>
          <Button key = {uuid()} color = "inherit" onClick = {() => setIsLoginDialogOpen(true)}>Kirjaudu</Button>          
          <Button key = {uuid()} color = "inherit" onClick = {() => setIsAdmin(false)}>Poistu</Button>
        </div>
      </div>

      <div className = "login-register-dialog">
        { isRegisterDialogOpen && <RegisterDialog key = {uuid()} dialogClosed = {() => setIsRegisterDialogOpen(false)} dispatch = {(fname, sname, email, password) => dispatch({ type: 'addUser', data: { firstName: fname, surname: sname, email: email, password: password }})}></RegisterDialog> }
        { isLoginDialogOpen && <LoginDialog key = {uuid()} dialogClosed = {() => setIsLoginDialogOpen(false)}></LoginDialog> }
      </div>

      <div className = "exam-buttons">
        { isDataInitialized && showExamButtons() }
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
      
    </div>
  )
}

export default App;