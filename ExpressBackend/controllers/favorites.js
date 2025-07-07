const pool = require('../models/pool')

const toggleFavorite = async (req, res) => {
  const { userId, salonId } = req.params

  if (!userId || !salonId) {
    return res
      .status(400)
      .json({ message: 'User ID and Salon ID are required' })
  }

  try {
    const favCheck = await pool.query(
      'SELECT * FROM favorites WHERE user_id = $1 AND salon_id = $2',
      [userId, salonId]
    )

    if (favCheck.rows.length > 0) {
      await pool.query(
        'DELETE FROM favorites WHERE user_id = $1 AND salon_id = $2',
        [userId, salonId]
      )
    } else {
      await pool.query(
        'INSERT INTO favorites (user_id, salon_id) VALUES ($1, $2)',
        [userId, salonId]
      )
    }

    const updatedFavoritesRes = await pool.query(
      'SELECT salon_id FROM favorites WHERE user_id = $1',
      [userId]
    )
    const updatedFavorites = updatedFavoritesRes.rows.map((row) => row.salon_id)

    res.json({
      message:
        favCheck.rows.length > 0
          ? 'Removed from favorites'
          : 'Added to favorites',
      favorites: updatedFavorites
    })
  } catch (error) {
    console.error('Toggle Favorite Error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const getFavorites = async (req, res) => {
  const { userId } = req.params

  try {
    const result = await pool.query(
      `SELECT 
        s.id, s.name, s.email, s.is_approved, s.image_url, s.rating,
        ST_X(s.location::geometry) AS longitude,
        ST_Y(s.location::geometry) AS latitude,
        COALESCE(
          json_agg(DISTINCT jsonb_build_object('id', sv.id, 'name', sv.name))
          FILTER (WHERE sv.id IS NOT NULL),
          '[]'
        ) AS services
      FROM favorites f
      JOIN salons s ON f.salon_id = s.id
      LEFT JOIN salon_services ss ON s.id = ss.salon_id
      LEFT JOIN services sv ON ss.service_id = sv.id
      WHERE f.user_id = $1
      GROUP BY s.id`,
      [userId]
    )

    res.json(result.rows)
  } catch (err) {
    console.error('Get Favorites Error:', err.message)
    res.status(500).json({ message: 'Internal server error' })
  }
}

module.exports = {
  toggleFavorite,
  getFavorites
}
