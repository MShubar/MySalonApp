const pool = require('../models/pool')
const uploadToAzure = require('../middleware/azureBlob')

const getPackages = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        packages.id,
        packages.title,
        packages.description,
        packages.price,
        packages.image_url,
        packages.quantity,
        salons.name AS salon_name
      FROM packages
      JOIN salons ON packages.salon_id = salons.id
    `)
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).send('Server Error')
  }
}

const getPackageById = async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query('SELECT * FROM packages WHERE id = $1', [
      id
    ])

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Package not found' })
    }

    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).send('Server Error')
  }
}

const addPackage = async (req, res) => {
  try {
    const { title, description, price, salon_id, quantity } = req.body
    const file = req.file

    if (!file)
      return res.status(400).json({ message: 'Image file is required' })

    const imageUrl = await uploadToAzure(file)

    const result = await pool.query(
      'INSERT INTO packages (title, description, price, salon_id, image_url, quantity) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, description, price, salon_id, imageUrl, quantity || 0]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).send('Server Error')
  }
}

const updatePackage = async (req, res) => {
  try {
    const { id } = req.params
    const { title, description, price, quantity } = req.body
    const file = req.file

    const existing = await pool.query('SELECT * FROM packages WHERE id = $1', [
      id
    ])
    if (existing.rowCount === 0) {
      return res.status(404).json({ message: 'Package not found' })
    }

    const imageUrl = file
      ? await uploadToAzure(file)
      : existing.rows[0].image_url

    const result = await pool.query(
      'UPDATE packages SET title = $1, description = $2, price = $3, image_url = $4, quantity = $5 WHERE id = $6 RETURNING *',
      [title, description, price, imageUrl, quantity, id]
    )

    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).send('Server Error')
  }
}

const deletePackage = async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query(
      'DELETE FROM packages WHERE id = $1 RETURNING *',
      [id]
    )
    res.json({ message: 'Package deleted' })
  } catch (err) {
    res.status(500).send('Server Error')
  }
}

const increaseQuantity = async (req, res) => {
  try {
    const { id } = req.params
    await pool.query(
      'Update packages SET quantity = quantity + 1 WHERE id = $1',
      [id]
    )
    res.status(200).json({ message: 'package increased' })
  } catch (error) {
    console.log(error)
  }
}
const decreaseQuantity = async (req, res) => {
  const { id } = req.params
  try {
    const result = await pool.query(
      'UPDATE packages SET quantity = quantity - 1 WHERE id = $1 AND quantity > 0 RETURNING *',
      [id]
    )
    if (result.rowCount === 0) {
      return res.status(400).json({ message: 'Out of stock' })
    }
    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).send('Server Error')
  }
}
module.exports = {
  getPackages,
  getPackageById,
  addPackage,
  updatePackage,
  deletePackage,
  increaseQuantity,
  decreaseQuantity
}
