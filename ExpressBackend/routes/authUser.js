const express = require('express')
const router = express.Router()
const {
  registerUser,
  loginUser,
  getAllUsers,
  editUser,
  deleteUser,
  getUser,
  changePassword
} = require('../controllers/authUser')

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/', getAllUsers)
router.get('/:id', getUser)
router.put('/:id', editUser)
router.put('/:id/change-password', changePassword)
router.delete('/:id', deleteUser)
module.exports = router
