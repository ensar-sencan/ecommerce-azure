const { BlobServiceClient } = require('@azure/storage-blob');

let blobServiceClient;

function getBlobClient() {
  if (!blobServiceClient) {
    blobServiceClient = BlobServiceClient.fromConnectionString(
      process.env.AZURE_STORAGE_CONNECTION_STRING
    );
  }
  return blobServiceClient;
}

async function uploadImage(buffer, filename, mimetype) {
  const client = getBlobClient();
  const containerClient = client.getContainerClient(process.env.AZURE_STORAGE_CONTAINER);
  const blockBlobClient = containerClient.getBlockBlobClient(filename);
  await blockBlobClient.uploadData(buffer, {
    blobHTTPHeaders: { blobContentType: mimetype },
  });
  return blockBlobClient.url;
}

async function deleteImage(filename) {
  const client = getBlobClient();
  const containerClient = client.getContainerClient(process.env.AZURE_STORAGE_CONTAINER);
  const blockBlobClient = containerClient.getBlockBlobClient(filename);
  await blockBlobClient.deleteIfExists();
}

module.exports = { uploadImage, deleteImage };
