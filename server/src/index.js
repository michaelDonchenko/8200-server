const express = require('express')
const { PORT, CLIENT_URL } = require('./constants')
const app = express()
const { mongoDB } = require('./db/mongoDB')
const sequelize = require('./db/postgresDB')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const fs = require('fs')
const passport = require('passport')

//import passport middleware
require('./middlewares/passport')

//init middlewares
app.use(express.json({ limit: '2mb' }))
app.use(cookieParser())
app.use(cors({ origin: CLIENT_URL, credentials: true }))
app.use(passport.initialize())

//import && use routes
fs.readdir('./src/routes', (error, files) => {
  if (error) {
    console.log(err)
  }

  files?.forEach((file) => {
    app.use('/api', require('./routes/' + file))
  })
})

//app start function
const appStart = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`The app is running at http://localhost:${PORT}`)
    })
    //database connection
    await mongoDB()
    await sequelize.authenticate()
    await sequelize.sync()
    console.log('Postgresql connection has been established successfully.')
  } catch (error) {
    console.log(`Error: ${error.message}`)
  }
}

appStart()
