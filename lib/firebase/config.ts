// Import fungsi inisialisasi dari Firebase core
import { initializeApp, getApps, getApp } from "firebase/app";
// Import modul autentikasi dari Firebase
import { getAuth } from "firebase/auth";

// Konfigurasi Firebase yang diambil dari Environment Variables
// Hal ini mencegah tereksposnya key secara hardcode pada source code
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Singleton pattern: Memastikan Firebase hanya diinisialisasi satu kali
// Mencegah error "Firebase App already exists" di environment Next.js (SSR/HMR)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Mengekspor instance autentikasi untuk digunakan di seluruh aplikasi
export const auth = getAuth(app);