const express = require('express')
const router = express.Router()
const {
  getBookings,
  getBookingById,
  addBooking,
  editBooking,
  cancelBooking,
  updateBookingRating,
  createCheckoutSession,
  getBookedSlots
} = require('../controllers/booking')

router.get('/', getBookings)
router.get('/:id', getBookingById)
router.post('/', addBooking)
router.put('/:id', editBooking)
router.post('/create-checkout-session', createCheckoutSession)
router.get('/:salonId/:date/slots', getBookedSlots)
router.patch('/:id/cancel', cancelBooking)
router.patch('/:id/rating', updateBookingRating)

module.exports = router
