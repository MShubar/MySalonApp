const pool = require('../models/pool')

const approveSalon = async (req, res) => {
  const { adminId, salonId } = req.body
  try {
    await pool.query('UPDATE salons SET is_approved = true WHERE id = $1', [
      salonId
    ])

    await pool.query(
      `INSERT INTO approvals (admin_id, salon_id, action)
       VALUES ($1, $2, 'approved')`,
      [adminId, salonId]
    )

    res.json({ message: 'Salon approved successfully' })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
}
const unapproveSalon = async (req, res) => {
  const { adminId, salonId } = req.body
  try {
    await pool.query('UPDATE salons SET is_approved = false WHERE id = $1', [
      salonId
    ])

    await pool.query(
      `INSERT INTO approvals (admin_id, salon_id, action)
       VALUES ($1, $2, 'unapproved')`,
      [adminId, salonId]
    )

    res.json({ message: 'Salon unapproved successfully' })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
}

const getPendingSalons = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM salons WHERE is_approved = false'
    )
    res.json(result.rows)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
}
const getSalonApprovalHistory = async (req, res) => {
  const { salonId } = req.params
  try {
    const result = await pool.query(
      `SELECT 
         a.action, 
         a.timestamp, 
         admins.username AS admin_name
       FROM approvals a
       JOIN admins ON a.admin_id = admins.id
       WHERE a.salon_id = $1
       ORDER BY a.timestamp DESC`,
      [salonId]
    )

    res.json(result.rows)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
}

module.exports = {
  approveSalon,
  unapproveSalon,
  getPendingSalons,
  getSalonApprovalHistory
}
