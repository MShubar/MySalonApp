const pool = require('../models/pool')

const placeOrder = async (req, res) => {
  try {
    const { items, coordinates, address, paymentMethod, total, deliveryTime } =
      req.body

    if (!items || !address || !coordinates || !paymentMethod || !total) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    // Insert order into orders table
    const orderResult = await pool.query(
      `INSERT INTO orders 
        (building_number, apartment_number, street, block, note, lat, lng, payment_method, total, delivery_time, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW()) 
       RETURNING id`,
      [
        address.buildingNumber,
        address.apartmentNumber || null,
        address.street,
        address.block,
        address.note || '',
        coordinates.lat,
        coordinates.lng,
        paymentMethod,
        total,
        deliveryTime
      ]
    )

    const orderId = orderResult.rows[0].id

    // Insert items into order_items table
    for (const item of items) {
      await pool.query(
        `INSERT INTO order_items 
          (order_id, item_id, item_type, name, price, quantity, image_url) 
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          orderId,
          item.id,
          item.type, // 'product' or 'package'
          item.name || item.title,
          item.price,
          item.quantity || 1,
          item.image_url || null
        ]
      )
    }

    res.status(201).json({ message: 'Order created', orderId })
  } catch (err) {
    console.error('Failed to save order:', err)
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = {
  placeOrder
}
