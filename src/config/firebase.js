import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {

  apiKey: "AIzaSyDSVQ5SUUF0G1IlleVIibpNrrWZu8rcbcE",

  authDomain: "quiz-app-33f29.firebaseapp.com",

  projectId: "quiz-app-33f29",

  storageBucket: "quiz-app-33f29.appspot.com",

  messagingSenderId: "88826284662",

  appId: "1:88826284662:web:41df5c3b8179a5cec3ed57"

};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

export default app; // Export app as default

export { auth };


