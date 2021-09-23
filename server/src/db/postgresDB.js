const { Sequelize } = require('sequelize')
const { NODE_ENV, POSTGRES_PRODUCTION_CONNECTION } = require('../constants')

NODE_ENV === 'development'
  ? (module.exports = new Sequelize('test8200', 'postgres', 'root', {
      dialect: 'postgres',
      host: 'localhost',
      port: '5432',
    }))
  : (module.exports = new Sequelize(POSTGRES_PRODUCTION_CONNECTION))
