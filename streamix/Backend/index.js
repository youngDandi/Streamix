const express = require('express');
require('dotenv').config();
// process.env.{nomedavariável}
const app = express();
const port = 3001;

app.listen(port,()=>{
    console.log(`Listening on port ${port}`)
})