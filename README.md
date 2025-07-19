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
