import React from 'react';
import selma from './selmaSpin.gif'
import { useState, useEffect } from 'react';
import './App.css';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import { FormControlLabel } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';

function App() {

  const [examJavaScript, setExamJavaScript] = useState([])
  const [examCSharp, setExamCSharp] = useState([])
  const [examHtmlCss, setExamHtmlCss] = useState([])
  const [isDataInitialized, setIsDataInitialized] = useState(false)
  const [isShowCorrectAnswers, setIsShowCorrectAnswers] = useState(false)
  const [showExam, setShowExam] = useState(0)

  const exampleQuestionsJS = [
    { question: "Kysymys 1 Javascript", 
        choices: [ { 
          answer: "Kysymys 1 Vastaus nro 1", isSelected: false, isCorrect: false }, { 
          answer: "Kysymys 1 Vastaus nro 2", isSelected: false, isCorrect: true }, { 
          answer: "Kysymys 1 Vastaus nro 3", isSelected: false, isCorrect: true }, { 
          answer: "Kysymys 1 Vastaus nro 4", isSelected: false, isCorrect: false } ] },
    { question: "Kysymys 2 Javascript",
        choices: [ { 
          answer: "Kysymys 2 Vastaus nro 1", isSelected: false, isCorrect: false }, { 
          answer: "Kysymys 2 Vastaus nro 2", isSelected: false, isCorrect: false }, { 
          answer: "Kysymys 2 Vastaus nro 3", isSelected: false, isCorrect: true } ] },
    { question: "Kysymys 3 Javascript",
        choices: [ { 
          answer: "Kysymys 3 Vastaus nro 1", isSelected: false, isCorrect: true }, { 
          answer: "Kysymys 3 Vastaus nro 2", isSelected: false, isCorrect: false }, {
          answer: "Kysymys 3 Vastaus nro 3", isSelected: false, isCorrect: true }, { 
          answer: "Kysymys 3 Vastaus nro 4", isSelected: false, isCorrect: false }, { 
          answer: "Kysymys 3 Vastaus nro 5", isSelected: false, isCorrect: true } ] },
    { question: "Kysymys 4 Javascript",
        choices: [ { 
          answer: "Kysymys 4 Vastaus nro 1", isSelected: false, isCorrect: false }, { 
          answer: "Kysymys 4 Vastaus nro 2", isSelected: false, isCorrect: false }, {
          answer: "Kysymys 4 Vastaus nro 3", isSelected: false, isCorrect: false }, { 
          answer: "Kysymys 4 Vastaus nro 4", isSelected: false, isCorrect: true }, { 
          answer: "Kysymys 4 Vastaus nro 5", isSelected: false, isCorrect: true } ] } ]

  const exampleQuestionsCSharp = [
    { question: "Kysymys 1 CSharp", 
        choices: [ { 
          answer: "Kysymys 1 Vastaus nro 1", isSelected: false, isCorrect: false }, { 
          answer: "Kysymys 1 Vastaus nro 2", isSelected: false, isCorrect: true }, { 
          answer: "Kysymys 1 Vastaus nro 3", isSelected: false, isCorrect: true }, { 
          answer: "Kysymys 1 Vastaus nro 4", isSelected: false, isCorrect: false } ] },
    { question: "Kysymys 2 CSharp",
        choices: [ { 
          answer: "Kysymys 2 Vastaus nro 1", isSelected: false, isCorrect: false }, { 
          answer: "Kysymys 2 Vastaus nro 2", isSelected: false, isCorrect: false }, { 
          answer: "Kysymys 2 Vastaus nro 3", isSelected: false, isCorrect: true } ] },
    { question: "Kysymys 3 CSharp",
        choices: [ { 
          answer: "Kysymys 3 Vastaus nro 1", isSelected: false, isCorrect: true }, { 
          answer: "Kysymys 3 Vastaus nro 2", isSelected: false, isCorrect: false }, {
          answer: "Kysymys 3 Vastaus nro 3", isSelected: false, isCorrect: true }, { 
          answer: "Kysymys 3 Vastaus nro 4", isSelected: false, isCorrect: false }, { 
          answer: "Kysymys 3 Vastaus nro 5", isSelected: false, isCorrect: true } ] }]

  const exampleQuestionsHtmlCss = [
    { question: "Kysymys 1 HTML-CSS", 
        choices: [ { 
          answer: "Kysymys 1 Vastaus nro 1", isSelected: false, isCorrect: false }, { 
          answer: "Kysymys 1 Vastaus nro 2", isSelected: false, isCorrect: true }, { 
          answer: "Kysymys 1 Vastaus nro 3", isSelected: false, isCorrect: true }, { 
          answer: "Kysymys 1 Vastaus nro 4", isSelected: false, isCorrect: false } ] },
    { question: "Kysymys 2 HTML-CSS",
        choices: [ { 
          answer: "Kysymys 2 Vastaus nro 1", isSelected: false, isCorrect: false }, { 
          answer: "Kysymys 2 Vastaus nro 2", isSelected: false, isCorrect: false }, { 
          answer: "Kysymys 2 Vastaus nro 3", isSelected: false, isCorrect: true } ] },
    { question: "Kysymys 3 HTML-CSS",
        choices: [ { 
          answer: "Kysymys 3 Vastaus nro 1", isSelected: false, isCorrect: true }, { 
          answer: "Kysymys 3 Vastaus nro 2", isSelected: false, isCorrect: false }, {
          answer: "Kysymys 3 Vastaus nro 3", isSelected: false, isCorrect: true }, { 
          answer: "Kysymys 3 Vastaus nro 4", isSelected: false, isCorrect: false }, { 
          answer: "Kysymys 3 Vastaus nro 5", isSelected: false, isCorrect: true } ] },
    { question: "Kysymys 4 HTML-CSS",
        choices: [ { 
          answer: "Kysymys 4 Vastaus nro 1", isSelected: false, isCorrect: false }, { 
          answer: "Kysymys 4 Vastaus nro 2", isSelected: false, isCorrect: false }, {
          answer: "Kysymys 4 Vastaus nro 3", isSelected: false, isCorrect: false }, { 
          answer: "Kysymys 4 Vastaus nro 4", isSelected: false, isCorrect: true }, { 
          answer: "Kysymys 4 Vastaus nro 5", isSelected: false, isCorrect: true } ] },
    { question: "Kysymys 5 HTML-CSS",
        choices: [ { 
          answer: "Kysymys 5 Vastaus nro 1", isSelected: false, isCorrect: true }, { 
          answer: "Kysymys 5 Vastaus nro 2", isSelected: false, isCorrect: false }, {
          answer: "Kysymys 5 Vastaus nro 3", isSelected: false, isCorrect: false }, { 
          answer: "Kysymys 5 Vastaus nro 4", isSelected: false, isCorrect: false }, { 
          answer: "Kysymys 5 Vastaus nro 5", isSelected: false, isCorrect: true } ] } ]

  useEffect (() => {
    let storedQuestions = window.localStorage
    let tempStoredJS = JSON.parse(storedQuestions.getItem("examJavaScript"))
    let tempStoredCSharp = JSON.parse(storedQuestions.getItem("examCSharp"))
    let tempStoredHtmlCss = JSON.parse(storedQuestions.getItem("examHtmlCss"))

    if (tempStoredJS == null) {
      storedQuestions.setItem("examJavaScript", JSON.stringify(exampleQuestionsJS))
      tempStoredJS = exampleQuestionsJS
    }
    if (tempStoredCSharp == null) {
      storedQuestions.setItem("examCSharp", JSON.stringify(exampleQuestionsCSharp))
      tempStoredCSharp = exampleQuestionsCSharp
    }
    if (tempStoredHtmlCss == null) {
      storedQuestions.setItem("examHtmlCss", JSON.stringify(exampleQuestionsHtmlCss))
      tempStoredHtmlCss = exampleQuestionsHtmlCss
    }

    setExamJavaScript(tempStoredJS)
    setExamCSharp(tempStoredCSharp)
    setExamHtmlCss(tempStoredHtmlCss)
    setIsDataInitialized(true)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect (() => {
    if (isDataInitialized) {
      window.localStorage.setItem("examJavaScript", JSON.stringify(examJavaScript))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examJavaScript])

  useEffect (() => {
    if (isDataInitialized) {
      window.localStorage.setItem("examCSharp", JSON.stringify(examCSharp))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examCSharp])

  useEffect (() => {
    if (isDataInitialized) {
      window.localStorage.setItem("examHtmlCss", JSON.stringify(examHtmlCss))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examHtmlCss])

  useEffect(() => {
    const timer = setTimeout(() => alert("hello"), 1000)
    return () => clearTimeout(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showExam])

  const showQuestions = () => {
    switch(showExam) {
      case 1:
        return examJavaScript.map((item, questionIndex) =>
          <Paper key = {questionIndex} className = "question">
            <h2 className = "question-header">{item.question}</h2>
            { showChoices(item.choices, questionIndex) }
          </Paper>)
      
      case 2:
        return examCSharp.map((item, questionIndex) =>
          <Paper key = {questionIndex} className = "question">
            <h2 className = "question-header">{item.question}</h2>
            { showChoices(item.choices, questionIndex) }
          </Paper>)

      case 3:
        return examHtmlCss.map((item, questionIndex) =>
          <Paper key = {questionIndex} className = "question">
            <h2 className = "question-header">{item.question}</h2>
            { showChoices(item.choices, questionIndex) }
          </Paper>)
      
      default:
        return ""
    }
  }

  const showChoices = (choices, questionIndex) => {
    return choices.map((i, answerIndex) => 
    <div key = {answerIndex}>
      <FormControlLabel
        control = {<div>
          { isShowCorrectAnswers === false ? 
            <Checkbox checked = {choices[answerIndex].isSelected} onClick = {e => checkBoxClicked(e, questionIndex, answerIndex)} /> : 
            <Checkbox color = "primary" checked = {choices[answerIndex].isSelected} disabled /> }
          { isShowCorrectAnswers === false ? "" : <GreenCheckbox checked = {choices[answerIndex].isCorrect} disabled /> }
                  </div>}
        label = {i.answer} />
    </div>)
  }

  const checkBoxClicked = (e, questionIndex, answerIndex) => {
    switch(showExam) {
      case 1:
        let tempListJS = JSON.parse(JSON.stringify(examJavaScript))
        tempListJS[questionIndex].choices[answerIndex].isSelected = e.target.checked
        setExamJavaScript(tempListJS)
        break
      
      case 2:
        let tempListCSharp = JSON.parse(JSON.stringify(examCSharp))
        tempListCSharp[questionIndex].choices[answerIndex].isSelected = e.target.checked
        setExamCSharp(tempListCSharp)
        break

      case 3:
        let tempListHtmlCss = JSON.parse(JSON.stringify(examHtmlCss))
        tempListHtmlCss[questionIndex].choices[answerIndex].isSelected = e.target.checked
        setExamHtmlCss(tempListHtmlCss)
        break

      default:
        alert("Unknown error occurred!")
    }
  };

  const GreenCheckbox = withStyles({
    root: {
      color: green[800],
      '&$checked': {
        color: green[100],
      },
    },
    checked: {},
  })((props) => <Checkbox color="default" {...props} />);

  return (
    <div className = "App">
      <div className = "header">
        <div className = "header-buttons">
          <Button color = "inherit" onClick = {() => setShowExam(0)}>Tentit</Button>
          <Button color = "inherit" onClick = {() => window.open("https://www.youtube.com/watch?v=sAqnNWUD79Q", "_blank")}>Tietoa sovelluksesta</Button>
          <Button color = "inherit">Poistu</Button>
        </div>
      </div>

      <div className = "exam-buttons">
        <Button color = "primary" onClick = {() => setShowExam(1)}>Javascript perusteet</Button>
        <Button color = "primary" onClick = {() => setShowExam(2)}>C# perusteet</Button>
        <Button color = "primary" onClick = {() => setShowExam(3)}>HTML5 ja CSS perusteet</Button>
      </div>

      <div className = "preloader"><img src = {selma} alt = "selma"></img></div>

      <div className = "main-body">
        <Grid container direction = "column" justify = "center" alignItems = "stretch">
          <Grid item xs = {12}>
            { showQuestions() }
          </Grid>
        </Grid>
      </div>

      <div className = "answers-button">
        { showExam !== 0 ? 
          <Button variant = "contained" color = "primary" onClick = {() => setIsShowCorrectAnswers(true)}>Näytä tulokset</Button> :
           ""}
      </div>
      
    </div>
  );
}

export default App;