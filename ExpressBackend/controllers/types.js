const pool = require('../models/pool')
const uploadToAzure = require('../middleware/azureBlob')

const assignTypesToSalon = async (req, res) => {
  const { salonId, typeIds } = req.body

  if (!salonId || !Array.isArray(typeIds) || typeIds.length === 0) {
    return res.status(400).json({ message: 'salonId and typeIds are required' })
  }

  try {
    const validTypesQuery = `
      SELECT id FROM salon_types WHERE id = ANY($1)
    `
    const { rows: validTypes } = await pool.query(validTypesQuery, [typeIds])

    if (validTypes.length !== typeIds.length) {
      const invalidTypeIds = typeIds.filter(
        (typeId) => !validTypes.some((valid) => valid.id === typeId)
      )
      return res.status(400).json({
        message: `One or more typeIds do not exist in salon_types: ${invalidTypeIds.join(
          ', '
        )}`
      })
    }

    const insertPromises = typeIds.map(async (typeId) => {
      try {
        await pool.query(
          'INSERT INTO salon_type_map (salon_id, type_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [salonId, typeId]
        )
      } catch (err) {
        console.error(`Error inserting type ${typeId}:`, err)
      }
    })

    await Promise.all(insertPromises)

    res.json({ message: 'Types assigned successfully' })
  } catch (err) {
    console.error('Error assigning types:', err.message)
    res.status(500).json({ message: 'Server Error' })
  }
}

const getSalonTypes = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        s.id AS salon_id, 
        s.name AS salon_name,
        t.id AS type_id, 
        t.type_name
      FROM salons s
      JOIN salon_type_map stm ON s.id = stm.salon_id
      JOIN salon_types t ON t.id = stm.type_id
      ORDER BY s.id
    `)

    const grouped = result.rows.reduce((acc, row) => {
      if (!acc[row.salon_id]) {
        acc[row.salon_id] = {
          salonId: row.salon_id,
          salonName: row.salon_name,
          types: []
        }
      }
      acc[row.salon_id].types.push({
        typeId: row.type_id,
        typeName: row.type_name
      })
      return acc
    }, {})

    res.json(Object.values(grouped))
  } catch (err) {
    console.error('Error fetching all salon types:', err.message)
    res.status(500).json({ message: 'Server Error' })
  }
}

const getAllTypes = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, type_name, image_url FROM salon_types ORDER BY id'
    )
    res.json(result.rows)
  } catch (err) {
    console.error('Error fetching all types:', err.message)
    res.status(500).json({ message: 'Server Error' })
  }
}

const addType = async (req, res) => {
  const { type_name } = req.body
  const file = req.file

  if (!file) {
    return res.status(400).json({ message: 'Image file is required' })
  }

  try {
    const imageUrl = await uploadToAzure(file)
    const result = await pool.query(
      'INSERT INTO salon_types (type_name, image_url) VALUES ($1, $2) RETURNING *',
      [type_name, imageUrl]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error('Error adding type:', err.message)
    res.status(500).json({ message: 'Server Error' })
  }
}

const getTypeById = async (req, res) => {
  const { id } = req.params
  try {
    const result = await pool.query('SELECT * FROM salon_types WHERE id = $1', [
      id
    ])
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Type not found' })
    }
    res.json(result.rows[0])
  } catch (err) {
    console.error('Error fetching type by ID:', err.message)
    res.status(500).json({ message: 'Server Error' })
  }
}

const updateType = async (req, res) => {
  const { id } = req.params
  const { type_name } = req.body
  const file = req.file
  try {
    const currentResult = await pool.query(
      'SELECT * FROM salon_types WHERE id = $1',
      [id]
    )

    if (currentResult.rowCount === 0) {
      return res.status(404).json({ message: 'Type not found' })
    }

    let imageUrl = currentResult.rows[0].image_url
    if (file) {
      imageUrl = await uploadToAzure(file)
    }

    const result = await pool.query(
      'UPDATE salon_types SET type_name = $1, image_url = $2 WHERE id = $3 RETURNING *',
      [type_name, imageUrl, id]
    )
    res.json(result.rows[0])
  } catch (err) {
    console.error('Error updating type:', err.message)
    res.status(500).json({ message: 'Server Error' })
  }
}

const deleteType = async (req, res) => {
  const { id } = req.params
  try {
    const result = await pool.query(
      'DELETE FROM salon_types WHERE id = $1 RETURNING *',
      [id]
    )
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Type not found' })
    }
    res.json({ message: 'Type deleted successfully' })
  } catch (err) {
    console.error('Error deleting type:', err.message)
    res.status(500).json({ message: 'Server Error' })
  }
}

module.exports = {
  addType,
  getAllTypes,
  getTypeById,
  updateType,
  deleteType,
  getSalonTypes,
  assignTypesToSalon
}
