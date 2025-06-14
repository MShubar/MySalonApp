const express = require('express')
const router = express.Router()
const {
  registerSalon,
  loginSalon,
  getAllSalons,
  deleteSalon,
  editSalon,
  getSalonById,
  getMySalon
} = require('../controllers/authSalon')
const multer = require('multer')
const upload = multer({ storage: multer.memoryStorage() })

router.post('/register', upload.single('image'), registerSalon)
router.post('/login', loginSalon)
router.get('/', getAllSalons)
router.get('/me', getMySalon)
router.get('/:id', getSalonById)

router.delete('/:id', deleteSalon)
router.put('/:id', upload.single('image'), editSalon)
module.exports = router
