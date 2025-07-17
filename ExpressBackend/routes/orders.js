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

// ✅ Get single order by order ID
router.get('/order/:orderId', getOrderById)
// ✅ Get all orders by user ID
router.get('/:userId', getOrdersByUserId)

// ✅ Update order status
router.put('/:orderId/status', updateOrderStatus)

router.patch('/order/:id/cancel', cancelOrder)
// ✅ Delete an order
router.delete('/:orderId', deleteOrder)

module.exports = router
