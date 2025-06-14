const express = require('express')
const router = express.Router()
const {
  getBookings,
  getBookingById,
  addBooking,
  editBooking,
  cancelBooking,
  createCheckoutSession
} = require('../controllers/booking')

router.get('/', getBookings)
router.get('/:id', getBookingById)
router.post('/', addBooking)
router.put('/:id', editBooking)
router.delete('/:id', cancelBooking)
router.post('/create-checkout-session', createCheckoutSession)

module.exports = router
