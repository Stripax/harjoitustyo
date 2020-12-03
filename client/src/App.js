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

function reducer(state, action) {
  let deepCopy = JSON.parse(JSON.stringify(state))

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

      const addNewExam = async() => {

        try {
          let result = await axios.post("http://localhost:4000/exam", { exam_name: action.data.newExamName })
        }
        catch (ex) {
          alert(ex.message)
        }
      }

      addNewExam()
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
      deepCopy[action.data.activeExam].questions[action.data.questionIndex].choices[action.data.answerIndex].isSelected = action.data.checked
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
  const [isShowCorrectAnswers, setIsShowCorrectAnswers] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isNewExamNameDialogOpen, setIsNewExamNameDialogOpen] = useState(false)
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

  /* useEffect (() => {

    if (isDataInitialized) {
      showExamButtons()
    }
  }, [state]) */

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

    return state.map((item) => 
      <Button key = {uuid()} color = "primary" onClick = {() => setActiveExam(Number(item.id))}>{ item.exam_name }</Button>)
  }


  // EI TOIMI!!!!!!!
  
  const showQuestions = async() => {

    if (activeExam >= 0) {
      let fetchedQuestions

      try {
        let result = await axios.get("http://localhost:4000/questions/" + activeExam)

        if (result.data.length > 0) {
          fetchedQuestions = result.data
        }
      }
      catch (ex) {
        alert(ex.message)
      }

      return fetchedQuestions.map((item) =>
        <Paper key = {item.id} className = "question">
          <h2 className = "question-header">{ item.question_text }</h2>
          {/* { showChoices(item.choices, questionIndex) } */}
        </Paper>)
    }
  }

  /* const showChoices = (choices, questionIndex) => {
    if (activeExam >= 0) {
      return choices.map((item, answerIndex) => 
      <div key = {item.id}>
        <FormControlLabel
          control = {<div>
            { isShowCorrectAnswers === false ? 
              <Checkbox checked = {choices[answerIndex].isSelected} onClick = {(event) => dispatch({ type: 'checkBoxClicked', data: { checked: event.target.checked, activeExam: activeExam, questionIndex: questionIndex, answerIndex: answerIndex }})} /> : 
              <Checkbox color = "primary" checked = {choices[answerIndex].isSelected} disabled /> }
            { isShowCorrectAnswers === false ? "" : <GreenCheckbox checked = {choices[answerIndex].isCorrect} disabled /> }
                    </div>}
          label = {item.answer} />
      </div>)
    }
  } */

  /* const GreenCheckbox = withStyles({
    root: {
      color: green[400],
      '&$checked': {
        color: green[600],
      },
    },
    checked: {},
  })((props) => <Checkbox color="default" {...props} />) */

  return (
    <div className = "App">
      <div className = "header">
        <div className = "header-buttons">
          <Button key = {uuid()} color = "inherit" onClick = {() => setActiveExam(-1)}>Tentit</Button>
          <Button key = {uuid()} color = "inherit" onClick = {() => window.open("https://www.youtube.com/watch?v=sAqnNWUD79Q", "_blank")}>Tietoa sovelluksesta</Button>
          <Button key = {uuid()} color = "inherit" onClick = {() => setIsAdmin(true)}>Admin</Button>
          <Button key = {uuid()} color = "inherit" onClick = {() => setIsAdmin(false)}>Poistu</Button>
        </div>
      </div>

      <div className = "exam-buttons">
        { showExamButtons() }
        { isAdmin && <Button key = {uuid()} color = "primary" startIcon = {<AddCircleOutlineIcon />} onClick = {() => setIsNewExamNameDialogOpen(true)}></Button> }
        { isNewExamNameDialogOpen && <NewExamNameDialog dispatch = {dispatch}></NewExamNameDialog> }
      </div>

      <div className = "main-body">
        <Grid container direction = "column" justify = "center" alignItems = "stretch">
          <Grid item xs = {12}>
            { !isAdmin && activeExam >= 0 && showQuestions() }
            {/* { isAdmin && editQuestions() } */}
            { isAdmin && activeExam >= 0 && <Button key = {uuid()} startIcon = {<AddCircleOutlineIcon />} onClick = {() => dispatch({ type: 'addQuestion', data: { activeExam: activeExam } })}></Button> }
          </Grid>
        </Grid>
      </div>

      <div className = "answers-button">
        { activeExam >= 0 && !isAdmin &&
          <Button key = {uuid()} variant = "contained" color = "primary" onClick = {() => setIsShowCorrectAnswers(true)}>Näytä tulokset</Button> }
      </div>

      <div className = "demo">
        { activeExam >= 0 && <Button key = {uuid()} variant = "contained" color = "primary" onClick = {() => setIsDemoShown(true)}>Tulosten demo</Button> }
        { isDemoShown && <TestResultsDemo></TestResultsDemo> }
      </div>
      
    </div>
  )
}

export default App;