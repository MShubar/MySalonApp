const pool = require('../models/pool')
const axios = require('axios')
const crypto = require('crypto')

const MASTERCARD_API_URL = 'https://gateway.mastercard.com/api/nvp/version/70'
const MASTERCARD_API_KEY = 'YOUR_API_KEY'
const MASTERCARD_SHARED_SECRET = 'YOUR_SECRET'
const MERCHANT_ID = 'YOUR_MERCHANT_ID'

const getBookings = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        b.id,
        b.booking_date,
        b.booking_time,
        u.username AS user_name,
        s.name AS salon_name,
        s.image_url,
        string_agg(sv.name, ', ') AS service_name,
        b.total,
        b.status,
        b.rating
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN salons s ON b.salon_id = s.id
      LEFT JOIN services sv 
        ON sv.id::text = ANY (string_to_array(b.service, ','))
      GROUP BY b.id, b.booking_date, b.booking_time, u.username, s.name, s.image_url, b.total, b.status, b.rating;
    `)

    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).send('Error retrieving bookings')
  }
}

const getBookingById = async (req, res) => {
  try {
    const { id } = req.params

    // Fetch booking details
    const bookingResult = await pool.query(
      `
      SELECT 
        b.id,
        b.user_id,
        b.salon_id,
        s.name AS salon_name,
        COALESCE(b.status, 'Pending') AS status,
        COALESCE(b.total, 0) AS total,
        b.booking_date,
        b.booking_time,
        b.service,
        b.rating
      FROM bookings b
      JOIN salons s ON b.salon_id = s.id
      WHERE b.id = $1
      `,
      [id]
    )

    if (bookingResult.rowCount === 0) {
      return res.status(404).json({ message: 'Booking not found' })
    }

    const booking = bookingResult.rows[0]

    // Convert service IDs string to array of integers
    const serviceIds = booking.service
      ? booking.service.split(',').map((id) => parseInt(id.trim()))
      : []

    // Fetch service names
    let serviceNames = []
    if (serviceIds.length > 0) {
      const servicesResult = await pool.query(
        `SELECT name FROM services WHERE id = ANY($1::int[])`,
        [serviceIds]
      )
      serviceNames = servicesResult.rows.map((row) => row.name)
    }

    // Return booking with service names
    res.json({
      ...booking,
      service_name: serviceNames.join(', '),
      rating: booking.rating
    })
  } catch (err) {
    console.error('getBookingById error:', err)
    res.status(500).send('Server Error')
  }
}

const addBooking = async (req, res) => {
  try {
    const {
      user_id,
      salon_id,
      service,
      booking_date,
      booking_time,
      notes,
      amount,
      duration
    } = req.body

    if (
      !user_id ||
      !salon_id ||
      !service ||
      !booking_date ||
      !booking_time ||
      !amount
    ) {
      return res.status(400).json({ error: 'Missing fields' })
    }

    const result = await pool.query(
      `INSERT INTO bookings
        (user_id, salon_id, service, booking_date, booking_time, notes, total, duration, status, rating)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'active', NULL)
       RETURNING *`,
      [
        user_id,
        salon_id,
        service,
        booking_date,
        booking_time,
        notes,
        amount,
        duration
      ]
    )

    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error('Error adding booking:', err)
    res.status(500).json({ error: 'Server error' })
  }
}

const editBooking = async (req, res) => {
  try {
    const { id } = req.params
    const { user_id, salon_id, service, booking_date, booking_time, status } =
      req.body

    const existing = await pool.query('SELECT * FROM bookings WHERE id = $1', [
      id
    ])

    if (existing.rowCount === 0) {
      return res.status(404).json({ message: 'Booking not found' })
    }

    const current = existing.rows[0]

    const updated = {
      user_id: user_id || current.user_id,
      salon_id: salon_id || current.salon_id,
      service: service || current.service,
      booking_date: booking_date || current.booking_date,
      booking_time: booking_time || current.booking_time,
      status: status || current.status
    }

    const result = await pool.query(
      `UPDATE bookings
       SET user_id = $1,
           salon_id = $2,
           service = $3,
           booking_date = $4,
           booking_time = $5,
           status = $6
       WHERE id = $7
       RETURNING *`,
      [
        updated.user_id,
        updated.salon_id,
        updated.service,
        updated.booking_date,
        updated.booking_time,
        updated.status,
        id
      ]
    )

    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).send('Server Error')
  }
}

// PATCH /bookings/:id/cancel
const cancelBooking = async (req, res) => {
  const { id } = req.params

  try {
    const result = await pool.query(
      `UPDATE bookings SET status = 'Cancelled' WHERE id = $1 RETURNING status`,
      [id]
    )

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Booking not found' })
    }

    res.json({ message: 'Booking cancelled', status: 'Cancelled' })
  } catch (err) {
    console.error('Cancel booking error:', err)
    res.status(500).json({ message: 'Server error' })
  }
}

const updateBookingRating = async (req, res) => {
  const { id } = req.params
  const { rating } = req.body

  if (!rating || rating < 1 || rating > 5)
    return res.status(400).json({ message: 'Invalid rating' })

  try {
    const result = await pool.query(
      `UPDATE bookings SET rating = $1 WHERE id = $2 RETURNING rating`,
      [rating, id]
    )

    if (result.rowCount === 0)
      return res.status(404).json({ message: 'Booking not found' })

    res.json({ message: 'Rating saved', rating: result.rows[0].rating })
  } catch (err) {
    console.error('Update rating error:', err)
    res.status(500).json({ message: 'Server error' })
  }
}

const createCheckoutSession = async (req, res) => {
  const {
    user_id,
    salon_id,
    service,
    booking_date,
    booking_time,
    notes,
    amount
  } = req.body

  if (
    !user_id ||
    !salon_id ||
    !service ||
    !booking_date ||
    !booking_time ||
    !amount
  ) {
    return res.status(400).json({ error: 'Missing booking or payment details' })
  }

  try {
    const insertResult = await pool.query(
      `INSERT INTO bookings 
        (user_id, salon_id, service, booking_date, booking_time, notes, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [user_id, salon_id, service, booking_date, booking_time, notes, 'pending']
    )

    const booking = insertResult.rows[0]
    const merchantRef = `booking-${booking.id}-${Date.now()}`

    const payload = {
      apiOperation: 'CREATE_CHECKOUT_SESSION',
      order: {
        id: merchantRef,
        amount: Number(amount).toFixed(2),
        currency: 'BHD',
        description: `Salon booking #${booking.id}`
      },
      interaction: {
        operation: 'PURCHASE',
        returnUrl: `https://localhost:5173/payment-success?bookingId=${booking.id}`
      }
    }

    const response = await axios.post(
      `${MASTERCARD_API_URL}/merchant/${MERCHANT_ID}/session`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${Buffer.from(
            `${MASTERCARD_API_KEY}:${MASTERCARD_SHARED_SECRET}`
          ).toString('base64')}`
        }
      }
    )

    if (!response.data?.session?.id) {
      return res
        .status(500)
        .json({ error: 'Failed to get session from Mastercard' })
    }

    const sessionId = response.data.session.id
    return res.status(200).json({ sessionId, bookingId: booking.id })
  } catch (err) {
    console.error(
      'Error in createCheckoutSession:',
      err.response?.data || err.message
    )
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}

// GET /bookings/:salonId/:date/slots
const getBookedSlots = async (req, res) => {
  const { salonId, date } = req.params

  try {
    const result = await pool.query(
      `
      SELECT booking_time AS start, duration,
             (booking_time::time + (duration || ' minutes')::interval)::time AS end
      FROM bookings
      WHERE salon_id = $1 AND booking_date = $2 AND status != 'Cancelled'
      `,
      [salonId, date]
    )

    const bookedTimes = result.rows.map((row) => ({
      start: row.start,
      end: row.end,
      duration: row.duration
    }))

    res.json(bookedTimes)
  } catch (err) {
    console.error('getBookedSlots error:', err)
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = {
  getBookings,
  getBookingById,
  addBooking,
  cancelBooking,
  editBooking,
  updateBookingRating,
  createCheckoutSession,
  getBookedSlots
}
