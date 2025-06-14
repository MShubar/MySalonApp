const pool = require('../models/pool')

const getContact = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM contacts')

    res.json(result.rows)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
}

const addContact = async (req, res) => {
  try {
    const { name, email, comment } = req.body

    const result = await pool.query(
      'INSERT INTO contacts (name, email, comment) VALUES ($1, $2, $3) RETURNING *',
      [name, email, comment]
    )
    res.json(result.rows[0])
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
}

module.exports = {
  getContact,
  addContact
}
