require('dotenv').config()
const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const port = process.env.PORT || 3000
const bodyParser = require('body-parser')


// SET DEFAULT PROPERTIES AND MIDDLEWARE  
require('./socket')(io)  
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))



// ROUTES
const indexRouter = require('./routes/indexRouter')
app.use('/', indexRouter)


http.listen(port, () => console.log(`server running on ${port}...`))