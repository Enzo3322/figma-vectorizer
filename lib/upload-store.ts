// Store uploaded files in memory (simple MVP approach)
// In production, consider using a database or cloud storage
const uploadedFiles = new Map<string, { buffer: Buffer; metadata: any }>();

export function storeUploadedFile(fileId: string, data: { buffer: Buffer; metadata: any }) {
  uploadedFiles.set(fileId, data);

  // Clean up old files after 30 minutes
  setTimeout(() => {
    uploadedFiles.delete(fileId);
  }, 30 * 60 * 1000);
}

export function getUploadedFile(fileId: string) {
  return uploadedFiles.get(fileId);
}
