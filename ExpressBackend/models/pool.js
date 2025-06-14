const { Pool } = require('pg')

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'MySalons',
  password: '38822164',
  port: 5432
})

module.exports = pool
