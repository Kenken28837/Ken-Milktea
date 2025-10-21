import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-storage.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCHCZ_SAvTxHYjgmRfiCF3fW2SzB3YnFh8",
  authDomain: "my-moonbucks-firebase-id.firebaseapp.com",
  projectId: "my-moonbucks-firebase-id",
  storageBucket: "my-moonbucks-firebase-id.appspot.com",
  messagingSenderId: "361396425482",
  appId: "1:361396425482:web:557ee43bc8b5af33da20f3",
  measurementId: "G-E04CRTG277"
};

// Init once
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Claims-first role check; falls back to Firestore doc for legacy data.
// why: claims are authoritative for rules; doc is informational.
async function resolveRole(user) {
  if (!user) return "guest";
  const token = await user.getIdTokenResult(true); // force refresh to get latest claims
  if (token?.claims?.admin) return "admin";
  try {
    const snap = await getDoc(doc(db, "users", user.uid));
    if (snap.exists()) return snap.data().role || "user";
  } catch (e) {
    console.error("role lookup failed", e);
  }
  return "user";
}

// Login with Email (emailVerified + fresh claims)
export async function loginWithEmail(email, password) {
  if (!email || !password) throw new Error("Missing credentials");
  const { user } = await signInWithEmailAndPassword(auth, email, password);

  if (!user.emailVerified) {
    await signOut(auth);
    if (typeof Swal !== "undefined") {
      await Swal.fire({
        icon: "warning",
        title: "Verify your email",
        text: "Check your inbox and verify before logging in.",
        confirmButtonText: "OK"
      });
    }
    throw new Error("Email not verified");
  }

  // Refresh claims and route by role
  const role = await resolveRole(user);
  window.location.href = role === "admin" ? "admin.html" : "user.html";
}

// Guard pages by role (admins can visit user pages; users cannot visit admin pages)
export function watchAndGuard(requiredRole) {
  onAuthStateChanged(auth, async (u) => {
    if (!u) { window.location.href = "Login.html"; return; }
    if (!u.emailVerified) { await signOut(auth); window.location.href = "Login.html"; return; }

    const role = await resolveRole(u);
    if (requiredRole === "admin" && role !== "admin") {
      window.location.href = "user.html"; return;
    }
    // if requiredRole === "user": allow both user/admin
  });
}

// Who Am I (claims-first)
export async function whoAmI() {
  const u = auth.currentUser;
  if (!u) return null;
  const token = await u.getIdTokenResult(true);
  const role = token?.claims?.admin ? "admin" : await (async () => {
    try {
      const snap = await getDoc(doc(db, "users", u.uid));
      return snap.exists() ? (snap.data().role || "user") : "user";
    } catch { return "user"; }
  })();
  return { uid: u.uid, email: u.email, role, verified: u.emailVerified };
}

// Logout
export async function logout() {
  await signOut(auth);
  window.location.href = "Login.html";
}

// Exports
export { app, db, storage, auth };