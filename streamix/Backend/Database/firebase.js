const {initializeApp, cert} = require('firebase-admin/app');
const {getFirestore} = require('firebase-admin/firestore');
require('dotenv').config();
const { getAuth } = require('firebase-admin/auth'); 
const serviceAccount = JSON.parse(process.env.FIREBASE_API_KEY || {});
initializeApp({
    credential: cert(serviceAccount)
}) 
const db = getFirestore()
const userAuth = getAuth();

module.exports = {db,userAuth}