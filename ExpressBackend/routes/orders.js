const express = require('express')
const router = express.Router()
const {
  placeOrder,
  getOrdersByUserId,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  cancelOrder
} = require('../controllers/orders')

// ✅ Place a new order
router.post('/', placeOrder)

// ✅ Get all orders by user ID
router.get('/:userId', getOrdersByUserId)

// ✅ Get single order by order ID
router.get('/order/:orderId', getOrderById)

// ✅ Update order status
router.put('/:orderId/status', updateOrderStatus)

router.patch('orders/order/:id/cancel', cancelOrder)
// ✅ Delete an order
router.delete('/:orderId', deleteOrder)

module.exports = router
