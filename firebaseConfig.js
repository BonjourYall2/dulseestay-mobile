import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBxqFvSpQuGHCGMEjpx_P9MBbPtoTHY9o0",
  authDomain: "dulsee-stay-5e318.firebaseapp.com",
  databaseURL:
    "https://dulsee-stay-5e318-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "dulsee-stay-5e318",
  storageBucket: "dulsee-stay-5e318.firebasestorage.app",
  messagingSenderId: "928478941642",
  appId: "1:928478941642:web:64fd7c8bcaaa5a70d6bf33",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
