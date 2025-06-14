const express = require('express')
const router = express.Router()
const adminController = require('../controllers/authAdmin')

router.post('/register', adminController.registerAdmin)
router.post('/login', adminController.loginAdmin)
router.get('/', adminController.getAllAdmins)
router.put('/:id', adminController.editAdmin)
router.delete('/:id', adminController.deleteAdmin)
router.post('/logout', adminController.logoutAdmin)

module.exports = router
