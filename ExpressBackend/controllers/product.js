const pool = require('../models/pool')

const uploadToAzure = require('../middleware/azureBlob')

const getProducts = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        products.id,
        products.name,
        products.description,
        products.price,
        products.quantity,
        products.image_url,
        salons.name AS salon_name
      FROM products
      JOIN salons ON products.salon_id = salons.id
    `)
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).send('Server Error')
  }
}

const getProductById = async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query(
      `
      SELECT 
        products.id,
        products.name,
        products.description,
        products.price,
        products.quantity,
        products.image_url,
        salons.name AS salon_name
      FROM products
      JOIN salons ON products.salon_id = salons.id
      WHERE products.id = $1`,
      [id]
    )

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Product not found' })
    }

    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).send('Server Error')
  }
}

const addProduct = async (req, res) => {
  try {
    const { name, price, description, salon_id, quantity } = req.body
    const file = req.file

    if (!file)
      return res.status(400).json({ message: 'Image file is required' })

    const imageUrl = await uploadToAzure(file)

    const result = await pool.query(
      'INSERT INTO products (name, description, price, salon_id, image_url, quantity) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, description, price, salon_id, imageUrl, quantity]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).send('Server Error')
  }
}

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params
    const { name, price, description, quantity } = req.body
    const file = req.file

    const existing = await pool.query('SELECT * FROM products WHERE id = $1', [
      id
    ])
    if (existing.rowCount === 0) {
      return res.status(404).json({ message: 'Product not found' })
    }

    const imageUrl = file
      ? await uploadToAzure(file)
      : existing.rows[0].image_url

    const result = await pool.query(
      'UPDATE products SET name = $1, price = $2, description = $3, image_url = $4, quantity = $5 WHERE id = $6 RETURNING *',
      [name, price, description, imageUrl, quantity, id]
    )
    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).send('Server Error')
  }
}

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query(
      'DELETE FROM products WHERE id = $1 RETURNING *',
      [id]
    )
    res.json({ message: 'Product deleted' })
  } catch (err) {
    res.status(500).send('Server Error')
  }
}
const decreaseQuantity = async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query(
      'UPDATE products SET quantity = quantity - 1 WHERE id = $1 AND quantity > 0 RETURNING *',
      [id]
    )
    if (result.rowCount === 0)
      return res.status(400).json({ message: 'Product out of stock' })

    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).send('Server Error')
  }
}
const increaseQuantity = async (req, res) => {
  try {
    const { id } = req.params
    await pool.query(
      'Update products Set quantity = quantity + 1 WHERE id = $1',
      [id]
    )
    res.status(200).json({ message: 'Quantity increased' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server Error' })
  }
}
module.exports = {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  decreaseQuantity,
  increaseQuantity
}
