# MySalonApp

## Seeding demo data

The Express backend includes a script for inserting sample users, salons and products.

1. Create the database and tables if you haven't already:

   ```bash
   psql -U postgres -d MySalons -f ExpressBackend/tables.sql
   ```

2. Run the seed script from the `ExpressBackend` directory:

   ```bash
   npm run seed
   ```

This uses the database connection settings from `ExpressBackend/models/pool.js`.
