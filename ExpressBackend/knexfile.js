module.exports = {
  client: 'pg',
  connection: {
    user: 'postgres',
    host: 'localhost',
    database: 'MySalons',
    password: '38822164',
    port: 5432
  },
  migrations: {
    directory: './migrations'
  }
};
