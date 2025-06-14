const express = require('express')
const router = express.Router()
const {
  getPendingSalons,
  approveSalon,
  getSalonApprovalHistory,
  unapproveSalon
} = require('../controllers/approval')

router.get('/pending', getPendingSalons)
router.post('/approve', approveSalon)
router.get('/history/:salonId', getSalonApprovalHistory)
router.post('/unapprove', unapproveSalon)

module.exports = router
