# Express Backend

This Express.js API uses Azure Blob Storage for storing uploaded files. The backend expects the following environment variables:

- **`AZURE_STORAGE_CONNECTION_STRING`** – connection string for your Azure Storage account.
- **`AZURE_CONTAINER_NAME`** – name of the blob container where files are uploaded.

## Getting the values

1. Sign in to the [Azure portal](https://portal.azure.com/) and open your Storage Account.
2. Under **Security + networking** choose **Access keys** and copy a **Connection string**. Use this for `AZURE_STORAGE_CONNECTION_STRING`.
3. In the Storage Account menu select **Containers**, create a container (for example `salons`) and use its name for `AZURE_CONTAINER_NAME`.

Add these variables to `ExpressBackend/.env` or your system environment before running `npm start`.

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

