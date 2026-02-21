import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCTuHGOOvnj3ABJwhOTIvrZxndT94-cwfE",
    authDomain: "family-app-90925.firebaseapp.com",
    projectId: "family-app-90925",
    storageBucket: "family-app-90925.firebasestorage.app",
    messagingSenderId: "671389199007",
    appId: "1:671389199007:web:74d17258bb18d9b8c790aa",
    measurementId: "G-FHN6DRF6T2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
