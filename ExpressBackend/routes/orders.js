const express = require('express')
const router = express.Router()
const { placeOrder } = require('../controllers/orders')

router.post('/', placeOrder)

module.exports = router
