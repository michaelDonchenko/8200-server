const { Router } = require('express')
const {
  userTodos,
  createTodo,
  removeTodo,
  checkTodo,
  uncheckTodo,
} = require('../controllers/todos')
const { userAuth } = require('../middlewares/auth')
const { createValidation } = require('../validators/todo')
const { validationMiddleware } = require('../middlewares/express-validator')

const router = Router()

router.get('/user-todos', userAuth, userTodos)
router.post(
  '/create',
  createValidation,
  validationMiddleware,
  userAuth,
  createTodo
)

router.delete('/remove/:id', userAuth, removeTodo)
router.put('/check/:id', userAuth, checkTodo)
router.put('/uncheck/:id', userAuth, uncheckTodo)

module.exports = router
