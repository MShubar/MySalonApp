const express = require('express')
const router = express.Router()
const {
  assignTypesToSalon,
  getSalonTypes,
  getAllTypes,
  addType,
  getTypeById,
  updateType,
  deleteType
} = require('../controllers/types')
const multer = require('multer')
const upload = multer({ storage: multer.memoryStorage() })

router.post('/assign', assignTypesToSalon)
router.get('/type', getSalonTypes)
router.get('/', getAllTypes)
router.post('/', upload.single('image'), addType)
router.get('/:id', getTypeById)
router.put('/:id', upload.single('image'), updateType)
router.delete('/:id', deleteType)

module.exports = router
