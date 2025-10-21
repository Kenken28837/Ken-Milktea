// Firebase configuration and initialization
import { initializeApp, getApp, getApps } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-storage.js";

// Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyCHCZ_SAvTxHYjgmRfiCF3fW2SzB3YnFh8",
  authDomain: "my-moonbucks-firebase-id.firebaseapp.com",
  projectId: "my-moonbucks-firebase-id",
  storageBucket: "my-moonbucks-firebase-id.appspot.com",
  messagingSenderId: "361396425482",
  appId: "1:361396425482:web:557ee43bc8b5af33da20f3"
};

// Initialize Firebase app
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export { app };
