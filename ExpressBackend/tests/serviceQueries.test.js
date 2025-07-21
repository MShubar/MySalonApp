const mockQuery = jest.fn()
jest.mock('../models/pool', () => ({ query: mockQuery }))

const {
  getServices,
  getServiceById,
  addServices
} = require('../controllers/service')

describe('Service controller queries', () => {
  const res = {
    json: jest.fn(),
    status: jest.fn(function () { return this }),
    send: jest.fn()
  }

  beforeEach(() => {
    mockQuery.mockReset()
    res.json.mockReset()
    res.status.mockReset()
    res.status.mockReturnThis()
    res.send.mockReset()
  })

  test('getServices returns rows', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 1 }], rowCount: 1 })
    await getServices({}, res)
    expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM services')
    expect(res.json).toHaveBeenCalledWith([{ id: 1 }])
  })

  test('getServiceById returns service when found', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 5 }], rowCount: 1 })
    await getServiceById({ params: { id: 5 } }, res)
    expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM services WHERE id = $1', [5])
    expect(res.json).toHaveBeenCalledWith({ id: 5 })
  })

  test('getServiceById sends 404 when not found', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [], rowCount: 0 })
    await getServiceById({ params: { id: 99 } }, res)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ message: 'Service not found' })
  })

  test('addServices inserts multiple rows', async () => {
    const services = [
      { name: 'A', price: 10, duration: 30 },
      { name: 'B', price: 20, duration: 40 }
    ]
    mockQuery.mockResolvedValueOnce({ rows: services })
    await addServices({ body: { services } }, res)
    const expectedValues = '($1, $2, $3), ($4, $5, $6)'
    const expectedQuery = `INSERT INTO services (name, price, duration) VALUES ${expectedValues} RETURNING *`
    const expectedParams = ['A', 10, 30, 'B', 20, 40]
    expect(mockQuery).toHaveBeenCalledWith(expectedQuery, expectedParams)
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith(services)
  })

  test('addServices validates input', async () => {
    await addServices({ body: { services: [] } }, res)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'No services provided' })
  })
})
