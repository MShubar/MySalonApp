const express = require('express')
const router = express.Router()
const { toggleFavorite, getFavorites } = require('../controllers/favorites')

router.get('/:userId', getFavorites)
router.post('/:salonId', toggleFavorite)

module.exports = router
