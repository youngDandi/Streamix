const express = require('express');
require('dotenv').config();
const app = express();
const port = 3001;
const {db} = require('./Database/firebase.js')


app.get('/users',async (req,res) => {
const usersRef = db.collection('users').doc('1')
const doc = await usersRef.get()
 if (!doc.exists()){
console.log("Does not exist")
return res.sendStatus(400);
} 
res.status(200).send(doc.data())
})

app.listen(port,()=>{
    console.log(`Listening on port ${port}`)
})