// Order service
import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";
import { db } from '../config/firebase.js';
import { parseNumber } from '../utils/helpers.js';

// Create new order
export async function createOrder(orderData) {
  try {
    const order = {
      userId: orderData.userId,
      items: orderData.items.map(item => ({
        productId: item.id,
        name: item.name,
        price: parseNumber(item.price),
        qty: parseInt(item.qty, 10),
        imageUrl: item.imageUrl || null
      })),
      total: parseNumber(orderData.total),
      status: 'ongoing',
      paymentStatus: 'pending',
      deliveryStatus: 'pending',
      createdAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, "orders"), order);
    return { id: docRef.id, ...order };
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
}

// Get orders by user
export async function getUserOrders(userId) {
  try {
    const q = query(collection(db, "orders"), where("userId", "==", userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    }));
  } catch (error) {
    console.error("Error fetching user orders:", error);
    throw error;
  }
}

// Get all orders
export async function getAllOrders() {
  try {
    const snapshot = await getDocs(collection(db, "orders"));
    return snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    }));
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
}

// Update order status
export async function updateOrderStatus(orderId, status) {
  try {
    const docRef = doc(db, "orders", orderId);
    await updateDoc(docRef, { deliveryStatus: status });
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
}

// Update payment proof
export async function updatePaymentProof(orderId, proofUrl) {
  try {
    const docRef = doc(db, "orders", orderId);
    await updateDoc(docRef, { 
      proofUrl, 
      paymentStatus: 'submitted' 
    });
  } catch (error) {
    console.error("Error updating payment proof:", error);
    throw error;
  }
}

// Delete order
export async function deleteOrder(orderId) {
  try {
    const docRef = doc(db, "orders", orderId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting order:", error);
    throw error;
  }
}

// Listen to user orders
export function subscribeToUserOrders(userId, callback) {
  const q = query(collection(db, "orders"), where("userId", "==", userId));
  return onSnapshot(q, (snapshot) => {
    const orders = snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    }));
    callback(orders);
  });
}

// Listen to all orders
export function subscribeToAllOrders(callback) {
  return onSnapshot(collection(db, "orders"), (snapshot) => {
    const orders = snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    }));
    callback(orders);
  });
}

// Normalize order data
export function normalizeOrder(order) {
  return {
    id: order.id,
    items: Array.isArray(order.items) ? order.items : [],
    total: parseNumber(order.total),
    paymentStatus: order.paymentStatus || 'pending',
    adminStatus: order.status || 'ongoing',
    deliveryStatus: order.deliveryStatus || 'pending',
    proofUrl: order.proofUrl || null,
    createdAt: order.createdAt?.toDate ? order.createdAt.toDate() : new Date()
  };
}

// Map delivery status to display text
export function mapDeliveryStatus(status) {
  const statusMap = {
    'pending': 'Pending',
    'cancelled': 'Cancelled',
    'on_the_way': 'On the way',
    'delivered': 'Delivered'
  };
  return statusMap[status] || 'Pending';
}
