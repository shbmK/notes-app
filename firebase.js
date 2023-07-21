
import { initializeApp } from "firebase/app";
import {getFirestore,collection} from "firebase/firestore"
const firebaseConfig = {
  apiKey: "AIzaSyC77Huix9pmx1FU1_YSBliHUBKCVGJTCRk",
  authDomain: "notes-app-9e9f9.firebaseapp.com",
  projectId: "notes-app-9e9f9",
  storageBucket: "notes-app-9e9f9.appspot.com",
  messagingSenderId: "1025817499464",
  appId: "1:1025817499464:web:3d4514184eaaf8121e057d"
};

const app = initializeApp(firebaseConfig);
export const db=getFirestore(app)
export const notesCollection=collection(db,"notes")