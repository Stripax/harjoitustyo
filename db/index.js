const { Pool } = require('pg')

// const pool = new Pool({
//     user: 'postgres',
//     host: 'localhost',
//     database: 'ExamDB',
//     password: 'McCandy0',
//     port: 5432,
//   })

var connectInfo = {}
var pool = null

if (process.env.HEROKU) {
  pool = new Pool({ connectionString: process.env.DATABASE_URL })
}
else {
  connection = {
    user: 'postgres',
    host: 'localhost',
    database: 'ExamDB',
    password: 'McCandy0',
    port: 5432
  }
  pool = new Pool(connectInfo)
}

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback)
  },
}