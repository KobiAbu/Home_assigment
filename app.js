const express = require('express')
const app = express()
const morgan = require('morgan')
const routes = require('./api/routes/presentations')
const body_parser = require('body-parser')
const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://admin:' + process.env.MONGO_PW +
    '@homeassigment.h1wevei.mongodb.net/?retryWrites=true&w=majority&appName=HomeAssigment'
    //,{useMongoClient: true}
)

app.use(morgan('dev'))
app.use(body_parser.urlencoded({ extended: false }))
app.use(body_parser.json())

app.use('/presentation', routes)

app.use((req, res, next) => {
    const error = new Error('not found')
    error.status = 404
    next(error)
})

// if not a valid route throw error
app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error:
        {
            message: error.message
        }
    })
})
module.exports = app