// Configuración de Firebase
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
//import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-analytics.js";

// Tu configuración de Firebase (reemplaza con tus credenciales)
const firebaseConfig = {
  apiKey: "AIzaSyAwXeLUyl81D7QTXT4_hC2_B7mWAeuJ7FY",
  authDomain: "toysoft-free.firebaseapp.com",
  projectId: "toysoft-free",
  storageBucket: "toysoft-free.firebasestorage.app",
  messagingSenderId: "521255071852",
  appId: "1:521255071852:web:287a0e18e3bf2f8911e849"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


// Configurar proveedor de Google
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');

// Exportar para uso en otros archivos
window.auth = auth;
window.db = db;
window.googleProvider = googleProvider;
window.firebaseAuth = {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider
};
window.firebaseFirestore = {
  doc,
  setDoc,
  getDoc,
  updateDoc
};

console.log('Firebase configurado correctamente'); 