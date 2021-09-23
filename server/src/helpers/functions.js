const { hash, compare } = require('bcryptjs')
const { sign } = require('jsonwebtoken')
const { SECRET } = require('../constants')

async function hashPassword(password) {
  return await hash(password, 10)
}

async function comparePassword(password, userPassword) {
  return await compare(password, userPassword)
}

async function generateJWT(user) {
  let payload = {
    email: user.email,
  }

  return await sign(payload, SECRET)
}

module.exports = {
  hashPassword,
  comparePassword,
  generateJWT,
}
