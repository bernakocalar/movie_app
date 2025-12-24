import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBqAn7rlZacv1IAhdcNPr43-QTtuksg4pw",
  authDomain: "movie-app-d7ec2.firebaseapp.com",
  projectId: "movie-app-d7ec2",
  storageBucket: "movie-app-d7ec2.firebasestorage.app",
  messagingSenderId: "599757631882",
  appId: "1:599757631882:web:b16128123e247f37be9873",
  measurementId: "G-F9N7N812F3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const isConfigured = true;

export { auth, db, isConfigured };
