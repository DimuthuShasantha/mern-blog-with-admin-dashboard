// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-with-admin-dashboard.firebaseapp.com",
  projectId: "mern-blog-with-admin-dashboard",
  storageBucket: "mern-blog-with-admin-dashboard.appspot.com",
  messagingSenderId: "1088625265285",
  appId: "1:1088625265285:web:9d93929f62afd08b58f7ec"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
