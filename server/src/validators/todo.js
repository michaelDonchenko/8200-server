const { check } = require('express-validator')

//text
const text = check('text').notEmpty().withMessage('Todo cannot be empty')

module.exports = {
  createValidation: [text],
}
