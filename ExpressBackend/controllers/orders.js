const pool = require('../models/pool')

// ✅ Place new order
const placeOrder = async (req, res) => {
  try {
    const {
      user_id,
      items,
      coordinates,
      address,
      paymentMethod,
      total,
      deliveryTime
    } = req.body

    if (!user_id) return res.status(400).json({ message: 'Missing user_id' })
    if (!items || items.length === 0)
      return res.status(400).json({ message: 'Missing items' })
    if (!address) return res.status(400).json({ message: 'Missing address' })
    if (!coordinates || !coordinates.lat || !coordinates.lng)
      return res.status(400).json({ message: 'Missing coordinates' })
    if (!paymentMethod)
      return res.status(400).json({ message: 'Missing payment method' })
    if (!total) return res.status(400).json({ message: 'Missing total' })

    const orderResult = await pool.query(
      `INSERT INTO orders 
        (user_id, building_number, apartment_number, street, block, note, lat, lng, payment_method, total, delivery_time, status, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'pending', NOW()) 
       RETURNING id`,
      [
        user_id,
        address.buildingNumber,
        address.apartmentNumber || null,
        address.street,
        address.block,
        address.note || '',
        coordinates.lat,
        coordinates.lng,
        paymentMethod,
        Number(total),
        deliveryTime
      ]
    )

    const orderId = orderResult.rows[0].id

    for (const item of items) {
      await pool.query(
        `INSERT INTO order_items 
          (order_id, item_id, item_type, name, price, quantity, image_url) 
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          orderId,
          item.id,
          item.type,
          item.name || item.title,
          Number(item.price),
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

// ✅ Get all orders by user ID
const getOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.params

    const result = await pool.query(
      `
      SELECT 
        o.id,
        o.total,
        COALESCE(o.status, 'pending') AS status,
        o.created_at,
        COALESCE(json_agg(
          json_build_object(
            'name', oi.name,
            'quantity', oi.quantity,
            'price', oi.price,
            'image_url', oi.image_url
          )
        ) FILTER (WHERE oi.id IS NOT NULL), '[]') AS items
      FROM orders o
      LEFT JOIN order_items oi ON oi.order_id = o.id
      WHERE o.user_id = $1
      GROUP BY o.id
      ORDER BY o.created_at DESC
      `,
      [userId]
    )

    res.json(result.rows)
  } catch (err) {
    console.error('Failed to get orders by user ID:', err)
    res.status(500).json({ message: 'Server error' })
  }
}

// ✅ Update order status (cancelled, delivered)
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params
    const { status } = req.body

    if (!['pending', 'cancelled', 'delivered'].includes(status.toLowerCase())) {
      return res.status(400).json({ message: 'Invalid status' })
    }

    await pool.query(`UPDATE orders SET status = $1 WHERE id = $2`, [
      status.toLowerCase(),
      orderId
    ])

    res.json({ message: 'Order status updated' })
  } catch (err) {
    console.error('Failed to update order status:', err)
    res.status(500).json({ message: 'Server error' })
  }
}

// ✅ Delete order
const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params

    await pool.query(`DELETE FROM order_items WHERE order_id = $1`, [orderId])
    await pool.query(`DELETE FROM orders WHERE id = $1`, [orderId])

    res.json({ message: 'Order deleted' })
  } catch (err) {
    console.error('Failed to delete order:', err)
    res.status(500).json({ message: 'Server error' })
  }
}
const cancelOrder = async (req, res) => {
  const { id } = req.params

  try {
    const result = await pool.query(
      `UPDATE orders SET status = 'Cancelled' WHERE id = $1 RETURNING status`,
      [id]
    )

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Order not found' })
    }

    res.json({ message: 'Order cancelled', status: 'Cancelled' })
  } catch (err) {
    console.error('Cancel order error:', err)
    res.status(500).json({ message: 'Server error' })
  }
}
// ✅ Get single order by ID
const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params

    const result = await pool.query(
      `
      SELECT 
        o.id,
        o.user_id,
        o.total,
        o.status,
        o.created_at,
        o.payment_method,
        o.delivery_time,
        COALESCE(json_agg(
          json_build_object(
            'name', oi.name,
            'quantity', oi.quantity,
            'price', oi.price,
            'image_url', oi.image_url
          )
        ) FILTER (WHERE oi.id IS NOT NULL), '[]') AS items
      FROM orders o
      LEFT JOIN order_items oi ON oi.order_id = o.id
      WHERE o.id = $1
      GROUP BY o.id
      `,
      [orderId]
    )

    if (result.rows.length === 0)
      return res.status(404).json({ message: 'Order not found' })

    res.json(result.rows[0])
  } catch (err) {
    console.error('Failed to get order by ID:', err)
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = {
  placeOrder,
  getOrdersByUserId,
  updateOrderStatus,
  deleteOrder,
  getOrderById,
  cancelOrder
}
