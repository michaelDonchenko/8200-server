const { Router } = require('express')
const { register, displayUsers, login, logout } = require('../controllers/auth')
const { validationMiddleware } = require('../middlewares/express-validator')
const { registerValidation, loginValidation } = require('../validators/auth')
const { userAuth } = require('../middlewares/auth')

const router = Router()

// router.get('/display', displayUsers) created for debugging
router.post('/register', registerValidation, validationMiddleware, register)
router.post('/login', loginValidation, validationMiddleware, login)
router.get('/logout', logout)
router.get('/check-token', userAuth)

module.exports = router
