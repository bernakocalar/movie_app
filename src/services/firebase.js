import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Check if config is present
const isConfigured = firebaseConfig.apiKey && firebaseConfig.projectId;

let app;
let auth;
let db;

if (isConfigured) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} else {
  console.warn("Firebase config missing. Using Mock Mode.");
  // Mock Objects to prevent crashes and allow UI testing
  auth = {
    currentUser: null,
    onAuthStateChanged: (callback) => {
      // Create a fake listener
      return () => { };
    },
    signInWithEmailAndPassword: async (email, password) => {
      console.log("Mock Sign In", email);
      return { user: { email, uid: "mock-uid-123" } };
    },
    createUserWithEmailAndPassword: async (email, password) => {
      console.log("Mock Sign Up", email);
      return { user: { email, uid: "mock-uid-123" } };
    },
    signOut: async () => {
      console.log("Mock Sign Out");
    }
  };

  db = {
    // Basic mock for Firestore to prevent errors in components
    collection: () => ({}),
    addDoc: async () => console.log("Mock Add Doc"),
    getDocs: async () => ({ docs: [] })
  };
}

export { auth, db, isConfigured };
