// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDC22KZNZcHbRkLSkAFrw4v5uLsz8p9UXs",
  authDomain: "nodestarter-7af15.firebaseapp.com",
  projectId: "nodestarter-7af15",
  storageBucket: "nodestarter-7af15.appspot.com",
  messagingSenderId: "633925691087",
  appId: "1:633925691087:web:2cb2330929b09b795139ba",
  measurementId: "G-ZRXEKFVS98"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
