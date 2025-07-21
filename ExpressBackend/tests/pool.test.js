jest.mock('pg', () => ({
  Pool: jest.fn(() => ({ query: jest.fn() }))
}))

const { Pool } = require('pg')
const pool = require('../models/pool')

describe('DB Pool configuration', () => {
  test('creates pool with predefined config', () => {
    expect(Pool).toHaveBeenCalledWith({
      user: 'postgres',
      host: 'localhost',
      database: 'MySalons',
      password: '38822164',
      port: 5432
    })
    expect(pool).toBe(Pool.mock.results[0].value)
  })
})
