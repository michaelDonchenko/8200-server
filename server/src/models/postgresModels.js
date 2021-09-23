const sequelize = require('../db/postgresDB')
const { DataTypes } = require('sequelize')
const { STRING, INTEGER, BOOLEAN } = DataTypes

//user model
const User = sequelize.define('user', {
  id: { type: INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: STRING },
  email: { type: STRING, unique: true },
  password: { type: STRING },
})

//todo model
const Todo = sequelize.define('todo', {
  id: { type: INTEGER, primaryKey: true, autoIncrement: true },
  text: { type: STRING },
  completed: { type: BOOLEAN, defaultValue: false },
})

//relations
User.hasMany(Todo)
Todo.belongsTo(User)

module.exports = {
  User,
  Todo,
}
