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
      let newExam = { id: uuid(), exam: action.data.newExamName, questions: [] }
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
      deepCopy[action.data.activeExam].questions[action.data.questionIndex].choices[action.data.answerIndex].isSelected = action.data.checked
      return deepCopy

    case 'initializeData':
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

  const exampleQuestions = [ {
    id: uuid(), exam: "Javascript perusteet", questions: [ {
      id: uuid(), question: "Kysymys 1 Javascript", 
        choices: [ { 
          id: uuid(), answer: "Kysymys 1 Vastaus nro 1", isSelected: false, isCorrect: false }, { 
          id: uuid(), answer: "Kysymys 1 Vastaus nro 2", isSelected: false, isCorrect: true }, { 
          id: uuid(), answer: "Kysymys 1 Vastaus nro 3", isSelected: false, isCorrect: true }, { 
          id: uuid(), answer: "Kysymys 1 Vastaus nro 4", isSelected: false, isCorrect: false } ] }, {
      id: uuid(), question: "Kysymys 2 Javascript",
        choices: [ { 
          id: uuid(), answer: "Kysymys 2 Vastaus nro 1", isSelected: false, isCorrect: false }, { 
          id: uuid(), answer: "Kysymys 2 Vastaus nro 2", isSelected: false, isCorrect: false }, { 
          id: uuid(), answer: "Kysymys 2 Vastaus nro 3", isSelected: false, isCorrect: true } ] }, {
      id: uuid(), question: "Kysymys 3 Javascript",
        choices: [ { 
          id: uuid(), answer: "Kysymys 3 Vastaus nro 1", isSelected: false, isCorrect: true }, { 
          id: uuid(), answer: "Kysymys 3 Vastaus nro 2", isSelected: false, isCorrect: false }, {
          id: uuid(), answer: "Kysymys 3 Vastaus nro 3", isSelected: false, isCorrect: true }, { 
          id: uuid(), answer: "Kysymys 3 Vastaus nro 4", isSelected: false, isCorrect: false }, { 
          id: uuid(), answer: "Kysymys 3 Vastaus nro 5", isSelected: false, isCorrect: true } ] }, {
      id: uuid(), question: "Kysymys 4 Javascript",
        choices: [ { 
          id: uuid(), answer: "Kysymys 4 Vastaus nro 1", isSelected: false, isCorrect: false }, { 
          id: uuid(), answer: "Kysymys 4 Vastaus nro 2", isSelected: false, isCorrect: false }, {
          id: uuid(), answer: "Kysymys 4 Vastaus nro 3", isSelected: false, isCorrect: false }, { 
          id: uuid(), answer: "Kysymys 4 Vastaus nro 4", isSelected: false, isCorrect: true }, { 
          id: uuid(), answer: "Kysymys 4 Vastaus nro 5", isSelected: false, isCorrect: true } ] } ] }, {

    id: uuid(), exam: "C# perusteet", questions: [ {
      id: uuid(), question: "Kysymys 1 CSharp", 
        choices: [ { 
          id: uuid(), answer: "Kysymys 1 Vastaus nro 1", isSelected: false, isCorrect: false }, { 
          id: uuid(), answer: "Kysymys 1 Vastaus nro 2", isSelected: false, isCorrect: true }, { 
          id: uuid(), answer: "Kysymys 1 Vastaus nro 3", isSelected: false, isCorrect: true }, { 
          id: uuid(), answer: "Kysymys 1 Vastaus nro 4", isSelected: false, isCorrect: false } ] }, {
      id: uuid(), question: "Kysymys 2 CSharp",
        choices: [ { 
          id: uuid(), answer: "Kysymys 2 Vastaus nro 1", isSelected: false, isCorrect: false }, { 
          id: uuid(), answer: "Kysymys 2 Vastaus nro 2", isSelected: false, isCorrect: false }, { 
          id: uuid(), answer: "Kysymys 2 Vastaus nro 3", isSelected: false, isCorrect: true } ] }, {
      id: uuid(), question: "Kysymys 3 CSharp",
        choices: [ { 
          id: uuid(), answer: "Kysymys 3 Vastaus nro 1", isSelected: false, isCorrect: true }, { 
          id: uuid(), answer: "Kysymys 3 Vastaus nro 2", isSelected: false, isCorrect: false }, {
          id: uuid(), answer: "Kysymys 3 Vastaus nro 3", isSelected: false, isCorrect: true }, { 
          id: uuid(), answer: "Kysymys 3 Vastaus nro 4", isSelected: false, isCorrect: false }, { 
          id: uuid(), answer: "Kysymys 3 Vastaus nro 5", isSelected: false, isCorrect: true } ] } ] }, {

    id: uuid(), exam: "HTML&CSS perusteet", questions: [ {
      id: uuid(), question: "Kysymys 1 HTML-CSS", 
        choices: [ { 
          id: uuid(), answer: "Kysymys 1 Vastaus nro 1", isSelected: false, isCorrect: false }, { 
          id: uuid(), answer: "Kysymys 1 Vastaus nro 2", isSelected: false, isCorrect: true }, { 
          id: uuid(), answer: "Kysymys 1 Vastaus nro 3", isSelected: false, isCorrect: true }, { 
          id: uuid(), answer: "Kysymys 1 Vastaus nro 4", isSelected: false, isCorrect: false } ] }, {
    id: uuid(), question: "Kysymys 2 HTML-CSS",
        choices: [ { 
          id: uuid(), answer: "Kysymys 2 Vastaus nro 1", isSelected: false, isCorrect: false }, { 
          id: uuid(), answer: "Kysymys 2 Vastaus nro 2", isSelected: false, isCorrect: false }, { 
          id: uuid(), answer: "Kysymys 2 Vastaus nro 3", isSelected: false, isCorrect: true } ] }, {
    id: uuid(), question: "Kysymys 3 HTML-CSS",
        choices: [ { 
          id: uuid(), answer: "Kysymys 3 Vastaus nro 1", isSelected: false, isCorrect: true }, { 
          id: uuid(), answer: "Kysymys 3 Vastaus nro 2", isSelected: false, isCorrect: false }, {
          id: uuid(), answer: "Kysymys 3 Vastaus nro 3", isSelected: false, isCorrect: true }, { 
          id: uuid(), answer: "Kysymys 3 Vastaus nro 4", isSelected: false, isCorrect: false }, { 
          id: uuid(), answer: "Kysymys 3 Vastaus nro 5", isSelected: false, isCorrect: true } ] }, {
    id: uuid(), question: "Kysymys 4 HTML-CSS",
        choices: [ { 
          id: uuid(), answer: "Kysymys 4 Vastaus nro 1", isSelected: false, isCorrect: false }, { 
          id: uuid(), answer: "Kysymys 4 Vastaus nro 2", isSelected: false, isCorrect: false }, {
          id: uuid(), answer: "Kysymys 4 Vastaus nro 3", isSelected: false, isCorrect: false }, { 
          id: uuid(), answer: "Kysymys 4 Vastaus nro 4", isSelected: false, isCorrect: true }, { 
          id: uuid(), answer: "Kysymys 4 Vastaus nro 5", isSelected: false, isCorrect: true } ] }, {
    id: uuid(), question: "Kysymys 5 HTML-CSS",
        choices: [ { 
          id: uuid(), answer: "Kysymys 5 Vastaus nro 1", isSelected: false, isCorrect: true }, { 
          id: uuid(), answer: "Kysymys 5 Vastaus nro 2", isSelected: false, isCorrect: false }, {
          id: uuid(), answer: "Kysymys 5 Vastaus nro 3", isSelected: false, isCorrect: false }, { 
          id: uuid(), answer: "Kysymys 5 Vastaus nro 4", isSelected: false, isCorrect: false }, { 
          id: uuid(), answer: "Kysymys 5 Vastaus nro 5", isSelected: false, isCorrect: true } ] } ] } ]

  useEffect (() => {

    const createData = async() => {

      try {
        await axios.post("http://localhost:3001/exams", exampleQuestions)
        dispatch({ type: 'initializeData', data: exampleQuestions })
        setIsDataInitialized(true)
      }
      catch(ex) {
        alert(ex.message)
      }
    }

    const fetchData = async() => {

      try {
        let result = await axios.get("http://localhost:3001/exams")

        if (result.data.length > 0) {
          dispatch({ type: 'initializeData', data: result.data })
          setIsDataInitialized(true)
        }
        else {
          throw("Empty dataset")
        }
      }
      catch (ex) {
        createData()
        alert(ex.message)
      }
    }

    fetchData()
  }, [])

  useEffect (() => {

    const updateData = async() => {
      try {
        await axios.put("http://localhost:3001/exams", state)
      }
      catch(ex) {
        alert(ex.message)
      }
    }

    if (isDataInitialized) {
      updateData();
    }
  }, [state])

  // ------------------ ADMIN PART OF THE CODE ----------------------------

  const editQuestions = () => {
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
  }

  // ------------------- USER PART OF THE CODE ---------------------------

  const showExamButtons = () => {
    return state.map((item, examIndex) => 
      <Button key = {uuid()} color = "primary" onClick = {() => setActiveExam(examIndex)}>{ item.exam }</Button>)
  }

  const showQuestions = () => {
    if (activeExam >= 0) {
      return state[activeExam].questions.map((item, questionIndex) =>
      <Paper key = {item.id} className = "question">
        <h2 className = "question-header">{ item.question }</h2>
        { showChoices(item.choices, questionIndex) }
      </Paper>)
    }
  }

  const showChoices = (choices, questionIndex) => {
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
            { !isAdmin && showQuestions() }
            { isAdmin && editQuestions() }
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