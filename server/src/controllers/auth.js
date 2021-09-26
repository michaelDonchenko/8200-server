const { User: PostgresUser } = require('../models/postgresModels')
const { User: MongoUser } = require('../models/mongoModels')
const { hashPassword, generateJWT } = require('../helpers/functions')
const { NODE_ENV } = require('../constants')

exports.register = async (req, res) => {
  const { email, name, password } = req.body
  try {
    const hashedPassword = await hashPassword(password)

    await PostgresUser.create({ name, email, password: hashedPassword })
    await MongoUser.create({ name, email, password: hashedPassword })

    res
      .status(201)
      .json({ message: 'User registered succefully, you may login now.' })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      message: 'An error occurred',
    })
  }
}

exports.login = async (req, res) => {
  let user = req.user
  user.password = undefined
  user.todos = undefined

  try {
    const token = await generateJWT(user)

    res
      .status(200)
      .cookie('token', token, {
        httpOnly: true,
        sameSite: NODE_ENV === 'production' ? 'None' : 'Lax',
        secure: NODE_ENV === 'production' ? true : false,
      })
      .json({
        message: 'Logged in succefully',
        user,
      })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      message: 'An error occurred',
    })
  }
}

exports.logout = async (req, res) => {
  try {
    res
      .status(200)
      .clearCookie('token', {
        httpOnly: true,
        sameSite: NODE_ENV === 'production' ? 'None' : 'Lax',
        secure: NODE_ENV === 'production' ? true : false,
      })
      .json({
        message: 'Logged out succefully',
      })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      message: 'An error occurred',
    })
  }
}
