const { User: MongoUser } = require('../models/mongoModels')

exports.createBackupTodo = async (email, text) => {
  try {
    await MongoUser.findOneAndUpdate(
      { email },
      {
        $push: { todos: { text } },
      }
    )
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      message: 'An error occurred',
    })
  }
}

exports.removeBackupTodo = async (email, todoId) => {
  try {
    await MongoUser.findOneAndUpdate(
      { email },
      {
        $pull: { todos: { _id: todoId } },
      }
    )
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      message: 'An error occurred',
    })
  }
}

exports.checkBackupTodo = async (email, todoId) => {
  try {
    let foundUser = await MongoUser.findOne({ email })
    const foundIndex = foundUser.todos.findIndex(
      (element) => element._id == todoId
    )

    if (foundIndex === -1) {
      return res.status(404).json({ message: 'Could not find the todo' })
    }

    foundUser.todos[foundIndex].completed = true
    await foundUser.save()
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      message: 'An error occurred',
    })
  }
}

exports.uncheckBackupTodo = async (email, todoId) => {
  try {
    let foundUser = await MongoUser.findOne({ email })
    const foundIndex = foundUser.todos.findIndex(
      (element) => element._id == todoId
    )

    if (foundIndex === -1) {
      return res.status(404).json({ message: 'Could not find the todo' })
    }

    foundUser.todos[foundIndex].completed = false
    await foundUser.save()
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      message: 'An error occurred',
    })
  }
}
