import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const config = JSON.parse(import.meta.env.VITE_FIREBASE_API);

if (!firebase.apps.length) {
    firebase.initializeApp(config);
}

export default firebase;
