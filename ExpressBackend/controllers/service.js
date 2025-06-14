const pool = require('../models/pool')

const getServices = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM services')
    res.json(result.rows)
  } catch (err) {
    res.status(500).send('Server Error')
  }
}
const addServiceToSalon = async (req, res) => {
  try {
    const { salonId } = req.params
    const { serviceIds } = req.body

    if (!Array.isArray(serviceIds) || serviceIds.length === 0) {
      return res.status(400).json({ error: 'No service IDs provided' })
    }

    const insertPromises = serviceIds.map((serviceId) =>
      pool.query(
        'INSERT INTO salon_services (salon_id, service_id) VALUES ($1, $2)',
        [salonId, serviceId]
      )
    )

    await Promise.all(insertPromises)

    res.status(201).json({ message: 'Services added to salon' })
  } catch (err) {
    console.error('Error linking services to salon:', err)
    res.status(500).send('Server Error')
  }
}

const getServicesBySalonId = async (req, res) => {
  try {
    const { salonId } = req.params
    const result = await pool.query(
      `SELECT s.id, s.name, s.price
       FROM services s
       JOIN salon_services ss ON s.id = ss.service_id
       WHERE ss.salon_id = $1`,
      [salonId]
    )
    res.json(result.rows)
  } catch (err) {
    console.error('Error fetching services by salon:', err)
    res.status(500).send('Server Error')
  }
}

const getServiceById = async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query('SELECT * FROM services WHERE id = $1', [
      id
    ])

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Service not found' })
    }

    res.json(result.rows[0])
  } catch (err) {
    res.status(500).send('Server Error')
  }
}

const addServices = async (req, res) => {
  try {
    const { services } = req.body // [{ name: 'Haircut', price: 10 }, ...]

    if (!Array.isArray(services) || services.length === 0) {
      return res.status(400).json({ error: 'No services provided' })
    }

    const values = services
      .map((_, i) => `($${i * 2 + 1}, $${i * 2 + 2})`)
      .join(', ')

    const flatValues = services.flatMap((s) => [s.name, s.price])

    const result = await pool.query(
      `INSERT INTO services (name, price) VALUES ${values} RETURNING *`,
      flatValues
    )

    res.status(201).json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).send('Server Error')
  }
}

const updateServices = async (req, res) => {
  try {
    const { id } = req.params
    const { name, price } = req.body

    const result = await pool.query(
      'UPDATE services SET name = $1, price = $2 WHERE id = $3 RETURNING *',
      [name, price, id]
    )

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Service not found' })
    }

    res.json(result.rows[0])
  } catch (err) {
    res.status(500).send('Server Error')
  }
}

const deleteServices = async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query(
      'DELETE FROM services WHERE id = $1 RETURNING *',
      [id]
    )

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Service not found' })
    }

    res.json({ message: 'Service deleted' })
  } catch (err) {
    res.status(500).send('Server Error')
  }
}

module.exports = {
  getServices,
  getServiceById,
  addServices,
  updateServices,
  deleteServices,
  getServicesBySalonId,
  addServiceToSalon
}
