const request = require('supertest')

jest.mock('bcrypt', () => ({
  hash: jest.fn(() => Promise.resolve('hashed')),
  compare: jest.fn(() => Promise.resolve(true))
}))
const bcrypt = require('bcrypt')

const mockQuery = jest.fn()
jest.mock('../models/pool', () => ({ query: mockQuery }))

const app = require('../server')

describe('Authentication endpoints', () => {
  beforeEach(() => {
    mockQuery.mockReset()
  })

  test('registers a user', async () => {
    mockQuery
      .mockResolvedValueOnce({ rows: [], rowCount: 0 })
      .mockResolvedValueOnce({ rows: [{ id: 1, username: 'john', email: 'john@example.com' }] })

    const res = await request(app)
      .post('/users/register')
      .send({ username: 'john', email: 'john@example.com', password: 'secret' })

    expect(res.status).toBe(201)
    expect(res.body.user).toEqual({ id: 1, username: 'john', email: 'john@example.com' })
  })

  test('logs in a user', async () => {
    const hash = await bcrypt.hash('secret', 10)
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 1, username: 'john', password: hash }] })

    const res = await request(app)
      .post('/users/login')
      .send({ username: 'john', password: 'secret' })

    expect(res.status).toBe(200)
    expect(res.body.message).toBe('Login successful')
    expect(res.body).toHaveProperty('token')
  })

  test('rejects invalid credentials', async () => {
    const hash = await bcrypt.hash('secret', 10)
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 1, username: 'john', password: hash }] })
    bcrypt.compare.mockResolvedValueOnce(false)

    const res = await request(app)
      .post('/users/login')
      .send({ username: 'john', password: 'wrong' })

    expect(res.status).toBe(401)
  })
})
