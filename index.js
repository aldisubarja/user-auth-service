const express = require('express')
const app = express()
const path = require('path')
const session = require("express-session")
const configuration = require("./app/modules/configuration")
const app_config = require('./app/config/app.json')
const c_main = require('./app/controllers/controller_main')
// const redis = require("redis")
// const redis_config = require('./app/config/redis.json')

// Enable proxy for get secure https
app.enable("trust proxy")

app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit:50000 }))
app.use(express.json({limit: '50mb'}))
app.use(express.static(path.join(__dirname+'/public')))
app.use(session({
  secret: app_config.secret,
  resave: false,
  unset: 'destroy',
  saveUninitialized: true
}))

app.use('/', c_main)

app.listen(configuration["APP_PORT"], () => console.log('Example app listening on port ' + configuration["APP_PORT"]))