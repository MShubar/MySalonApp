const AZURE_STORAGE_CONNECTION_STRING =
  process.env.AZURE_STORAGE_CONNECTION_STRING

if (!AZURE_STORAGE_CONNECTION_STRING) {
  throw new Error('Azure Storage connection string is not defined')
}

const { BlobServiceClient } = require('@azure/storage-blob')
const path = require('path')
const { v4: uuidv4 } = require('uuid')

const blobServiceClient = BlobServiceClient.fromConnectionString(
  AZURE_STORAGE_CONNECTION_STRING
)

const AZURE_CONTAINER_NAME = process.env.AZURE_CONTAINER_NAME
if (!AZURE_CONTAINER_NAME) {
  throw new Error('Azure Container name is not defined')
}

const containerClient = blobServiceClient.getContainerClient(AZURE_CONTAINER_NAME)

const uploadToAzure = async (file) => {
  if (!file || !file.buffer || !file.originalname) {
    throw new Error(
      'Invalid file upload. File, buffer, or originalname is missing.'
    )
  }

  const extension = path.extname(file.originalname)
  const blobName = `${uuidv4()}${extension}`

  const blockBlobClient = containerClient.getBlockBlobClient(blobName)

  const options = {
    blobHTTPHeaders: {
      blobContentType: file.mimetype || 'application/octet-stream'
    }
  }

  await blockBlobClient.uploadData(file.buffer, options)

  const blobUrl = blockBlobClient.url
  return blobUrl
}

module.exports = uploadToAzure
