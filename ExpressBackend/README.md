# Express Backend

This directory contains the Express.js backend for MySalonApp.

## Docker

1. Build the Docker image from this folder:
   ```sh
   docker build -t express-backend .
   ```
2. Run the container and expose port 5000:
   ```sh
   docker run -p 5000:5000 express-backend
   ```
   Provide environment variables using `--env-file` or `-e` options if required.
