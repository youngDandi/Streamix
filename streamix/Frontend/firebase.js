import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBfChvysoG_1SuiFZeLSzHKNaIzmjzDZhc",
    authDomain: "streamix-e49a4.firebaseapp.com",
    projectId: "streamix-e49a4",
    storageBucket: "streamix-e49a4.appspot.com",
    messagingSenderId: "39279604810",
    appId: "1:39279604810:web:06e907b7e4c12b1e0222b3",
    measurementId: "G-TKLTWB5N60"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export default firebase;
