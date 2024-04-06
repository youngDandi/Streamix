const {initializeApp, cert} = require('firebase-admin/app');
const {getFirestore} = require('firebase-admin/firestore');
require('dotenv').config();

const serviceAccount = JSON.parse(process.env.fireBase_API_KEY || {});
initializeApp({
    credential: cert(serviceAccount)
})
const db = getFirestore()
module.exports = {db}