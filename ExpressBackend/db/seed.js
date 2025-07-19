const pool = require('../models/pool');
const bcrypt = require('bcrypt');

async function seed() {
  try {
    // Clear existing data
    await pool.query('TRUNCATE TABLE products RESTART IDENTITY CASCADE');
    await pool.query('TRUNCATE TABLE salons RESTART IDENTITY CASCADE');
    await pool.query('TRUNCATE TABLE users RESTART IDENTITY CASCADE');

    // Users
    const users = [
      { username: 'alice', email: 'alice@example.com', password: 'password' },
      { username: 'bob', email: 'bob@example.com', password: 'password' }
    ];
    const userIds = [];
    for (const u of users) {
      const hash = await bcrypt.hash(u.password, 10);
      const res = await pool.query(
        'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id',
        [u.username, u.email, hash]
      );
      userIds.push(res.rows[0].id);
    }

    // Salons
    const salons = [
      { name: 'Elegant Salon', email: 'elegant@example.com', password: 'password', is_approved: true },
      { name: 'Style Studio', email: 'style@example.com', password: 'password', is_approved: true }
    ];
    const salonIds = [];
    for (const s of salons) {
      const hash = await bcrypt.hash(s.password, 10);
      const res = await pool.query(
        'INSERT INTO salons (name, email, password, is_approved) VALUES ($1, $2, $3, $4) RETURNING id',
        [s.name, s.email, hash, s.is_approved]
      );
      salonIds.push(res.rows[0].id);
    }

    // Products
    const products = [
      { salonIndex: 0, name: 'Shampoo', description: 'Gentle cleansing shampoo', price: 9.99 },
      { salonIndex: 0, name: 'Conditioner', description: 'Hydrating conditioner', price: 12.99 },
      { salonIndex: 1, name: 'Hair Spray', description: 'Extra hold hair spray', price: 7.5 }
    ];
    for (const p of products) {
      await pool.query(
        'INSERT INTO products (salon_id, name, description, price) VALUES ($1, $2, $3, $4)',
        [salonIds[p.salonIndex], p.name, p.description, p.price]
      );
    }

    console.log('Seeding completed successfully');
  } catch (err) {
    console.error('Seeding failed:', err);
  } finally {
    await pool.end();
  }
}

seed();
