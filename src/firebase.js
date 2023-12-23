import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDyERBMrIpTvimrrIfVXJ1Ya2LzMtq4U-o",
  authDomain: "letschat-1fa61.firebaseapp.com",
  projectId: "letschat-1fa61",
  storageBucket: "letschat-1fa61.appspot.com",
  messagingSenderId: "167978930710",
  appId: "1:167978930710:web:3aab76054affd2941a9b37"
};

export const app = initializeApp(firebaseConfig);
export const auth=getAuth()
export const storage=getStorage()
export const db=getFirestore()