const { check } = require('express-validator')
const { User: MongoUser } = require('../models/mongoModels')
const { User: PostgresUser } = require('../models/postgresModels')
const { USE_BACKUP_DATABASE } = require('../constants')
const { comparePassword } = require('../helpers/functions')

//name
const name = check('name').notEmpty().withMessage('Please provide a user name')

//password
const password = check('password')
  .isLength({ min: 8, max: 12 })
  .withMessage('Password has to be between 8 and 12 characters.')

//email
const email = check('email')
  .isEmail()
  .withMessage('Please provide a valid email.')

//check if email exists
const emailExists = check('email').custom(async (value) => {
  let userExist = null
  USE_BACKUP_DATABASE === 'false'
    ? (userExist = await MongoUser.findOne({ email: value }))
    : (userExist = await PostgresUser.findOne({ where: { email: value } }))

  if (userExist) {
    throw new Error('User with that email already exists.')
  }
})

//check if passwords match
const passwordsMatch = check('password').custom(async (value, { req }) => {
  const match = value === req.body.confirmPassword

  if (!match) {
    throw new Error('The passwords do not match please try again.')
  }
})

//login checking
const loginChecks = check('email').custom(async (value, { req }) => {
  let user = null
  let currectPassword = false
  const password = req.body.password

  USE_BACKUP_DATABASE === 'false'
    ? (user = await MongoUser.findOne({ email: value }))
    : (user = await PostgresUser.findOne({ where: { email: value } }))

  if (!user) {
    throw new Error('There is no user with such email')
  }

  currectPassword = await comparePassword(password, user.password)

  if (!currectPassword) {
    throw new Error('Invalid password')
  }

  req.user = user
})

module.exports = {
  registerValidation: [name, email, password, emailExists, passwordsMatch],
  loginValidation: [email, password, loginChecks],
}
