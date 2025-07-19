const express = require('express')
const { body, validationResult } = require('express-validator')

const router = express.Router()
const { getContact, addContact } = require('../controllers/contact')

router.get('/', getContact)

router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .bail()
      .isEmail()
      .withMessage('Email is invalid')
  ],
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  },
  addContact
)

module.exports = router
