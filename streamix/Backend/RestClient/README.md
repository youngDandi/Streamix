Vá nas extensões do Visual Studio Code e instale a extensão "REST Client" para poder fazer requisições.


// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBfChvysoG_1SuiFZeLSzHKNaIzmjzDZhc",
  authDomain: "streamix-e49a4.firebaseapp.com",
  projectId: "streamix-e49a4",
  storageBucket: "streamix-e49a4.appspot.com",
  messagingSenderId: "39279604810",
  appId: "1:39279604810:web:06e907b7e4c12b1e0222b3",
  measurementId: "G-TKLTWB5N60"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);