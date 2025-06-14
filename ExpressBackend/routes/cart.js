const express = require('express')
const router = express.Router()
const { addToCart } = require('../controllers/cart')

router.post('/', addToCart)

module.exports = router
