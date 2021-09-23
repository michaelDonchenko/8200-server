const { config } = require('dotenv')
config()

module.exports = {
  NODE_ENV: process.env.NODE_ENV,
  MONGO_LOCAL_CONNECTION: process.env.MONGO_LOCAL_CONNECTION,
  MONGO_PRODUCTION: process.env.MONGO_PRODUCTION,
  PORT: process.env.PORT,
  POSTGRES_PRODUCTION_CONNECTION: process.env.POSTGRES_PRODUCTION_CONNECTION,
  USE_BACKUP_DATABASE: process.env.USE_BACKUP_DATABASE,
  SECRET: process.env.SECRET,
  CLIENT_URL: process.env.CLIENT_URL,
}
