const express = require('express')
var cors = require('cors')
const db = require('./db')
var bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken')
const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 8080 })

const app = express()
app.use(cors(corsOptions))
app.use(bodyParser.json())
const port = 4000

app.use(express.static('./client/build'))
var path = require('path')

var corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

// Websocket server --> https://dev.to/spukas/learn-websockets-by-building-simple-chat-app-dee
// Testiä

// waits for connection to be established from the client
// the callback argument ws is a unique for each client
wss.on('connection', (ws) => {

  // runs a callback on message event
  ws.on('message', (data) => {

    // sends the data to all connected clients
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(data)
        }
    })
  })

  ws.on('close', () => {
    console.log("Yhteys katkaistu")
  })
})

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
 
app.post('/adduser', (req, res, next) => {

  try {
    bcrypt.hash(req.body.password, 12, (error, hash) => {
      db.query('INSERT INTO "user" (firstname, surname, email, password, is_admin) VALUES ($1, $2, $3, $4, false) RETURNING id',
        [req.body.firstName, req.body.surname, req.body.email, hash], (err, result) => {

          if (result !== undefined) {
            res.json({ message: "Rekisteröityminen onnistui", severity: "success" })
          }
          else if (err) {
            res.json({ message: "Käyttäjä on jo rekisteröitynyt", severity: "warning" })
          }
          else {
            res.json({ message: "Rekisteröitymisessä tapahtui tunnistamaton virhe", severity: "error" })
          }          
        })
    })
  }
  catch (ex) {
    res.json({ message: ex.message, severity: "error" })
  }
})

// Read

app.post('/login/', (req, res, next) => {
  db.query('SELECT password, id FROM "user" WHERE email = $1', [req.body.email], (err, result) => {

    try {
      bcrypt.compare(req.body.password, result.rows[0].password, (error, isLoginSuccessful) => {
        
        if (isLoginSuccessful) {
          // jwt.sign({
          //   data: 'foobar'
          // }, 'secret', { expiresIn: '1h' })
          res.json({ message: "Kirjautuminen onnistui", severity: "info", isLoginSuccessful: true, userId: result.rows[0].id })
        }
        else {
          res.json({ message: "Tarkista salasana sekä sähköpostiosoite", severity: "warning", isLoginSuccessful: false})
        }
      })
    } catch (ex) {
      res.json({ message: ex.message, severity: "error", isLoginSuccessful: false })
    }
  })
})

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

app.put('/checkbox', (req, res, next) => {
  db.query('UPDATE answer SET is_selected = $2 WHERE id = $1', [req.body.answer_id, req.body.checked], (err) => {
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

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'client/build/index.html'))
})

app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})