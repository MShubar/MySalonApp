# MySalonApp

## Cypress Tests

Cypress is configured in the project root. Before running the tests, start the user web app in another terminal:

```bash
cd WebsiteUser
npm install
npm run dev
```

This starts the site on `http://localhost:5173`. Then run the Cypress tests from the project root:

```bash
npm run cy:run        # headless run
# or
npm run cy:open       # interactive mode (requires a desktop environment)
```

The basic tests cover the login page, booking creation page and the checkout page.
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
This repository contains the source code for a salon booking system. It is split
into multiple projects that run independently.

## Projects

- **ExpressBackend** – Node.js/Express API with Jest tests.
- **WebsiteUser** – React application for customers.
- **WebsiteSalon** – React portal for salon staff.
- **WebsiteAdmin** – React dashboard for administrators.
- **AppUser** – placeholder for a mobile app.
- **Design** – UI/UX assets.

## Prerequisites

Install [Node.js](https://nodejs.org/) (version 18 or later recommended) and npm.
Each project manages its own `node_modules` directory.

## Installing dependencies

From the repository root, run the following in each project folder the first
time you set up the repo:

```bash
cd ExpressBackend && npm install
cd ../WebsiteUser && npm install
cd ../WebsiteSalon && npm install
cd ../WebsiteAdmin && npm install
```

## Running the Express server

Start the backend API with:

```bash
cd ExpressBackend
npm start
```

Use `npm run nodemon` during development to automatically reload on changes. The
server listens on the `PORT` environment variable (defaults to `5000`).

## Launching the React applications

Each React project uses Vite. Start a development server from its directory with

```bash
npm run dev
```

For example, to launch the user website:

```bash
cd WebsiteUser
npm run dev
```

Run the same command in `WebsiteSalon` and `WebsiteAdmin` to launch those apps.

## Running backend tests

Jest tests reside in `ExpressBackend/tests`. Run them with:

```bash
cd ExpressBackend
npm test
```

## License

This project is licensed under the terms of the MIT license. See the
[LICENSE](LICENSE) file for details.
