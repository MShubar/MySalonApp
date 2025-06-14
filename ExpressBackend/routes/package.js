const express = require('express')
const router = express.Router()
const {
  getPackages,
  addPackage,
  getPackageById,
  updatePackage,
  deletePackage,
  increaseQuantity,
  decreaseQuantity
} = require('../controllers/package')
const multer = require('multer')
const upload = multer({ storage: multer.memoryStorage() })

router.get('/', getPackages)
router.post('/', upload.single('image'), addPackage)
router.get('/:id', getPackageById)
router.put('/:id', upload.single('image'), updatePackage)
router.patch('/:id/increase', increaseQuantity)
router.patch('/:id/decrease', decreaseQuantity)
router.delete('/:id', deletePackage)

module.exports = router
