const express = require('express')
const router = express.Router()
const {
  getServices,
  addServices,
  getServiceById,
  updateServices,
  deleteServices,
  getServicesBySalonId,
  addServiceToSalon
} = require('../controllers/service')

router.get('/', getServices)
router.post('/salon/:salonId', addServiceToSalon)
router.get('/salon/:salonId', getServicesBySalonId)
router.post('/', addServices)
router.get('/:id', getServiceById)
router.put('/:id', updateServices)
router.delete('/:id', deleteServices)

module.exports = router
