const passport = require('passport')
const { Strategy } = require('passport-jwt')
const { SECRET, USE_BACKUP_DATABASE } = require('../constants')
const { User: MongoUser } = require('../models/mongoModels')
const { User: PostgresUser } = require('../models/postgresModels')

const cookieExtractor = function (req) {
  let token = null
  if (req && req.cookies) token = req.cookies['token']
  return token
}

const opts = {
  secretOrKey: SECRET,
  jwtFromRequest: cookieExtractor,
}

passport.use(
  new Strategy(opts, async ({ email }, done) => {
    try {
      let user = undefined

      USE_BACKUP_DATABASE === 'true'
        ? (user = await MongoUser.findOne({ email }))
        : (user = await PostgresUser.findOne({ where: { email } }))

      user.password = undefined

      return await done(null, user)
    } catch (error) {
      console.log(error.message)
      done(null, false)
    }
  })
)
