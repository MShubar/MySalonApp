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
        b.status
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN salons s ON b.salon_id = s.id
      LEFT JOIN services sv 
        ON sv.id::text = ANY (string_to_array(b.service, ','))
      GROUP BY b.id, b.booking_date, b.booking_time, u.username, s.name, s.image_url, b.total, b.status;
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

    const result = await pool.query(
      `
      SELECT 
        bookings.id,
        bookings.user_id,
        bookings.salon_id,
        bookings.service,
        bookings.booking_date,
        bookings.booking_time
      FROM bookings
      WHERE bookings.id = $1
      `,
      [id]
    )

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Booking not found' })
    }

    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).send('Server Error')
  }
}

const addBooking = async (req, res) => {
  try {
    const { user_id, salon_id, service, booking_date, booking_time, notes } =
      req.body

    if (!service) {
      return res.status(400).json({ error: 'Service is required' })
    }

    const serviceIds = service.split(',').map((id) => id.trim())

    // Validate user and salon
    const userCheck = await pool.query('SELECT id FROM users WHERE id = $1', [
      user_id
    ])
    if (userCheck.rowCount === 0)
      return res.status(404).json({ error: 'User not found' })

    const salonCheck = await pool.query('SELECT id FROM salons WHERE id = $1', [
      salon_id
    ])
    if (salonCheck.rowCount === 0)
      return res.status(404).json({ error: 'Salon not found' })

    // Fetch total price
    const priceQuery = await pool.query(
      `SELECT SUM(price) AS total 
       FROM services 
       WHERE id = ANY($1::int[])`,
      [serviceIds]
    )

    const total = priceQuery.rows[0]?.total || 0

    const result = await pool.query(
      `INSERT INTO bookings 
        (user_id, salon_id, service, booking_date, booking_time, notes, total, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [
        user_id,
        salon_id,
        service,
        booking_date,
        booking_time,
        notes,
        total, // ✅ Correct value
        'active'
      ]
    )

    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).send('Server Error')
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

const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params

    const result = await pool.query(
      `UPDATE bookings SET status = 'Cancelled' WHERE id = $1 RETURNING *`,
      [id]
    )

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Booking not found' })
    }

    res.json({ message: 'Booking cancelled', booking: result.rows[0] })
  } catch (err) {
    console.error(err)
    res.status(500).send('Error cancelling booking')
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

module.exports = {
  getBookings,
  getBookingById,
  addBooking,
  cancelBooking,
  editBooking,
  createCheckoutSession
}
