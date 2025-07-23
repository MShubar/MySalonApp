const pool = require('../models/pool');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const uploadToAzure = require('../middleware/azureBlob');
const redisClient = require('../models/redis');

const JWT_SECRET = process.env.JWT_SECRET;

const registerSalon = async (req, res) => {
  let location;
  try {
    location = JSON.parse(req.body.location);
    if (location.lat && location.lng) {
      location.latitude = location.lat;
      location.longitude = location.lng;
    }
  } catch {
    console.log('Failed to parse location:', req.body.location);
  }

  const { name, email, password, rating, opening_time, closing_time } =
    req.body;
  const file = req.file;

  if (
    !name ||
    !email ||
    !password ||
    !rating ||
    !location ||
    !location.latitude ||
    !location.longitude ||
    !file ||
    !opening_time ||
    !closing_time
  ) {
    console.log('Validation failed: Missing fields');
    return res.status(400).json({
      message: 'All fields including opening and closing time are required',
    });
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const existing = await pool.query('SELECT * FROM salons WHERE email = $1', [
      normalizedEmail,
    ]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: 'Email is already in use' });
    }

    const image_url = await uploadToAzure(file);
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO salons
        (name, email, password, is_approved, image_url, rating, location, opening_time, closing_time)
       VALUES
        ($1, $2, $3, false, $4, $5, ST_SetSRID(ST_MakePoint($6, $7), 4326)::geography, $8, $9)
       RETURNING id, name, email, is_approved, image_url, rating, opening_time, closing_time,
                 ST_Y(location::geometry) AS latitude,
                 ST_X(location::geometry) AS longitude`,
      [
        name,
        normalizedEmail,
        hashedPassword,
        image_url,
        rating,
        location.longitude,
        location.latitude,
        opening_time,
        closing_time,
      ]
    );

    return res.status(201).json({
      message: 'Salon registered successfully',
      salon: result.rows[0],
    });
  } catch (err) {
    console.error('Register Salon Error:', err);
    if (err.code === '23505') {
      return res.status(409).json({ message: 'Email is already in use' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

const loginSalon = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const result = await pool.query('SELECT * FROM salons WHERE email = $1', [
      email,
    ]);
    const salon = result.rows[0];

    if (!salon) {
      return res.status(404).json({ message: 'Salon not found' });
    }

    const isMatch = await bcrypt.compare(password, salon.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    const token = jwt.sign({ salonId: salon.id, role: 'salon' }, JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Login Salon Error:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};
const getMySalon = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const result = await pool.query('SELECT * FROM salons WHERE id = $1', [
      decoded.salonId,
    ]);

    if (result.rowCount === 0)
      return res.status(404).json({ message: 'Salon not found' });

    const { password, ...salon } = result.rows[0];
    res.json(salon);
  } catch (err) {
    console.error('getMySalon error:', err.message);
    console.error('Stack:', err.stack);
    res.status(500).json({ message: 'Internal server error' });
  }
};
const getAllSalons = async (req, res) => {
  const { userLat, userLng, type } = req.query;

  try {
    const cacheKey = `salons:${userLat || ''}:${userLng || ''}:${type || ''}`;
    if (redisClient.isOpen) {
      const cached = await redisClient.get(cacheKey);
      if (cached) return res.json(JSON.parse(cached));
    }
    const lat = parseFloat(userLat);
    const lng = parseFloat(userLng);
    const useLocation = !isNaN(lat) && !isNaN(lng);

    const query = `
      SELECT 
        s.id, s.name, s.email, s.is_approved, s.image_url, s.rating,
        ST_X(s.location::geometry) AS longitude,
        ST_Y(s.location::geometry) AS latitude,
        ${
          useLocation
            ? 'ST_Distance(s.location::geography, ST_MakePoint($1, $2)::geography) AS distance,'
            : '0 AS distance,'
        }
        COALESCE(
          json_agg(DISTINCT jsonb_build_object('id', sv.id, 'name', sv.name)) FILTER (WHERE sv.id IS NOT NULL),
          '[]'
        ) AS services
      FROM salons s
      LEFT JOIN salon_services ss ON s.id = ss.salon_id
      LEFT JOIN services sv ON ss.service_id = sv.id
      ${
        type
          ? 'JOIN salon_type_map stm ON s.id = stm.salon_id JOIN salon_types t ON t.id = stm.type_id'
          : ''
      }
      ${type ? 'WHERE t.type_name = $3' : ''}
      GROUP BY s.id
      ${useLocation ? 'ORDER BY distance ASC' : ''}
    `;

    const params = type
      ? useLocation
        ? [lat, lng, type]
        : [type]
      : useLocation
      ? [lat, lng]
      : [];

    const result = await pool.query(query, params);

    if (redisClient.isOpen) {
      await redisClient.setEx(cacheKey, 3600, JSON.stringify(result.rows));
    }

    res.json(result.rows);
  } catch (err) {
    console.error('❌ ERROR in getAllSalons:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteSalon = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM approvals WHERE salon_id = $1', [id]);
    await pool.query('DELETE FROM salon_type_map WHERE salon_id = $1', [id]);

    const result = await pool.query(
      'DELETE FROM salons WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Salon not found' });
    }

    res.json({ message: 'Salon deleted successfully', salon: result.rows[0] });
  } catch (err) {
    console.error('Delete Salon Error:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const editSalon = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, rating, location } = req.body;
  const file = req.file;

  try {
    const existingSalon = await pool.query(
      'SELECT * FROM salons WHERE id = $1',
      [id]
    );
    if (existingSalon.rows.length === 0) {
      return res.status(404).json({ message: 'Salon not found' });
    }

    const current = existingSalon.rows[0];

    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : current.password;

    let imageUrl = current.image_url;
    if (file) {
      imageUrl = await uploadToAzure(file);
    }

    let updatedSalon;

    if (location && location.latitude && location.longitude) {
      updatedSalon = await pool.query(
        `UPDATE salons SET
          name = $1,
          email = $2,
          password = $3,
          image_url = $4,
          rating = $5,
          location = ST_SetSRID(ST_MakePoint($6, $7), 4326)::geography
        WHERE id = $8
        RETURNING id, name, email, is_approved, image_url, rating,
          ST_X(location::geometry) AS longitude,
          ST_Y(location::geometry) AS latitude`,
        [
          name || current.name,
          email || current.email,
          hashedPassword,
          imageUrl,
          rating || current.rating,
          location.longitude,
          location.latitude,
          id,
        ]
      );
    } else {
      updatedSalon = await pool.query(
        `UPDATE salons SET
          name = $1,
          email = $2,
          password = $3,
          image_url = $4,
          rating = $5
        WHERE id = $6
        RETURNING id, name, email, is_approved, image_url, rating,
          ST_X(location::geometry) AS longitude,
          ST_Y(location::geometry) AS latitude`,
        [
          name || current.name,
          email || current.email,
          hashedPassword,
          imageUrl,
          rating || current.rating,
          id,
        ]
      );
    }

    res.json({
      message: 'Salon updated successfully',
      salon: updatedSalon.rows[0],
    });
  } catch (err) {
    console.error('Edit Salon Error:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getSalonById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT s.id, s.name, s.email, s.is_approved, s.image_url, s.rating,
              s.opening_time, s.closing_time, -- add these two
              ST_X(s.location::geometry) AS longitude,
              ST_Y(s.location::geometry) AS latitude,
              COALESCE(
                json_agg(DISTINCT jsonb_build_object('id', sv.id, 'name', sv.name))
                FILTER (WHERE sv.id IS NOT NULL),
                '[]'
              ) AS services
       FROM salons s
       LEFT JOIN salon_services ss ON s.id = ss.salon_id
       LEFT JOIN services sv ON ss.service_id = sv.id
       WHERE s.id = $1
       GROUP BY s.id`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Salon not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get Salon By ID Error:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  registerSalon,
  loginSalon,
  getAllSalons,
  deleteSalon,
  editSalon,
  getSalonById,
  getMySalon,
};
