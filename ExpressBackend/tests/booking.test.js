const request = require('supertest')

jest.mock('bcrypt', () => ({
  hash: jest.fn(() => Promise.resolve('hashed')),
  compare: jest.fn(() => Promise.resolve(true))
}))
const bcrypt = require('bcrypt')

const mockQuery = jest.fn()
jest.mock('../models/pool', () => ({ query: mockQuery }))

const app = require('../server')

describe('Booking endpoints', () => {
  beforeEach(() => {
    mockQuery.mockReset()
  })

  test('lists bookings', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 1 }], rowCount: 1 })

    const res = await request(app).get('/bookings')

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBe(1)
  })

  test('creates booking', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 1 }], rowCount: 1 })

    const res = await request(app)
      .post('/bookings')
      .send({
        user_id: 1,
        salon_id: 1,
        service: '1',
        booking_date: '2024-01-01',
        booking_time: '12:00',
        amount: 10,
        duration: 30,
        notes: ''
      })

    expect(res.status).toBe(201)
    expect(res.body).toEqual({ id: 1 })
  })

  test('rejects booking with missing fields', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [], rowCount: 0 })

    const res = await request(app)
      .post('/bookings')
      .send({})

    expect(res.status).toBe(400)
  })

  test('updates rating', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ rating: 5 }], rowCount: 1 })

    const res = await request(app)
      .patch('/bookings/1/rating')
      .send({ rating: 5 })

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ message: 'Rating saved', rating: 5 })
  })
})
