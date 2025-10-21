// Authentication service
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";
import { auth, db } from '../config/firebase.js';

// Role resolution with claims-first approach
export async function resolveRole(user) {
  if (!user) return "guest";
  
  try {
    const token = await user.getIdTokenResult(true);
    console.log("Token claims:", token?.claims);
    if (token?.claims?.admin) return "admin";
    
    const snap = await getDoc(doc(db, "users", user.uid));
    if (snap.exists()) {
      const userData = snap.data();
      console.log("User data from Firestore:", userData);
      return userData.role || "user";
    }
  } catch (e) {
    console.error("Role lookup failed", e);
  }
  return "user";
}

// Login with email and password
export async function loginWithEmail(email, password) {
  if (!email || !password) throw new Error("Missing credentials");
  
  const { user } = await signInWithEmailAndPassword(auth, email, password);

  if (!user.emailVerified) {
    await signOut(auth);
    throw new Error("Email not verified");
  }

  const role = await resolveRole(user);
  return { user, role };
}

// Register new user
export async function registerUser(email, password, username = null) {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  
  if (username) {
    await updateProfile(user, { displayName: username });
  }
  
  await setDoc(doc(db, "users", user.uid), {
    email: user.email,
    role: "user",
    username: username || null,
    createdAt: new Date()
  });
  
  await sendEmailVerification(user);
  return user;
}

// Password reset
export async function resetPassword(email) {
  await sendPasswordResetEmail(auth, email);
}

// Get current user info
export async function getCurrentUser() {
  const user = auth.currentUser;
  if (!user) return null;
  
  const role = await resolveRole(user);
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    role,
    verified: user.emailVerified
  };
}

// Logout
export async function logout() {
  await signOut(auth);
}

// Auth state watcher
export function watchAuthState(callback) {
  return onAuthStateChanged(auth, callback);
}

// Route guard
export function createRouteGuard(requiredRole) {
  return async (user) => {
    if (!user) {
      console.log("No user found");
      return false;
    }
    if (!user.emailVerified) {
      console.log("User email not verified");
      return false;
    }
    
    try {
      const role = await resolveRole(user);
      console.log(`Required role: ${requiredRole}, User role: ${role}`);
      if (requiredRole === "admin" && role !== "admin") {
        console.log("User is not admin");
        return false;
      }
      console.log("User is authorized");
      return true;
    } catch (error) {
      console.error("Error resolving role:", error);
      return false;
    }
  };
}
