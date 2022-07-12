// Import the functions you need from the SDKs you need
import { FirebaseOptions, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";
import {getStorage} from 'firebase/storage'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig : FirebaseOptions = {
  apiKey: "AIzaSyDphsQUVx4HXf5rSRgTIyjY050afcZWeJM",
  authDomain: "first-9b59f.firebaseapp.com",
  projectId: "first-9b59f",
  storageBucket: "first-9b59f.appspot.com",
  messagingSenderId: "1046075190789",
  appId: "1:1046075190789:web:4a8e141f430d05c2d6f66c",
  measurementId: "G-CN7745VBJB",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = initializeFirestore(app,{experimentalForceLongPolling : true})
const cloudStorage = getStorage(app)
export {app,auth,db,cloudStorage}