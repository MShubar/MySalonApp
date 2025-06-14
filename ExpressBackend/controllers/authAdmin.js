const pool = require('../models/pool')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const JWT_SECRET = 'your_secret_key_here'

const registerAdmin = async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: 'Username and password are required' })
  }

  try {
    const existing = await pool.query(
      'SELECT * FROM admins WHERE username = $1',
      [username]
    )
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: 'Username already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const result = await pool.query(
      'INSERT INTO admins (username, password) VALUES ($1, $2) RETURNING id, username',
      [username, hashedPassword]
    )

    res
      .status(201)
      .json({ message: 'Admin registered successfully', admin: result.rows[0] })
  } catch (err) {
    console.error('Register Admin Error:', err.message)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const loginAdmin = async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: 'Username and password are required' })
  }

  try {
    const result = await pool.query(
      'SELECT * FROM admins WHERE username = $1',
      [username]
    )
    const admin = result.rows[0]

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign({ adminId: admin.id, role: 'admin' }, JWT_SECRET, {
      expiresIn: '1h'
    })
    res.json({ message: 'Login successful', token })
  } catch (err) {
    console.error('Login Admin Error:', err.message)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const getAllAdmins = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, username FROM admins')
    res.json(result.rows)
  } catch (err) {
    console.error('Get All Admins Error:', err.message)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const editAdmin = async (req, res) => {
  const { id } = req.params
  const { username, password } = req.body

  try {
    const existing = await pool.query('SELECT * FROM admins WHERE id = $1', [
      id
    ])
    if (existing.rows.length === 0) {
      return res.status(404).json({ message: 'Admin not found' })
    }

    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : existing.rows[0].password

    const updated = await pool.query(
      'UPDATE admins SET username = $1, password = $2 WHERE id = $3 RETURNING id, username',
      [username || existing.rows[0].username, hashedPassword, id]
    )

    res.json({ message: 'Admin updated successfully', admin: updated.rows[0] })
  } catch (err) {
    console.error('Edit Admin Error:', err.message)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const deleteAdmin = async (req, res) => {
  const { id } = req.params

  try {
    const result = await pool.query(
      'DELETE FROM admins WHERE id = $1 RETURNING id, username',
      [id]
    )
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Admin not found' })
    }

    res.json({ message: 'Admin deleted successfully', admin: result.rows[0] })
  } catch (err) {
    console.error('Delete Admin Error:', err.message)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const logoutAdmin = (req, res) => {
  res.clearCookie('authToken')
  res.status(200).json({ message: 'Logout successful' })
}

module.exports = {
  registerAdmin,
  loginAdmin,
  getAllAdmins,
  editAdmin,
  deleteAdmin,
  logoutAdmin
}
