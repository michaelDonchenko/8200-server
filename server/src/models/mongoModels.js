const { Schema, model } = require('mongoose')

const UserSchema = new Schema(
  {
    name: String,
    email: String,
    password: String,
    todos: [{ text: String, completed: { type: Boolean, default: false } }],
  },
  { timestamps: true }
)

const User = model('User', UserSchema)
module.exports = { User }
