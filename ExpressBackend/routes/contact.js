const express = require('express')
const router = express.Router()
const { getContact, addContact } = require('../controllers/contact')

router.get('/', getContact)
router.post('/', addContact)

module.exports = router
