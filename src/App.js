import React from 'react';
import { useState, useEffect } from 'react';
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

function App() {

  const [examData, setExamData] = useState([])
  const [activeExam, setActiveExam] = useState(-1)
  const [isDataInitialized, setIsDataInitialized] = useState(false)
  const [isShowCorrectAnswers, setIsShowCorrectAnswers] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  const exampleQuestions = [ {
    exam: "Javascript perusteet", questions: [ {
      question: "Kysymys 1 Javascript", 
        choices: [ { 
          answer: "Kysymys 1 Vastaus nro 1", isSelected: false, isCorrect: false }, { 
          answer: "Kysymys 1 Vastaus nro 2", isSelected: false, isCorrect: true }, { 
          answer: "Kysymys 1 Vastaus nro 3", isSelected: false, isCorrect: true }, { 
          answer: "Kysymys 1 Vastaus nro 4", isSelected: false, isCorrect: false } ] }, {
      question: "Kysymys 2 Javascript",
        choices: [ { 
          answer: "Kysymys 2 Vastaus nro 1", isSelected: false, isCorrect: false }, { 
          answer: "Kysymys 2 Vastaus nro 2", isSelected: false, isCorrect: false }, { 
          answer: "Kysymys 2 Vastaus nro 3", isSelected: false, isCorrect: true } ] }, {
      question: "Kysymys 3 Javascript",
        choices: [ { 
          answer: "Kysymys 3 Vastaus nro 1", isSelected: false, isCorrect: true }, { 
          answer: "Kysymys 3 Vastaus nro 2", isSelected: false, isCorrect: false }, {
          answer: "Kysymys 3 Vastaus nro 3", isSelected: false, isCorrect: true }, { 
          answer: "Kysymys 3 Vastaus nro 4", isSelected: false, isCorrect: false }, { 
          answer: "Kysymys 3 Vastaus nro 5", isSelected: false, isCorrect: true } ] }, {
      question: "Kysymys 4 Javascript",
        choices: [ { 
          answer: "Kysymys 4 Vastaus nro 1", isSelected: false, isCorrect: false }, { 
          answer: "Kysymys 4 Vastaus nro 2", isSelected: false, isCorrect: false }, {
          answer: "Kysymys 4 Vastaus nro 3", isSelected: false, isCorrect: false }, { 
          answer: "Kysymys 4 Vastaus nro 4", isSelected: false, isCorrect: true }, { 
          answer: "Kysymys 4 Vastaus nro 5", isSelected: false, isCorrect: true } ] } ] }, {

    exam: "C# perusteet", questions: [ {
      question: "Kysymys 1 CSharp", 
        choices: [ { 
          answer: "Kysymys 1 Vastaus nro 1", isSelected: false, isCorrect: false }, { 
          answer: "Kysymys 1 Vastaus nro 2", isSelected: false, isCorrect: true }, { 
          answer: "Kysymys 1 Vastaus nro 3", isSelected: false, isCorrect: true }, { 
          answer: "Kysymys 1 Vastaus nro 4", isSelected: false, isCorrect: false } ] }, {
      question: "Kysymys 2 CSharp",
        choices: [ { 
          answer: "Kysymys 2 Vastaus nro 1", isSelected: false, isCorrect: false }, { 
          answer: "Kysymys 2 Vastaus nro 2", isSelected: false, isCorrect: false }, { 
          answer: "Kysymys 2 Vastaus nro 3", isSelected: false, isCorrect: true } ] }, {
      question: "Kysymys 3 CSharp",
        choices: [ { 
          answer: "Kysymys 3 Vastaus nro 1", isSelected: false, isCorrect: true }, { 
          answer: "Kysymys 3 Vastaus nro 2", isSelected: false, isCorrect: false }, {
          answer: "Kysymys 3 Vastaus nro 3", isSelected: false, isCorrect: true }, { 
          answer: "Kysymys 3 Vastaus nro 4", isSelected: false, isCorrect: false }, { 
          answer: "Kysymys 3 Vastaus nro 5", isSelected: false, isCorrect: true } ] } ] }, {

    exam: "HTML&CSS perusteet", questions: [ {
      question: "Kysymys 1 HTML-CSS", 
        choices: [ { 
          answer: "Kysymys 1 Vastaus nro 1", isSelected: false, isCorrect: false }, { 
          answer: "Kysymys 1 Vastaus nro 2", isSelected: false, isCorrect: true }, { 
          answer: "Kysymys 1 Vastaus nro 3", isSelected: false, isCorrect: true }, { 
          answer: "Kysymys 1 Vastaus nro 4", isSelected: false, isCorrect: false } ] }, {
    question: "Kysymys 2 HTML-CSS",
        choices: [ { 
          answer: "Kysymys 2 Vastaus nro 1", isSelected: false, isCorrect: false }, { 
          answer: "Kysymys 2 Vastaus nro 2", isSelected: false, isCorrect: false }, { 
          answer: "Kysymys 2 Vastaus nro 3", isSelected: false, isCorrect: true } ] }, {
    question: "Kysymys 3 HTML-CSS",
        choices: [ { 
          answer: "Kysymys 3 Vastaus nro 1", isSelected: false, isCorrect: true }, { 
          answer: "Kysymys 3 Vastaus nro 2", isSelected: false, isCorrect: false }, {
          answer: "Kysymys 3 Vastaus nro 3", isSelected: false, isCorrect: true }, { 
          answer: "Kysymys 3 Vastaus nro 4", isSelected: false, isCorrect: false }, { 
          answer: "Kysymys 3 Vastaus nro 5", isSelected: false, isCorrect: true } ] }, {
    question: "Kysymys 4 HTML-CSS",
        choices: [ { 
          answer: "Kysymys 4 Vastaus nro 1", isSelected: false, isCorrect: false }, { 
          answer: "Kysymys 4 Vastaus nro 2", isSelected: false, isCorrect: false }, {
          answer: "Kysymys 4 Vastaus nro 3", isSelected: false, isCorrect: false }, { 
          answer: "Kysymys 4 Vastaus nro 4", isSelected: false, isCorrect: true }, { 
          answer: "Kysymys 4 Vastaus nro 5", isSelected: false, isCorrect: true } ] }, {
    question: "Kysymys 5 HTML-CSS",
        choices: [ { 
          answer: "Kysymys 5 Vastaus nro 1", isSelected: false, isCorrect: true }, { 
          answer: "Kysymys 5 Vastaus nro 2", isSelected: false, isCorrect: false }, {
          answer: "Kysymys 5 Vastaus nro 3", isSelected: false, isCorrect: false }, { 
          answer: "Kysymys 5 Vastaus nro 4", isSelected: false, isCorrect: false }, { 
          answer: "Kysymys 5 Vastaus nro 5", isSelected: false, isCorrect: true } ] } ] } ]

  useEffect (() => {
    let storedQuestions = window.localStorage
    let tempStored = JSON.parse(storedQuestions.getItem("examData"))

    if (tempStored == null) {
      storedQuestions.setItem("examData", JSON.stringify(exampleQuestions))
      tempStored = exampleQuestions
    }

    setExamData(tempStored)
    setIsDataInitialized(true)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect (() => {
    if (isDataInitialized) {
      window.localStorage.setItem("examData", JSON.stringify(examData))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examData])

  // ------------------ ADMIN PART OF THE CODE ----------------------------

  const addExamButton = () => {
    let tempData = JSON.parse(JSON.stringify(examData))
    let newExamName = prompt("Anna uuden tentin nimi", "Uusi tentti")

    let newExam = { exam: newExamName, questions: [ { 
                    question: "new exam question 1", choices: [ { 
                    answer: "new exam question 1 answer 1", isSelected: false, isCorrect: false }, { 
                    answer: "new exam question 1 answer 2", isSelected: false, isCorrect: false }, { 
                    answer: "new exam question 1 answer 3", isSelected: false, isCorrect: true } ] }, { 
                    question: "new exam question 2", choices: [ { 
                    answer: "new exam question 2 answer 1", isSelected: false, isCorrect: false }, { 
                    answer: "new exam question 2 answer 2", isSelected: false, isCorrect: true }, { 
                    answer: "new exam question 2 answer 3", isSelected: false, isCorrect: false }, { 
                    answer: "new exam question 2 answer 4", isSelected: false, isCorrect: false } ] } ] }

    tempData.push(newExam)
    setExamData(tempData)
  }

  const editQuestions = () => {
    if (activeExam >= 0) {
      return examData[activeExam].questions.map((item, questionIndex) =>
        <Paper key = {questionIndex} className = "edit-questions">
          <Button key = {"btn-delete-question"} color = "secondary" startIcon = {<DeleteForeverOutlined />} onClick = {() => deleteQuestion(questionIndex)}></Button>
          <input type = "text" size = "50" value = {item.question} onChange = {(event) => editQuestionText(event, questionIndex)} />          
          <br></br>
          { item.choices.map((i, answerIndex) => 
            <div>
              <GreenCheckbox checked = {i.isCorrect} onClick = {(event) => changeCorrectAnswer(event, questionIndex, answerIndex)}></GreenCheckbox>
              <input type = "text" size = "50" value = {i.answer} onChange = {(event) => editAnswerText(event, questionIndex, answerIndex)} />
              <Button key = {"btn-delete-answer"} startIcon = {<DeleteForeverOutlined />} onClick = {() => deleteAnswer(questionIndex, answerIndex)}></Button>
              <br></br>
            </div>
          ) }
          <Button key = {"btn-add-answer"} startIcon = {<AddCircleOutlineIcon />} onClick = {() => addAnswer(questionIndex)}></Button>
        </Paper>)
    }
  }

  const changeCorrectAnswer = (event, questionIndex, answerIndex) => {
    let tempData = JSON.parse(JSON.stringify(examData))
    tempData[activeExam].questions[questionIndex].choices[answerIndex].isCorrect = event.target.checked
    setExamData(tempData)
  }

  const deleteQuestion = (questionIndex) => {
    let tempData = JSON.parse(JSON.stringify(examData))
    tempData[activeExam].questions.splice(questionIndex, 1)
    setExamData(tempData)
  }

  const deleteAnswer = (questionIndex, answerIndex) => {
    let tempData = JSON.parse(JSON.stringify(examData))
    tempData[activeExam].questions[questionIndex].choices.splice(answerIndex, 1)
    setExamData(tempData)
  }

  const editQuestionText = (event, questionIndex) => {
    let tempData = JSON.parse(JSON.stringify(examData))
    tempData[activeExam].questions[questionIndex].question = event.target.value
    setExamData(tempData)
  }

  const editAnswerText = (event, questionIndex, answerIndex) => {
    let tempData = JSON.parse(JSON.stringify(examData))
    tempData[activeExam].questions[questionIndex].choices[answerIndex].answer = event.target.value
    setExamData(tempData)
  }

  const addQuestion = () => {
    let tempData = JSON.parse(JSON.stringify(examData))
    let tempQuestion = { question: "", choices: [ { answer: "", isSelected: false, isCorrect: false } ] }
    tempData[activeExam].questions.push(tempQuestion)
    setExamData(tempData)
  }

  const addAnswer = (questionIndex) => {
    let tempData = JSON.parse(JSON.stringify(examData))
    let tempAnswer = { answer: "", isSelected: false, isCorrect: false }
    tempData[activeExam].questions[questionIndex].choices.push(tempAnswer)
    setExamData(tempData)
  }

  // ------------------- USER PART OF THE CODE ---------------------------

  const showExamButtons = () => {
    return examData.map((item, examIndex) => 
      <Button key = {examIndex} color = "primary" onClick = {() => setActiveExam(examIndex)}>{ item.exam }</Button>)
  }

  const showQuestions = () => {
    if (activeExam >= 0) {
      return examData[activeExam].questions.map((item, questionIndex) =>
      <Paper key = {questionIndex} className = "question">
        <h2 className = "question-header">{ item.question }</h2>
        { showChoices(item.choices, questionIndex) }
      </Paper>)
    }
  }

  const showChoices = (choices, questionIndex) => {
    if (activeExam >= 0) {
      return choices.map((item, answerIndex) => 
      <div key = {answerIndex}>
        <FormControlLabel
          control = {<div>
            { isShowCorrectAnswers === false ? 
              <Checkbox checked = {choices[answerIndex].isSelected} onClick = {e => checkBoxClicked(e, questionIndex, answerIndex)} /> : 
              <Checkbox color = "primary" checked = {choices[answerIndex].isSelected} disabled /> }
            { isShowCorrectAnswers === false ? "" : <GreenCheckbox checked = {choices[answerIndex].isCorrect} disabled /> }
                    </div>}
          label = {item.answer} />
      </div>)
    }
  }

   const checkBoxClicked = (e, questionIndex, answerIndex) => {
        let tempList = JSON.parse(JSON.stringify(examData))
        tempList[activeExam].questions[questionIndex].choices[answerIndex].isSelected = e.target.checked
        setExamData(tempList)
    }

  const GreenCheckbox = withStyles({
    root: {
      color: green[400],
      '&$checked': {
        color: green[600],
      },
    },
    checked: {},
  })((props) => <Checkbox color="default" {...props} />);

  return (
    <div className = "App">
      <div className = "header">
        <div className = "header-buttons">
          <Button key = {"btn-exams"} color = "inherit" onClick = {() => setActiveExam(-1)}>Tentit</Button>
          <Button key = {"btn-info"} color = "inherit" onClick = {() => window.open("https://www.youtube.com/watch?v=sAqnNWUD79Q", "_blank")}>Tietoa sovelluksesta</Button>
          <Button key = {"btn-admin"} color = "inherit" onClick = {() => setIsAdmin(true)}>Admin</Button>
          <Button key = {"btn-exit"} color = "inherit" onClick = {() => setIsAdmin(false)}>Poistu</Button>
        </div>
      </div>

      <div className = "exam-buttons">
        { showExamButtons() }
        { isAdmin && <Button key = {"btn-add-exam"} color = "primary" startIcon = {<AddCircleOutlineIcon />}
                      onClick = {() => addExamButton()}></Button> }
      </div>

      <div className = "main-body">
        <Grid container direction = "column" justify = "center" alignItems = "stretch">
          <Grid item xs = {12}>
            { examData.length > 0 && !isAdmin && showQuestions() }
            { examData.length > 0 && isAdmin && editQuestions() }
            { examData.length > 0 && isAdmin && <Button key = {"btn-add-question"} startIcon = {<AddCircleOutlineIcon />}
                                                        onClick = {() => addQuestion()}></Button> }
          </Grid>
        </Grid>
      </div>

      <div className = "answers-button">
        { activeExam >= 0 && !isAdmin &&
          <Button variant = "contained" color = "primary" onClick = {() => setIsShowCorrectAnswers(true)}>Näytä tulokset</Button> }
      </div>
      
    </div>
  );
}

export default App;