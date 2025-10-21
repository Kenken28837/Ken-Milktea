// /products.js
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";
import { app } from "./auth.js"; // app is exported from auth.js


const db = getFirestore(app);


export async function getProducts() {
try {
const snapshot = await getDocs(collection(db, "products"));
// include doc id so cart has a stable key
const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
return products;
} catch (err) {
console.error("Error fetching products:", err);
return [];
}
}