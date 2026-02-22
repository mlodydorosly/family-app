import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCTuHGOOvnj3ABJwhOTIvrZxndT94-cwfE",
    authDomain: "family-app-90925.firebaseapp.com",
    projectId: "family-app-90925",
    storageBucket: "family-app-90925.firebasestorage.app",
    messagingSenderId: "671389199007",
    appId: "1:671389199007:web:64fa38c0600e4ef9c790aa",
    measurementId: "G-NSDJCXH8B6"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
