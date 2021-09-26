const { User: MongoUser } = require('../models/mongoModels')
const { Todo } = require('../models/postgresModels')
const { USE_BACKUP_DATABASE } = require('../constants')
const {
  createBackupTodo,
  removeBackupTodo,
  checkBackupTodo,
  uncheckBackupTodo,
} = require('../services/backupFunctions')

exports.userTodos = async (req, res) => {
  let user = req.user
  try {
    //get user todos from backup
    if (USE_BACKUP_DATABASE === 'true') {
      const foundUser = await MongoUser.findOne({ email: user.email })
      const todos = foundUser.todos
      return res.json({ todos })
    }

    //get todos from postgres
    const id = user.dataValues.id
    const todos = await Todo.findAll({
      where: { userId: id },
      order: [['id', 'DESC']],
    })

    res.json({ todos })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      message: 'An error occurred',
    })
  }
}

exports.createTodo = async (req, res) => {
  const { user } = req
  const { email } = user
  const { text } = req.body

  try {
    //in case we use backup db
    if (USE_BACKUP_DATABASE === 'true') {
      await createBackupTodo(email, text)
      return res.json({ message: 'Todo added succefully' })
    }

    //add todo to postgres and send response to user
    const id = user.dataValues.id
    await Todo.create({ text, userId: id })
    res.json({ message: 'Todo added succefully' })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      message: 'An error occurred',
    })
  }
}

exports.removeTodo = async (req, res) => {
  const { user } = req
  const { email } = user
  const { id: todoId } = req.params

  try {
    if (USE_BACKUP_DATABASE === 'true') {
      await removeBackupTodo(email, todoId)
      return res.json({ message: 'Todo deleted succefully' })
    }

    await Todo.destroy({ where: { id: todoId } })
    return res.json({ message: 'Todo deleted succefully' })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      message: 'An error occurred',
    })
  }
}

exports.checkTodo = async (req, res) => {
  const user = req.user
  const { email } = user
  const { id: todoId } = req.params

  try {
    if (USE_BACKUP_DATABASE === 'true') {
      await checkBackupTodo(email, todoId)
      return res.json({ message: 'Todo updated succefully' })
    }

    await Todo.update({ completed: true }, { where: { id: todoId } })
    return res.json({ message: 'Todo updated succefully' })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      message: 'An error occurred',
    })
  }
}

exports.uncheckTodo = async (req, res) => {
  const { user } = req
  const { email } = user
  const { id: todoId } = req.params

  try {
    if (USE_BACKUP_DATABASE === 'true') {
      await uncheckBackupTodo(email, todoId)
      return res.json({ message: 'Todo updated succefully' })
    }

    await Todo.update({ completed: false }, { where: { id: todoId } })
    return res.json({ message: 'Todo updated succefully' })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      message: 'An error occurred',
    })
  }
}
