const pool = require('../models/pool')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET

const registerUser = async (req, res) => {
  const { username, email, password } = req.body

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: 'Username, email, and password are required' })
  }

  try {
    const existing = await pool.query('SELECT * FROM users WHERE email = $1', [
      email
    ])
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: 'Email is already in use' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, email, hashedPassword]
    )

    return res.status(201).json({
      message: 'User registered successfully',
      user: result.rows[0]
    })
  } catch (err) {
    console.error('Register User Error:', err.message)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const loginUser = async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: 'Username and password are required' })
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [
      username
    ])
    const user = result.rows[0]

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password' })
    }

    const token = jwt.sign({ userId: user.id, role: 'user' }, JWT_SECRET, {
      expiresIn: '1h'
    })

    res.json({
      message: 'Login successful',
      token,
      id: user.id,
      username: user.username
    })
  } catch (err) {
    console.error('Login User Error:', err.message)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, username, email FROM users')
    res.json(result.rows)
  } catch (err) {
    console.error('Get All Users Error:', err.message)
    res.status(500).json({ message: 'Internal server error' })
  }
}
const getUser = async (req, res) => {
  const { id } = req.params

  try {
    const result = await pool.query(
      'SELECT id, username, email FROM users WHERE id = $1',
      [id]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.json(result.rows[0])
  } catch (err) {
    console.error('Get User By ID Error:', err.message)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const deleteUser = async (req, res) => {
  const { id } = req.params

  try {
    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING *',
      [id]
    )

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({ message: 'User deleted successfully', user: result.rows[0] })
  } catch (err) {
    console.error('Delete User Error:', err.message)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const editUser = async (req, res) => {
  const { id } = req.params
  const { username, email, password } = req.body

  try {
    const existingUser = await pool.query('SELECT * FROM users WHERE id = $1', [
      id
    ])
    if (existingUser.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' })
    }

    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : existingUser.rows[0].password

    const updatedUser = await pool.query(
      'UPDATE users SET username = $1, email = $2, password = $3 WHERE id = $4 RETURNING id, username, email',
      [
        username || existingUser.rows[0].username,
        email || existingUser.rows[0].email,
        hashedPassword,
        id
      ]
    )

    res.json({
      message: 'User updated successfully',
      user: updatedUser.rows[0]
    })
  } catch (err) {
    console.error('Edit User Error:', err.message)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const changePassword = async (req, res) => {
  const { id } = req.params
  const { currentPassword, newPassword } = req.body

  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ message: 'Current and new password are required' })
  }

  try {
    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [
      id
    ])
    const user = userResult.rows[0]

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const passwordMatch = await bcrypt.compare(currentPassword, user.password)
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' })
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10)

    const updateResult = await pool.query(
      'UPDATE users SET password = $1 WHERE id = $2 RETURNING id',
      [hashedNewPassword, id]
    )

    if (updateResult.rowCount === 0) {
      return res.status(500).json({ message: 'Failed to update password' })
    }

    return res.json({ message: 'Password changed successfully' })
  } catch (error) {
    console.error('Change password error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

module.exports = {
  changePassword,
  registerUser,
  loginUser,
  getAllUsers,
  deleteUser,
  editUser,
  getUser
}
