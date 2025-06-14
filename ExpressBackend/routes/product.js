const express = require('express')
const router = express.Router()
const {
  getProducts,
  addProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  decreaseQuantity,
  increaseQuantity
} = require('../controllers/product')
const multer = require('multer')
const upload = multer({ storage: multer.memoryStorage() })

router.get('/', getProducts)
router.post('/', upload.single('image'), addProduct)
router.get('/:id', getProductById)
router.put('/:id', upload.single('image'), updateProduct)
router.patch('/:id/decrease', decreaseQuantity)
router.patch('/:id/increase', increaseQuantity)
router.delete('/:id', deleteProduct)

module.exports = router
