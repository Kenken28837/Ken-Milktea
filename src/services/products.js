// Product service
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot,
  serverTimestamp,
  increment
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";
import { db } from '../config/firebase.js';
import { parseNumber, parseInteger } from '../utils/helpers.js';

// Get all products
export async function getProducts() {
  try {
    const snapshot = await getDocs(collection(db, "products"));
    return snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    }));
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

// Get single product
export async function getProduct(id) {
  try {
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
}

// Add new product
export async function addProduct(productData) {
  try {
    const normalizedData = {
      name: productData.name.trim(),
      price: parseNumber(productData.price),
      description: productData.description.trim(),
      stock: parseInteger(productData.stock),
      imageUrl: productData.imageUrl.trim(),
      active: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, "products"), normalizedData);
    return docRef.id;
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
}

// Update product
export async function updateProduct(id, updates) {
  try {
    const docRef = doc(db, "products", id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
}

// Update product stock
export async function updateStock(id, newStock) {
  try {
    const docRef = doc(db, "products", id);
    await updateDoc(docRef, { stock: parseInteger(newStock) });
  } catch (error) {
    console.error("Error updating stock:", error);
    throw error;
  }
}

// Decrease stock (for orders)
export async function decreaseStock(id, quantity) {
  try {
    const docRef = doc(db, "products", id);
    await updateDoc(docRef, { stock: increment(-quantity) });
  } catch (error) {
    console.error("Error decreasing stock:", error);
    throw error;
  }
}

// Delete product
export async function deleteProduct(id) {
  try {
    const docRef = doc(db, "products", id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
}

// Listen to products changes
export function subscribeToProducts(callback) {
  return onSnapshot(collection(db, "products"), (snapshot) => {
    const products = snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    }));
    callback(products);
  });
}

// Validate product data
export function validateProduct(productData) {
  const errors = [];
  
  if (!productData.name?.trim()) {
    errors.push("Product name is required");
  }
  
  if (!productData.description?.trim()) {
    errors.push("Product description is required");
  }
  
  const price = parseNumber(productData.price);
  if (price < 0) {
    errors.push("Price must be non-negative");
  }
  
  const stock = parseInteger(productData.stock);
  if (stock < 0) {
    errors.push("Stock must be non-negative");
  }
  
  if (!productData.imageUrl?.trim()) {
    errors.push("Image URL is required");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
