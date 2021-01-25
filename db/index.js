const { Pool } = require('pg')

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'ExamDB',
    password: 'McCandy0',
    port: 5432,
  })

var connectInfo = {}



module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback)
  },
}