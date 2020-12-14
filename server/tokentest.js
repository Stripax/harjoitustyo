// var jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const saltRounds = 12

let startTime = Date.now()
let endTime
let hashedPassword

// var token1 = jwt.sign({ foo: 'bar' }, 'shhhhh')
// var token2 = jwt.sign({ foo: 'bar' }, 'shhhhh')

(async () => {
    try {
        await bcrypt.hash("password", saltRounds, (err, hash) => {
            hashedPassword = hash
            endTime = Date.now()
            console.log("Hashing took milliseconds:", endTime - startTime)
        })

        await bcrypt.compare("password", hashedPassword, (error, result) => {
            console.log("Was password correct?",result)
        })
    }
    catch (ex) {
        console.log(ex.message)
    }
})()

// console.log("Original token: " + token1)
// temp = token1.concat('r')
// console.log("Tampered token: " + temp)

// try {
//     let result = jwt.verify(temp, 'shhhhh')
//     console.log("Token verified ", result)
// }
// catch (ex) {
//     console.log(ex.message)
// }



// console.log(token)