const express = require('express')
const db = require('./db')
var bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json())
const port = 4000

// Create

app.post('/exam', (req, res, next) => {
  db.query('INSERT INTO exam (exam_name, exam_score, exam_startdate, exam_enddate, min_points) VALUES ($1, $2, $3, $4, $5)',
      [req.body.exam_name, req.body.exam_score, req.body.exam_startdate, req.body.exam_enddate, req.body.min_points], (err) => {
    if (err) {
      return next(err)
    }
    res.send("Tentin lisäys onnistui!")
  })
})

// Read

app.get('/exam', (res, next) => {
  db.query('SELECT * FROM exam', (err, result) => {
    if (err) {
      return next(err)
    }
    res.send(result.rows)
  })
})

app.get('/exam/:id', (req, res, next) => {
  db.query('SELECT * FROM exam WHERE id = $1', [req.params.id], (err, result) => {
    if (err) {
      return next(err)
    }
    res.send(result.rows[0])
  })
})

// Update

app.put('/exam/:id', (req, res, next) => {
  db.query('UPDATE exam SET exam_name = $1 WHERE id = $2', [req.body.exam_name, req.params.id], (err) => {
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