const fs = require('fs');
const path = require('path');

exports.up = function(knex) {
  const sql = fs.readFileSync(path.join(__dirname, '..', 'tables.sql')).toString();
  return knex.raw(sql);
};

exports.down = function(knex) {
  return knex.raw('DROP TABLE IF EXISTS approvals, salon_type_map, types, packages, products, favorites, bookings, admins, salons, users CASCADE');
};
