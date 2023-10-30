// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "propz-mern.firebaseapp.com",
  projectId: "propz-mern",
  storageBucket: "propz-mern.appspot.com",
  messagingSenderId: "617614351152",
  appId: "1:617614351152:web:c201beb1748bf87d9786f5",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
