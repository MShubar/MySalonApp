process.env.NODE_ENV = 'test'
const request = require('supertest')

// Mock modules that rely on native bindings
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn()
}))

jest.mock('../models/pool', () => ({
  query: jest.fn()
}))

const pool = require('../models/pool')
const app = require('../server')

describe('Orders API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('GET /orders/order/:orderId returns 404 for non-existent ID', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] })
    const res = await request(app).get('/orders/order/999')
    expect(res.statusCode).toBe(404)
  })

  test('GET /orders/:userId returns an array', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] })
    const res = await request(app).get('/orders/1')
    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })
})
