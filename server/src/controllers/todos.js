const { User: MongoUser } = require('../models/mongoModels')
const { Todo } = require('../models/postgresModels')
const { USE_BACKUP_DATABASE } = require('../constants')

exports.userTodos = async (req, res) => {
  let user = req.user
  try {
    if (USE_BACKUP_DATABASE === 'true') {
      const foundUser = await MongoUser.findOne({ email: user.email })
      const todos = foundUser.todos
      return res.status(200).json({ todos })
    }

    const id = user.dataValues.id
    const todos = await Todo.findAll({ where: { userId: id } })

    return res.status(200).json({ todos })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      message: 'An error occurred',
    })
  }
}

exports.createTodo = async (req, res) => {
  let user = req.user
  const email = user.email
  const { text } = req.body

  try {
    if (USE_BACKUP_DATABASE === 'true') {
      await MongoUser.findOneAndUpdate(
        email,
        { $push: { todos: { text } } },
        { new: true }
      )
      return res.status(200).json({ message: 'Todo added succefully' })
    }

    const id = user.dataValues.id
    await Todo.create({ text, userId: id })

    return res.status(200).json({ message: 'Todo added succefully' })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      message: 'An error occurred',
    })
  }
}

exports.removeTodo = async (req, res) => {
  let user = req.user
  let { email } = user
  const { id: todoId } = req.params

  try {
    if (USE_BACKUP_DATABASE === 'true') {
      await MongoUser.findOneAndUpdate(email, {
        $pull: { todos: { _id: todoId } },
      })
      return res.status(200).json({ message: 'Todo deleted succefully' })
    }

    await Todo.destroy({ where: { id: todoId } })
    return res.status(200).json({ message: 'Todo deleted succefully' })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      message: 'An error occurred',
    })
  }
}

exports.checkTodo = async (req, res) => {
  let user = req.user
  let { email } = user
  const { id: todoId } = req.params

  try {
    if (USE_BACKUP_DATABASE === 'true') {
      let foundUser = await MongoUser.findOne({ email })

      const foundIndex = foundUser.todos.findIndex(
        (element) => element._id == todoId
      )

      if (foundIndex === -1) {
        return res.status(404).json({ message: 'Could not find the todo' })
      }

      foundUser.todos[foundIndex].completed = true
      await foundUser.save()

      return res.status(200).json({ message: 'Todo updated succefully' })
    }

    await Todo.update({ completed: true }, { where: { id: todoId } })

    return res.status(200).json({ message: 'Todo updated succefully' })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      message: 'An error occurred',
    })
  }
}

exports.uncheckTodo = async (req, res) => {
  let user = req.user
  let { email } = user
  const { id: todoId } = req.params

  try {
    if (USE_BACKUP_DATABASE === 'true') {
      let foundUser = await MongoUser.findOne({ email })

      const foundIndex = foundUser.todos.findIndex(
        (element) => element._id == todoId
      )

      if (foundIndex === -1) {
        return res.status(404).json({ message: 'Could not find the todo' })
      }

      foundUser.todos[foundIndex].completed = false
      await foundUser.save()

      return res.status(200).json({ message: 'Todo updated succefully' })
    }

    await Todo.update({ completed: false }, { where: { id: todoId } })

    return res.status(200).json({ message: 'Todo updated succefully' })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      message: 'An error occurred',
    })
  }
}
