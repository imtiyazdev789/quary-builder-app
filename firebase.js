// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA024XvbFO12cqLo3pquzTFklOacpcaJQ8",
    authDomain: "buildquery-3d7c4.firebaseapp.com",
    projectId: "buildquery-3d7c4",
    storageBucket: "buildquery-3d7c4.firebasestorage.app",
    messagingSenderId: "135308353332",
    appId: "1:135308353332:web:66afbb22afafdbf65a0f61",
    measurementId: "G-EBW24PEKMV"
};

// Private Key
// h_rQj4zbjY2AYxevnz2P-sK4AqMaL1ObwnmDdytXfQk

// Google Map API Key
// AIzaSyA024XvbFO12cqLo3pquzTFklOacpcaJQ8

// Google Map Private Key
// AIzaSyDkosytBHNes7TdOJgzln-XewvE-7Z-jzw

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);