const pool = require('../models/pool')
const addToCart = async (req, res) => {
  const { user_id, item_id, item_type, quantity } = req.body
  if (!['package', 'product'].includes(item_type)) {
    return res.status(400).json({ message: 'Invalid item type' })
  }

  try {
    await pool.query(
      `INSERT INTO cart_items (user_id, item_id, item_type, quantity)
       VALUES ($1, $2, $3, $4)`,
      [user_id, item_id, item_type, quantity || 1]
    )
    res.json({ message: 'Item added to cart' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Internal server error' })
  }
}

module.exports = {
  addToCart
}
