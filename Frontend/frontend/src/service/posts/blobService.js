import { BlobServiceClient, BlockBlobClient } from "@azure/storage-blob";

const blobSasUrl =
  "https://fakelookstorage.blob.core.windows.net/uploads?sp=racwdli&st=2022-10-01T18:49:37Z&se=2022-10-30T03:49:37Z&sv=2021-06-08&sr=c&sig=eVakDUDOLxNg9d2Y5WpvtIeqaiz6i4fkpbeL3GCgpMY%3D";

export class BlobService {
  #blobServiceClient = new BlobServiceClient(blobSasUrl);
  #containerClient = this.#blobServiceClient.getContainerClient("uploads");

  async uploadFiles(file) {
    const blockBlobClient = this.#containerClient.getBlockBlobClient(file.name);
    const f = await blockBlobClient.uploadBrowserData(file);
    return f._response.request.url;
  }

  async deleteFile(fileName) {
    const options = { deleteSnapshots: "include" };
    const blockBlobClient = this.#containerClient.getBlockBlobClient(fileName);
    await blockBlobClient.deleteIfExists(options);
  }
}
