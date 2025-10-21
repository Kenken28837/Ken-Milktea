// Storage service for file uploads
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-storage.js";
import { storage } from '../config/firebase.js';

// Upload file to storage
export async function uploadFile(file, path) {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}

// Upload payment proof
export async function uploadPaymentProof(file, orderId) {
  const timestamp = Date.now();
  const fileName = `${timestamp}_${file.name}`;
  const path = `proofs/${orderId}/${fileName}`;
  return await uploadFile(file, path);
}

// Delete file from storage
export async function deleteFile(path) {
  try {
    const fileRef = ref(storage, path);
    await deleteObject(fileRef);
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
}

// Validate file type
export function validateFileType(file, allowedTypes = ['image/jpeg', 'image/png', 'image/webp']) {
  return allowedTypes.includes(file.type);
}

// Validate file size (in bytes)
export function validateFileSize(file, maxSize = 5 * 1024 * 1024) { // 5MB default
  return file.size <= maxSize;
}

// Get file info
export function getFileInfo(file) {
  return {
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified
  };
}

// Format file size
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
