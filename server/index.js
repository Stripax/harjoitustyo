const express = require('express')
var cors = require('cors')
const db = require('./db')
var bodyParser = require('body-parser')
const app = express()
app.use(cors(corsOptions))
app.use(bodyParser.json())
const port = 4000

var corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

// Create

app.post('/exam', (req, res, next) => {
  db.query('INSERT INTO exam (exam_name, exam_score, exam_startdate, exam_enddate, min_points) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [req.body.exam_name, req.body.exam_score, req.body.exam_startdate, req.body.exam_enddate, req.body.min_points], (err, result) => {
    if (err) {
      return next(err)
    }
    res.send(result.rows[0].id.toString())
  })
})

// Read

app.get('/exams', (req, res, next) => {
  db.query('SELECT * FROM exam', (err, result) => {
    if (err) {
      return next(err)
    }
    res.send(result.rows)
  })
})
 
app.get('/questions/:exam_id', (req, res, next) => {
  db.query('SELECT * FROM question WHERE exam_id = $1', [req.params.exam_id], (err, result) => {
    if (err) {
      return next(err)
    }
    res.send(result.rows)
  })
})

app.get('/answers/:exam_id', (req, res, next) => {
  db.query('SELECT * FROM answer WHERE question_id IN (SELECT id FROM question WHERE exam_id = $1)', [req.params.exam_id], (err, result) => {
    if (err) {
      return next(err)
    }
    res.send(result.rows)
  })
})

// Update

app.put('/answer/:answer_id/checkbox/:checked', (req, res, next) => {
  db.query('UPDATE answer SET is_selected = $2 WHERE id = $1', [req.params.answer_id, req.params.checked], (err) => {
    if (err) {
      return next(err)
    }
    res.send("Tentin päivitys onnistui!")
  })
})

// Delete

app.delete('/exam/:id', (req, res, next) => {
  db.query('DELETE FROM exam WHERE id = $1', [req.params.id], (err) => {
    if (err) {
      return next(err)
    }
    res.send("Tentin poisto onnistui!")
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})