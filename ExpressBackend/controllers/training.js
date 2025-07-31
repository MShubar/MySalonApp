const pool = require('../models/pool');

// TRAINING CRUD
const getTrainings = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM trainings');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

const createTraining = async (req, res) => {
  try {
    const {
      title,
      description,
      duration,
      price,
      is_live,
      max_participants,
      video_url,
      trainer_id,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO trainings (title, description, duration, price, is_live, max_participants, video_url, trainer_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [
        title,
        description,
        duration,
        price,
        is_live,
        max_participants,
        video_url,
        trainer_id,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

const getTrainingById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM trainings WHERE id = $1', [
      id,
    ]);
    if (result.rowCount === 0)
      return res.status(404).json({ message: 'Training not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

const updateTraining = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      duration,
      price,
      is_live,
      max_participants,
      video_url,
    } = req.body;

    const result = await pool.query(
      `UPDATE trainings SET title=$1, description=$2, duration=$3, price=$4, is_live=$5,
       max_participants=$6, video_url=$7 WHERE id=$8 RETURNING *`,
      [
        title,
        description,
        duration,
        price,
        is_live,
        max_participants,
        video_url,
        id,
      ]
    );

    if (result.rowCount === 0)
      return res.status(404).json({ message: 'Training not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

const deleteTraining = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM trainings WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rowCount === 0)
      return res.status(404).json({ message: 'Training not found' });
    res.json({ message: 'Training deleted' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// ENROLLMENTS
const enrollUserInTraining = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body;
    const result = await pool.query(
      'INSERT INTO user_training_enrollments (training_id, user_id, status) VALUES ($1, $2, $3) RETURNING *',
      [id, user_id, 'enrolled']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

const cancelUserEnrollmentRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body;
    await pool.query(
      'UPDATE user_training_enrollments SET status = $1 WHERE training_id = $2 AND user_id = $3',
      ['cancel_requested', id, user_id]
    );
    res.json({ message: 'Cancel request submitted' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

const getUserEnrollments = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      `SELECT t.*, e.id AS enrollment_id, e.status FROM trainings t
       JOIN user_training_enrollments e ON t.id = e.training_id
       WHERE e.user_id = $1`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

const enrollSalonInTraining = async (req, res) => {
  try {
    const { id } = req.params;
    const { salon_id } = req.body;
    const result = await pool.query(
      'INSERT INTO salon_training_enrollments (training_id, salon_id, status) VALUES ($1, $2, $3) RETURNING *',
      [id, salon_id, 'enrolled']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

const cancelSalonEnrollmentRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { salon_id } = req.body;
    await pool.query(
      'UPDATE salon_training_enrollments SET status = $1 WHERE training_id = $2 AND salon_id = $3',
      ['cancel_requested', id, salon_id]
    );
    res.json({ message: 'Cancel request submitted' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

const getSalonEnrollments = async (req, res) => {
  try {
    const { salonId } = req.params;
    const result = await pool.query(
      `SELECT t.*, e.id AS enrollment_id, e.status FROM trainings t
       JOIN salon_training_enrollments e ON t.id = e.training_id
       WHERE e.salon_id = $1`,
      [salonId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

const issueCertificate = async (req, res) => {
  try {
    const { enrollment_id, recipient_type } = req.body;
    const result = await pool.query(
      'INSERT INTO training_certificates (enrollment_id, recipient_type) VALUES ($1, $2) RETURNING *',
      [enrollment_id, recipient_type]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

module.exports = {
  getTrainings,
  createTraining,
  getTrainingById,
  updateTraining,
  deleteTraining,
  enrollUserInTraining,
  cancelUserEnrollmentRequest,
  getUserEnrollments,
  enrollSalonInTraining,
  cancelSalonEnrollmentRequest,
  getSalonEnrollments,
  issueCertificate,
};
